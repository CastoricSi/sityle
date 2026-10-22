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
	{ align = "start", matchWidth = false, gap = 6, need = 260 }: { align?: "start" | "end"; matchWidth?: boolean; gap?: number; need?: number } = {},
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
			setPlacement({
				up,
				style: {
					position: "fixed",
					top: up ? undefined : r.bottom + gap,
					bottom: up ? innerHeight - r.top + gap : undefined,
					left: align === "start" ? Math.max(8, r.left) : undefined,
					right: align === "end" ? Math.max(8, vw - r.right) : undefined,
					width: matchWidth ? r.width : undefined,
					maxWidth: `calc(100vw - 16px)`,
					// the room left on screen; CSS caps max-height with it, so a class can still lower it
					["--si-room" as string]: `${Math.max(120, room)}px`,
				},
			});
		};
		place();
		addEventListener("scroll", place, true);
		addEventListener("resize", place);
		return () => {
			removeEventListener("scroll", place, true);
			removeEventListener("resize", place);
		};
	}, [anchor, open, align, matchWidth, gap, need]);
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
