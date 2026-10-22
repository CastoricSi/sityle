import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn, inkHandler, spring } from "../core";
import { useIsClient } from "../internal/client";
import { LAYER_ATTR } from "../internal/modal";
import { useAnchoredPosition, useDismiss } from "../internal/popover";

export type MenuEntry = { label: React.ReactNode; icon?: React.ReactNode; kbd?: string; danger?: boolean; onSelect: () => void } | "divider";

/**
 * Drop-down that unfolds from its trigger; items arrive one after another.
 * Arrow keys move, Escape closes and returns focus to the trigger.
 */
export function Menu({
	trigger,
	items,
	align = "start",
}: {
	trigger: (props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">) => React.ReactNode;
	items: MenuEntry[];
	align?: "start" | "end";
}) {
	const [open, setOpen] = useState(false);
	const anchor = useRef<HTMLSpanElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const id = useId();
	const client = useIsClient();
	const placement = useAnchoredPosition(anchor, open, { align });

	useDismiss(open, [anchor, list], () => setOpen(false));
	useEffect(() => {
		if (!open) return;
		const t = setTimeout(() => list.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus({ preventScroll: true }), 40);
		return () => clearTimeout(t);
	}, [open]);

	const onKey = (e: React.KeyboardEvent) => {
		const els = [...(list.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? [])];
		const i = els.indexOf(document.activeElement as HTMLButtonElement);
		if (e.key === "ArrowDown") {
			e.preventDefault();
			els[(i + 1) % els.length]?.focus();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			els[(i - 1 + els.length) % els.length]?.focus();
		} else if (e.key === "Escape") {
			// close the menu, not the dialog around it
			e.stopPropagation();
			setOpen(false);
			anchor.current?.querySelector<HTMLButtonElement>("[aria-haspopup]")?.focus();
		}
	};

	let n = 0;
	return (
		<span ref={anchor} className="si-menu-anchor">
			{trigger({ "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": id, onClick: () => setOpen((o) => !o) })}
			{client &&
				createPortal(
					<AnimatePresence>
						{open && placement && (
							<motion.div
								ref={list}
								id={id}
								role="menu"
								{...{ [LAYER_ATTR]: "" }}
								className="si-menu"
								style={{ ...placement.style, transformOrigin: `${align === "end" ? "calc(100% - 20px)" : "20px"} ${placement.up ? "100%" : "0"}` }}
								onKeyDown={onKey}
								initial={{ opacity: 0, scale: 0.9, y: -6 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.12 } }}
								transition={spring.bouncy}
							>
								{items.map((item, k) => {
									if (item === "divider") return <hr key={k} />;
									const delay = 0.03 + n++ * 0.028;
									return (
										<motion.button
											key={k}
											type="button"
											role="menuitem"
											className={cn("si-menu-item si-ink-host", item.danger && "is-danger")}
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.2 } }}
											onPointerDown={inkHandler()}
											onClick={() => {
												setOpen(false);
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
