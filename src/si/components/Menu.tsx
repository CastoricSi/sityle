import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn, inkHandler, spring } from "../core";
import { useIsClient } from "../internal/client";
import { LAYER_ATTR } from "../internal/modal";
import { useAnchoredPosition, useDismiss } from "../internal/popover";

export type MenuEntry =
	| {
			label: React.ReactNode;
			icon?: React.ReactNode;
			kbd?: string;
			danger?: boolean;
			disabled?: boolean;
			onSelect: () => void;
			/** For typeahead when the label is not plain text. */ textValue?: string;
	  }
	| "divider";

export type MenuProps = {
	/** Renders the button that opens the menu; spread the given props onto it. */
	trigger: (props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">) => React.ReactNode;
	items: MenuEntry[];
	align?: "start" | "end";
	/** Accessible name of the menu. */
	label?: string;
	/** Class for the floating panel. */
	className?: string;
};

/**
 * Drop-down that unfolds from its trigger; items arrive one after another.
 * ↑ ↓ Home End move, typing jumps to an item by its first letter, Enter picks,
 * Escape closes and returns focus to the trigger, Tab closes and moves on.
 */
export function Menu({ trigger, items, align = "start", label, className }: MenuProps) {
	// where focus goes once the menu is open: the first item, or the last (opened with ↑)
	const [open, setOpen] = useState<false | "first" | "last">(false);
	const anchor = useRef<HTMLSpanElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const id = useId();
	const client = useIsClient();
	const placement = useAnchoredPosition(anchor, !!open, { align });
	const triggerEl = () => anchor.current?.querySelector<HTMLButtonElement>("[aria-haspopup]");
	const itemEls = () => [...(list.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];

	useDismiss(!!open, [anchor, list], () => setOpen(false));
	useEffect(() => {
		if (!open) return;
		const t = setTimeout(() => {
			const els = itemEls();
			(open === "last" ? els[els.length - 1] : els[0])?.focus({ preventScroll: true });
		}, 40);
		return () => clearTimeout(t);
	}, [open]);

	const onKey = (e: React.KeyboardEvent) => {
		const els = itemEls();
		const i = els.indexOf(document.activeElement as HTMLButtonElement);
		const move = (to: number) => {
			e.preventDefault();
			els[(to + els.length) % els.length]?.focus();
		};
		if (e.key === "ArrowDown") move(i + 1);
		else if (e.key === "ArrowUp") move(i - 1);
		else if (e.key === "Home") move(0);
		else if (e.key === "End") move(els.length - 1);
		else if (e.key === "Escape") {
			// close the menu, not the dialog around it
			e.stopPropagation();
			setOpen(false);
			triggerEl()?.focus();
		} else if (e.key === "Tab") {
			// back on the trigger, the Tab itself then moves on from there
			setOpen(false);
			triggerEl()?.focus();
		} else if (e.key.length === 1 && /\S/.test(e.key)) {
			const k = e.key.toLowerCase();
			const text = (el: HTMLElement) => (el.dataset.text ?? el.textContent ?? "").trim().toLowerCase();
			const next = els.findIndex((el, j) => j > i && text(el).startsWith(k));
			const first = els.findIndex((el) => text(el).startsWith(k));
			if (next >= 0 || first >= 0) move(next >= 0 ? next : first);
		}
	};

	// items fade in one after another
	const order = new Map<number, number>();
	items.forEach((item, k) => item !== "divider" && order.set(k, order.size));

	return (
		<span ref={anchor} className="si-menu-anchor">
			{trigger({
				"aria-haspopup": "menu",
				"aria-expanded": !!open,
				"aria-controls": open ? id : undefined,
				onClick: () => setOpen((o) => (o ? false : "first")),
				onKeyDown: (e) => {
					if (e.key === "ArrowDown" || e.key === "ArrowUp") {
						e.preventDefault();
						setOpen(e.key === "ArrowUp" ? "last" : "first");
					}
				},
			})}
			{client &&
				createPortal(
					<AnimatePresence>
						{open && placement && (
							<motion.div
								ref={list}
								id={id}
								role="menu"
								{...{ [LAYER_ATTR]: "" }}
								aria-label={label}
								className={cn("si-menu", className)}
								style={{ ...placement.style, transformOrigin: `${align === "end" ? "calc(100% - 20px)" : "20px"} ${placement.up ? "100%" : "0"}` }}
								onKeyDown={onKey}
								initial={{ opacity: 0, scale: 0.9, y: -6 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.12 } }}
								transition={spring.bouncy}
							>
								{items.map((item, k) => {
									if (item === "divider") return <hr key={k} />;
									return (
										<motion.button
											key={k}
											type="button"
											role="menuitem"
											tabIndex={-1}
											disabled={item.disabled}
											data-text={item.textValue}
											className={cn("si-menu-item si-ink-host", item.danger && "is-danger")}
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0, transition: { delay: 0.03 + order.get(k)! * 0.028, duration: 0.2 } }}
											onPointerDown={inkHandler()}
											onClick={() => {
												setOpen(false);
												triggerEl()?.focus();
												item.onSelect();
											}}
										>
											{item.icon}
											{item.label}
											{item.kbd && <kbd>{item.kbd}</kbd>}
										</motion.button>
									);
								})}
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</span>
	);
}
