import { AnimatePresence, motion } from "motion/react";
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn, popover } from "../core";
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
	/** The panel is exactly as wide as the trigger's box (a switcher that fills a sidebar). */
	matchWidth?: boolean;
};

/* ── shared by Menu and ContextMenu ── */

const enabledItems = (list: HTMLElement | null) => [...(list?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];

/** Focus the first (or last) item once the panel and its items are in the page. */
function useFocusItem(list: React.RefObject<HTMLElement | null>, open: false | "first" | "last") {
	useEffect(() => {
		if (!open) return;
		const t = setTimeout(() => {
			const els = enabledItems(list.current);
			(open === "last" ? els[els.length - 1] : els[0])?.focus({ preventScroll: true });
		}, 40);
		return () => clearTimeout(t);
	}, [list, open]);
}

/** ↑ ↓ Home End move (wrapping), a letter jumps to the next item starting with it; Escape and Tab close. */
function menuKeys(e: React.KeyboardEvent, list: HTMLElement | null, close: (key: "Escape" | "Tab") => void) {
	const els = enabledItems(list);
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
		close("Escape");
	} else if (e.key === "Tab") {
		// back where focus came from, the Tab itself then moves on from there
		close("Tab");
	} else if (e.key.length === 1 && /\S/.test(e.key)) {
		const k = e.key.toLowerCase();
		const text = (el: HTMLElement) => (el.dataset.text ?? el.textContent ?? "").trim().toLowerCase();
		const next = els.findIndex((el, j) => j > i && text(el).startsWith(k));
		const first = els.findIndex((el) => text(el).startsWith(k));
		if (next >= 0 || first >= 0) move(next >= 0 ? next : first);
	}
}

type Entry = MenuEntry | { heading: React.ReactNode };

/** The rows of a menu panel; items fade in one after another, in place (sliding them too reads as a jump). */
function MenuItems({ items, onPick }: { items: Entry[]; onPick: (item: Exclude<MenuEntry, "divider">) => void }) {
	const order = new Map<number, number>();
	items.forEach((item, k) => item !== "divider" && !("heading" in item) && order.set(k, order.size));
	return items.map((item, k) => {
		if (item === "divider") return <hr key={k} />;
		if ("heading" in item)
			return (
				<div key={k} role="presentation" className="si-menu-heading">
					{item.heading}
				</div>
			);
		return (
			<motion.button
				key={k}
				type="button"
				role="menuitem"
				tabIndex={-1}
				disabled={item.disabled}
				data-text={item.textValue}
				className={cn("si-menu-item", item.danger && "is-danger")}
				initial={{ opacity: 0 }}
				// fades to the disabled look too: the inline opacity would override the stylesheet's
				animate={{ opacity: item.disabled ? 0.45 : 1, transition: { delay: 0.02 + order.get(k)! * 0.02, duration: 0.16 } }}
				onClick={() => onPick(item)}
			>
				{item.icon}
				{item.label}
				{item.kbd && <kbd>{item.kbd}</kbd>}
			</motion.button>
		);
	});
}

/**
 * Drop-down that unfolds from its trigger; items arrive one after another.
 * ↑ ↓ Home End move, typing jumps to an item by its first letter, Enter picks,
 * Escape closes and returns focus to the trigger, Tab closes and moves on.
 */
export function Menu({ trigger, items, align = "start", label, className, matchWidth = false }: MenuProps) {
	// where focus goes once the menu is open: the first item, or the last (opened with ↑)
	const [open, setOpen] = useState<false | "first" | "last">(false);
	const anchor = useRef<HTMLSpanElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const id = useId();
	const client = useIsClient();
	const placement = useAnchoredPosition(anchor, !!open, { align, matchWidth, panel: list });
	const triggerEl = () => anchor.current?.querySelector<HTMLButtonElement>("[aria-haspopup]");

	useDismiss(!!open, [anchor, list], () => setOpen(false));
	useFocusItem(list, open);

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
								onKeyDown={(e) =>
									menuKeys(e, list.current, () => {
										setOpen(false);
										triggerEl()?.focus();
									})
								}
								{...popover(placement.up)}
							>
								<MenuItems
									items={items}
									onPick={(item) => {
										setOpen(false);
										triggerEl()?.focus();
										item.onSelect();
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</span>
	);
}

/* ── ContextMenu ── */

/** A ContextMenu row: Menu's entries, plus a small heading over a group of items. */
export type ContextMenuEntry = MenuEntry | { heading: React.ReactNode };

/** Where a context menu opens: the pointer, in viewport (client) coordinates. */
export type ContextMenuPoint = { x: number; y: number };

type ContextMenuCommon = {
	items: ContextMenuEntry[];
	/** Accessible name of the menu. */
	label?: string;
	/** Class for the floating panel. */
	className?: string;
};

export type ContextMenuProps = ContextMenuCommon &
	(
		| {
				/** One element: right-clicking it (or the menu key / Shift+F10 while it has focus) opens the menu there. */
				children: React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>;
				at?: never;
				onClose?: never;
		  }
		| {
				/** Controlled: where the menu is open, or null when closed (open it from your own onContextMenu). */
				at: ContextMenuPoint | null;
				onClose: () => void;
				children?: never;
		  }
	);

/** Where a contextmenu event wants the menu: the pointer, or the element's corner when the keyboard opened it. */
export function contextMenuPoint(e: React.MouseEvent | MouseEvent): ContextMenuPoint {
	if (e.clientX || e.clientY) return { x: e.clientX, y: e.clientY };
	const r = (e.currentTarget as Element | null)?.getBoundingClientRect?.() ?? (e.target as Element).getBoundingClientRect();
	return { x: r.left + 8, y: r.bottom };
}

/**
 * The menu a right-click opens, at the pointer: the same panel and keys as Menu
 * (↑ ↓ Home End, typeahead, Enter picks, Escape / Tab close and hand focus back),
 * and `{ heading }` rows to title a group. It opens to the left or upwards when
 * the pointer is near the screen's edge, and closes on a press outside, scrolling,
 * resizing or leaving the window.
 * Wrap one element (`children`), or control it with `at` + `onClose` when the items
 * depend on what was clicked (select it first in your onContextMenu, then open).
 */
export function ContextMenu(props: ContextMenuProps) {
	const { items, label, className, children } = props;
	const controlled = props.at !== undefined;
	const [own, setOwn] = useState<ContextMenuPoint | null>(null);
	const at = controlled ? props.at : own;
	const closeRef = useRef(props.onClose);
	useLayoutEffect(() => {
		closeRef.current = props.onClose;
	});
	const close = () => (controlled ? closeRef.current?.() : setOwn(null));

	const list = useRef<HTMLDivElement>(null);
	const client = useIsClient();
	const lastFocus = useRef<HTMLElement | null>(null);
	const [measured, setPlace] = useState<{ at: ContextMenuPoint; left: number; top: number; up: boolean; leftward: boolean; room: number } | null>(null);
	// placed for this opening (until it is measured, the panel stays invisible)
	const place = measured && at && measured.at.x === at.x && measured.at.y === at.y ? measured : null;
	const open = at !== null;

	// The panel is measured before it paints: it opens to the left / upwards when it wouldn't fit.
	useLayoutEffect(() => {
		if (!at) return;
		const el = list.current;
		const w = el?.offsetWidth ?? 0;
		const h = el?.offsetHeight ?? 0;
		// the width without a scrollbar (jsdom and the like report 0: the window's width then)
		const vw = document.documentElement.clientWidth || innerWidth;
		const vh = innerHeight;
		const leftward = at.x + w > vw - 8 && at.x - w >= 8;
		const up = at.y + h > vh - 8 && at.y > vh - at.y;
		setPlace({
			at,
			left: Math.max(8, Math.min(leftward ? at.x - w : at.x, vw - w - 8)),
			top: up ? Math.max(8, at.y - h) : at.y,
			up,
			leftward,
			room: (up ? at.y : vh - at.y) - 8,
		});
		// by value: an inline `at={{ x, y }}` is a new object on every render
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [at?.x, at?.y]);

	useLayoutEffect(() => {
		if (!open) return;
		lastFocus.current = document.activeElement as HTMLElement | null;
		const dismiss = () => close();
		const onScroll = (e: Event) => !list.current?.contains(e.target as Node) && close();
		addEventListener("scroll", onScroll, true);
		addEventListener("resize", dismiss);
		addEventListener("blur", dismiss);
		return () => {
			removeEventListener("scroll", onScroll, true);
			removeEventListener("resize", dismiss);
			removeEventListener("blur", dismiss);
		};
		// close reads the latest onClose through a ref
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);
	useDismiss(open, [list], close);
	useFocusItem(list, open && "first");

	const giveFocusBack = () => {
		const back = lastFocus.current;
		if (back?.isConnected) back.focus({ preventScroll: true });
	};

	const panel =
		client &&
		createPortal(
			<AnimatePresence>
				{at && (
					<motion.div
						ref={list}
						role="menu"
						{...{ [LAYER_ATTR]: "" }}
						aria-label={label}
						className={cn("si-menu si-context-menu", className)}
						style={{
							left: place?.left ?? at.x,
							top: place?.top ?? at.y,
							visibility: place ? undefined : "hidden",
							transformOrigin: `${place?.leftward ? "100%" : "0"} ${place?.up ? "100%" : "0"}`,
							["--si-room" as string]: place ? `${Math.max(120, place.room)}px` : undefined,
						}}
						onKeyDown={(e) =>
							menuKeys(e, list.current, () => {
								close();
								giveFocusBack();
							})
						}
						onContextMenu={(e) => e.preventDefault()}
						{...popover(place?.up ?? false)}
					>
						<MenuItems
							items={items}
							onPick={(item) => {
								close();
								giveFocusBack();
								item.onSelect();
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>,
			document.body,
		);

	if (controlled) return panel || null;
	return (
		<>
			{cloneElement(children!, {
				onContextMenu: (e: React.MouseEvent) => {
					children!.props.onContextMenu?.(e);
					if (e.defaultPrevented) return;
					e.preventDefault();
					setOwn(contextMenuPoint(e));
				},
			})}
			{panel}
		</>
	);
}
