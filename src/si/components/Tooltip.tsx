import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn, spring } from "../core";
import { useIsClient } from "../internal/client";

// Focus that follows a key press (Tab) shows the tooltip; focus moved by
// code (e.g. returned after a drawer closes) or by touch does not.
let lastKey = 0;
let listening = false;
function listenForKeys() {
	if (listening) return;
	listening = true;
	addEventListener("keydown", () => (lastKey = Date.now()), true);
	addEventListener("pointerdown", () => (lastKey = 0), true);
}
const keyboardRecently = () => Date.now() - lastKey < 1000;

/**
 * Small ink label above its child on hover / keyboard focus (not on touch).
 * `open` forces it on (e.g. "已复制" after a copy).
 */
export function Tooltip({ content, open, children, className }: { content: React.ReactNode; open?: boolean; children: React.ReactNode; className?: string }) {
	const anchor = useRef<HTMLSpanElement>(null);
	const tip = useRef<HTMLDivElement>(null);
	const [hover, setHover] = useState(false);
	const [pos, setPos] = useState({ left: -999, top: -999 });
	const shown = open ?? hover;
	const client = useIsClient();
	useEffect(listenForKeys, []);

	useLayoutEffect(() => {
		if (!shown || !anchor.current) return;
		const place = () => {
			const r = anchor.current!.getBoundingClientRect();
			const w = tip.current?.offsetWidth ?? 0;
			const h = tip.current?.offsetHeight ?? 0;
			const above = r.top - h - 8;
			setPos({ left: Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)), top: above >= 8 ? above : r.bottom + 8 });
		};
		place();
		const raf = requestAnimationFrame(place);
		addEventListener("scroll", place, true);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener("scroll", place, true);
		};
	}, [shown, content]);

	return (
		<span
			ref={anchor}
			className={cn("si-tip-anchor", className)}
			onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
			onPointerLeave={() => setHover(false)}
			onFocus={(e) => keyboardRecently() && e.target.matches(":focus-visible") && setHover(true)}
			onBlur={() => setHover(false)}
		>
			{children}
			{client &&
				createPortal(
				<AnimatePresence>
					{shown && (
						<motion.div
							ref={tip}
							role="tooltip"
							className="si-tip"
							style={{ left: pos.left, top: pos.top, transformOrigin: "50% 100%" }}
							initial={{ opacity: 0, y: 4, scale: 0.94 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 2, scale: 0.96, transition: { duration: 0.1 } }}
							transition={spring.bouncy}
						>
							{content}
						</motion.div>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</span>
	);
}
