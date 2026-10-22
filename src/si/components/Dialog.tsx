import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn, spring } from "../core";
import { useIsClient, useMediaQuery } from "../internal/client";
import { LAYER_ATTR, lockScroll, tabbables } from "../internal/modal";
import { Seal } from "./Display";

/**
 * Only for decisions. The page dims and blurs, the dialog is set down like a
 * sheet of paper, and an optional seal (朱印) is stamped on it.
 * Escape / clicking outside closes; focus goes to the first button and back
 * to where it was afterwards.
 * On phones (<=600px) it becomes a sheet sliding up from the bottom, or with
 * `phone="full"` (long content: settings, forms) it fills the screen.
 */
export function Dialog({
	open,
	onClose,
	title,
	children,
	actions,
	seal,
	wide,
	phone = "sheet",
	id,
	className,
	style,
	"aria-describedby": describedBy,
}: Pick<React.ComponentPropsWithRef<"div">, "id" | "className" | "style" | "aria-describedby"> & {
	open: boolean;
	onClose: () => void;
	title: React.ReactNode;
	children?: React.ReactNode;
	actions?: React.ReactNode;
	/** One character stamped in the corner (e.g. 删 for a delete). */
	seal?: string;
	wide?: boolean;
	/** How it shows on phones: a bottom sheet (default) or full screen. */
	phone?: "sheet" | "full";
}) {
	const titleId = useId();
	const small = useMediaQuery("(max-width: 600px)");
	const client = useIsClient();
	const mode = small ? phone : "center";
	const motionProps =
		mode === "center"
			? { initial: { opacity: 0, scale: 0.92, y: 14 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.14 } }, transition: spring.bouncy }
			: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%", transition: { duration: 0.22, ease: [0.55, 0, 0.75, 0.2] as const } }, transition: { type: "spring" as const, stiffness: 420, damping: 40 } };
	const box = useRef<HTMLDivElement>(null);
	const lastFocus = useRef<HTMLElement | null>(null);
	const downOnScrim = useRef(false);
	// Callers pass inline arrows; keep the latest without re-running the open/close effect
	// (re-running it would hand focus back to the trigger on every parent render).
	const closeRef = useRef(onClose);
	useLayoutEffect(() => {
		closeRef.current = onClose;
	});

	useEffect(() => {
		if (!open) return;
		lastFocus.current = document.activeElement as HTMLElement | null;
		const unlock = lockScroll();
		// Focus the first action (the safe choice); without actions, the first control.
		const t = setTimeout(() => {
			const root = box.current;
			if (!root) return;
			const el = root.querySelector<HTMLElement>(".si-dialog-actions button:not([disabled])") ?? tabbables(root)[0] ?? root;
			el.focus({ preventScroll: true });
		}, 30);
		const isTop = () => {
			const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
			return dialogs[dialogs.length - 1] === box.current;
		};
		const onKey = (e: KeyboardEvent) => {
			const root = box.current;
			// Only the topmost dialog answers (a confirm over settings closes alone).
			if (!root || !isTop() || e.defaultPrevented) return;
			if (e.key === "Escape") {
				e.preventDefault();
				closeRef.current();
			} else if (e.key === "Tab") {
				// Tab cycles inside the dialog; it never reaches the page behind.
				const els = tabbables(root);
				if (!els.length) return void e.preventDefault();
				const first = els[0]!;
				const last = els[els.length - 1]!;
				const at = document.activeElement;
				if (e.shiftKey && (at === first || !root.contains(at))) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && (at === last || !root.contains(at))) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		// Focus that lands behind the dialog (a click, a script) is pulled back in.
		const onFocusIn = (e: FocusEvent) => {
			const root = box.current;
			const target = e.target as HTMLElement;
			if (!root || !isTop() || root.contains(target) || target.closest?.(`[${LAYER_ATTR}]`)) return;
			(tabbables(root)[0] ?? root).focus({ preventScroll: true });
		};
		addEventListener("keydown", onKey);
		document.addEventListener("focusin", onFocusIn);
		return () => {
			clearTimeout(t);
			unlock();
			removeEventListener("keydown", onKey);
			document.removeEventListener("focusin", onFocusIn);
			const back = lastFocus.current;
			// Return focus unless the app already moved it somewhere else on purpose.
			const at = document.activeElement;
			if (back?.isConnected && (!at || at === document.body || box.current?.contains(at))) back.focus({ preventScroll: true });
		};
	}, [open]);

	if (!client) return null;
	return createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					className={cn("si-scrim", mode !== "center" && `is-${mode}`)}
					// Close when a press both starts and ends on the backdrop. Pressing it
					// starts no text selection (the dialog slides away under the cursor), and
					// dragging out of a text box onto it doesn't close.
					onMouseDown={(e) => {
						downOnScrim.current = e.target === e.currentTarget;
						if (downOnScrim.current) e.preventDefault();
					}}
					onMouseUp={(e) => {
						if (downOnScrim.current && e.target === e.currentTarget) onClose();
						downOnScrim.current = false;
					}}
					// the scrim itself stays opaque; its layers below do the fading
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 1, pointerEvents: "none", transition: { duration: 0.16 } }}
				>
					<motion.div
						className="si-scrim-blur"
						aria-hidden="true"
						initial={{ backdropFilter: "blur(0px)" }}
						animate={{ backdropFilter: "blur(6px)" }}
						exit={{ backdropFilter: "blur(0px)", transition: { duration: 0.16 } }}
						transition={{ duration: 0.2 }}
					/>
					<motion.div
						className="si-scrim-tint"
						aria-hidden="true"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.16 } }}
						transition={{ duration: 0.2 }}
					/>
					<motion.div
						ref={box}
						role="dialog"
						aria-modal="true"
						id={id}
						aria-labelledby={titleId}
						aria-describedby={describedBy}
						tabIndex={-1}
						style={style}
						className={cn("si-dialog", seal && "has-seal", wide && "is-wide", mode !== "center" && `is-${mode}`, className)}
						{...motionProps}
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
