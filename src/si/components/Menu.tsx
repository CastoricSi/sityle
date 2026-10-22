import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { cn, inkHandler, spring } from "../core";

export type MenuEntry =
	| { label: React.ReactNode; icon?: React.ReactNode; kbd?: string; danger?: boolean; onSelect: () => void }
	| "divider";

/**
 * Drop-down that unfolds from its trigger; items arrive one after another.
 * Arrow keys move, Escape closes and returns focus to the trigger.
 */
export function Menu({ trigger, items, align = "start" }: { trigger: (props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">) => React.ReactNode; items: MenuEntry[]; align?: "start" | "end" }) {
	const [open, setOpen] = useState(false);
	const anchor = useRef<HTMLSpanElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const id = useId();

	useEffect(() => {
		if (!open) return;
		const close = (e: MouseEvent) => !anchor.current?.contains(e.target as Node) && setOpen(false);
		document.addEventListener("mousedown", close);
		const t = setTimeout(() => list.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus({ preventScroll: true }), 40);
		return () => {
			document.removeEventListener("mousedown", close);
			clearTimeout(t);
		};
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
			setOpen(false);
			anchor.current?.querySelector<HTMLButtonElement>("[aria-haspopup]")?.focus();
		}
	};

	let n = 0;
	return (
		<span ref={anchor} className="si-menu-anchor">
			{trigger({ "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": id, onClick: () => setOpen((o) => !o) })}
			<AnimatePresence>
				{open && (
					<motion.div
						ref={list}
						id={id}
						role="menu"
						className="si-menu"
						style={align === "end" ? { left: "auto", right: 0, transformOrigin: "calc(100% - 20px) 0" } : undefined}
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
			</AnimatePresence>
		</span>
	);
}
