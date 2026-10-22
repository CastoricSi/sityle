import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { cn, spring } from "../core";
import { Seal } from "./Display";

/**
 * Only for decisions. The page dims and blurs, the dialog is set down like a
 * sheet of paper, and an optional seal (朱印) is stamped on it.
 * Escape / clicking outside closes; focus goes to the first button and back
 * to where it was afterwards.
 */
export function Dialog({
	open,
	onClose,
	title,
	children,
	actions,
	seal,
	wide,
}: {
	open: boolean;
	onClose: () => void;
	title: React.ReactNode;
	children?: React.ReactNode;
	actions?: React.ReactNode;
	/** One character stamped in the corner (e.g. 删 for a delete). */
	seal?: string;
	wide?: boolean;
}) {
	const titleId = useId();
	const box = useRef<HTMLDivElement>(null);
	const lastFocus = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!open) return;
		lastFocus.current = document.activeElement as HTMLElement | null;
		const t = setTimeout(() => box.current?.querySelector<HTMLElement>(".si-dialog-actions button, button, input")?.focus(), 30);
		// Only the topmost dialog answers Escape (a confirm over settings closes alone).
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			const dialogs = document.querySelectorAll('[role="dialog"]');
			if (dialogs[dialogs.length - 1] === box.current) onClose();
		};
		addEventListener("keydown", onKey);
		return () => {
			clearTimeout(t);
			removeEventListener("keydown", onKey);
			lastFocus.current?.focus?.();
		};
	}, [open, onClose]);

	return createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					className="si-scrim"
					onMouseDown={(e) => e.target === e.currentTarget && onClose()}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, transition: { duration: 0.16 } }}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						ref={box}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						className={cn("si-dialog", seal && "has-seal", wide && "is-wide")}
						initial={{ opacity: 0, scale: 0.92, y: 14 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.14 } }}
						transition={spring.bouncy}
					>
						{seal && (
							<motion.span
								className="si-dialog-seal"
								style={{ display: "grid" }}
								initial={{ scale: 1.6, rotate: 10, opacity: 0 }}
								animate={{ scale: 1, rotate: 10, opacity: 0.85 }}
								transition={{ ...spring.bouncy, delay: 0.12 }}
							>
								<Seal size={54} outline style={{ transform: "none" }}>
									{seal}
								</Seal>
							</motion.span>
						)}
						<h2 id={titleId}>{title}</h2>
						{children && <div className="si-dialog-body">{children}</div>}
						{actions && <div className="si-dialog-actions">{actions}</div>}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
