import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { spring } from "../core";

/**
 * Small ink label above its child on hover / keyboard focus (not on touch).
 * `open` forces it on (e.g. "已复制" after a copy).
 */
export function Tooltip({ content, open, children }: { content: React.ReactNode; open?: boolean; children: React.ReactNode }) {
	const anchor = useRef<HTMLSpanElement>(null);
	const tip = useRef<HTMLDivElement>(null);
	const [hover, setHover] = useState(false);
	const [pos, setPos] = useState({ left: -999, top: -999 });
	const shown = open ?? hover;

	useLayoutEffect(() => {
		if (!shown || !anchor.current) return;
		const place = () => {
			const r = anchor.current!.getBoundingClientRect();
			const w = tip.current?.offsetWidth ?? 0;
			const h = tip.current?.offsetHeight ?? 0;
			setPos({ left: Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)), top: r.top - h - 8 });
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
			style={{ display: "inline-flex" }}
			onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
			onPointerLeave={() => setHover(false)}
			onFocus={(e) => e.target.matches(":focus-visible") && setHover(true)}
			onBlur={() => setHover(false)}
		>
			{children}
			{createPortal(
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
