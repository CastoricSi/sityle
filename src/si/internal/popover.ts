import { useLayoutEffect, useRef, useState, type RefObject } from "react";

export type Placement = {
	/** Opens above the anchor (not enough room below). */
	up: boolean;
	style: React.CSSProperties;
};

/**
 * Fixed position for a popover portaled to <body>, next to its anchor: below
 * it, or above when there is less than `need` px below and more room above.
 * Follows scrolling and resizing while open, so no overflow:hidden parent
 * (a dialog, a card) can clip it.
 */
export function useAnchoredPosition(
	anchor: RefObject<HTMLElement | null>,
	open: boolean,
	{
		align = "start",
		matchWidth = false,
		gap = 6,
		need = 260,
		panel,
	}: {
		align?: "start" | "end";
		matchWidth?: boolean;
		gap?: number;
		need?: number;
		/** The popover itself: once it is there, its width keeps it on screen. */
		panel?: RefObject<HTMLElement | null>;
	} = {},
): Placement | null {
	const [placement, setPlacement] = useState<Placement | null>(null);
	useLayoutEffect(() => {
		if (!open) return;
		const place = () => {
			const el = anchor.current;
			if (!el) return;
			const r = el.getBoundingClientRect();
			const below = innerHeight - r.bottom;
			const up = below < need && r.top > below;
			const room = (up ? r.top : below) - gap - 8;
			const vw = document.documentElement.clientWidth;
			// as wide as the trigger, or (once it is there) the popover's own width
			const w = matchWidth ? r.width : (panel?.current?.offsetWidth ?? 0);
			// on screen: a menu by a trigger at the screen's edge opens inward
			const inside = (x: number) => Math.max(8, Math.min(x, vw - w - 8));
			setPlacement({
				up,
				style: {
					position: "fixed",
					top: up ? undefined : r.bottom + gap,
					bottom: up ? innerHeight - r.top + gap : undefined,
					left: align === "start" ? inside(r.left) : undefined,
					right: align === "end" ? inside(vw - r.right) : undefined,
					width: matchWidth ? r.width : undefined,
					maxWidth: `calc(100vw - 16px)`,
					// the room left on screen; CSS caps max-height with it, so a class can still lower it
					["--si-room" as string]: `${Math.max(120, room)}px`,
				},
			});
		};
		place();
		// again once the popover has rendered and has a width
		const raf = requestAnimationFrame(place);
		addEventListener("scroll", place, true);
		addEventListener("resize", place);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener("scroll", place, true);
			removeEventListener("resize", place);
		};
	}, [anchor, open, align, matchWidth, gap, need, panel]);
	return open ? placement : null;
}

/** Closes on a press outside every given element (anchor + its portaled popover). */
export function useDismiss(open: boolean, refs: Array<RefObject<HTMLElement | null>>, close: () => void) {
	const latest = useRef({ refs, close });
	useLayoutEffect(() => {
		latest.current = { refs, close };
	});
	useLayoutEffect(() => {
		if (!open) return;
		const onDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (!latest.current.refs.some((r) => r.current?.contains(t))) latest.current.close();
		};
		document.addEventListener("pointerdown", onDown);
		return () => document.removeEventListener("pointerdown", onDown);
	}, [open]);
}
