import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn, inkHandler, spring } from "../core";
import { InkDrop } from "./Feedback";
import { Tooltip } from "./Tooltip";

export type Color = "jade" | "azure" | "gold" | "danger";

export interface ButtonProps extends Omit<React.ComponentPropsWithRef<"button">, "color"> {
	/** solid: the one main action of an area. flat / bordered / light: secondary. ghost: quiet. shadow: solid that floats. */
	variant?: "solid" | "shadow" | "flat" | "bordered" | "light" | "ghost";
	color?: Color;
	size?: "sm" | "md" | "lg";
	icon?: React.ReactNode;
	/** Square button with only `icon`; give it `aria-label`. */
	iconOnly?: boolean;
	pill?: boolean;
	/** Swaps the label for an ink-drop loader (keeps the width). */
	loading?: boolean;
}

export function Button({
	variant = "solid",
	color = "jade",
	size = "md",
	icon,
	iconOnly,
	pill,
	loading,
	className,
	children,
	type = "button",
	onPointerDown,
	onClick,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			aria-busy={loading || undefined}
			// While loading it keeps focus but ignores presses (no double submit).
			aria-disabled={loading || undefined}
			onPointerDown={loading ? onPointerDown : inkHandler(onPointerDown)}
			onClick={(e) => {
				if (loading) return e.preventDefault();
				onClick?.(e);
			}}
			className={cn(
				"si-btn si-ink-host",
				`v-${variant}`,
				color !== "jade" && `is-${color}`,
				size !== "md" && `s-${size}`,
				iconOnly && "is-icon",
				pill && "is-pill",
				loading && "is-loading",
				className,
			)}
			{...props}
		>
			<span className="si-btn-label">
				{icon}
				{!iconOnly && children}
			</span>
			<span className="si-btn-spin" aria-hidden={!loading}>
				<InkDrop />
			</span>
		</button>
	);
}

export interface IconButtonProps extends React.ComponentPropsWithRef<"button"> {
	/** Tooltip and accessible name. */
	label: string;
	active?: boolean;
}

/** Quiet square button for one icon; always has a tooltip. */
export function IconButton({ label, active, className, children, onPointerDown, ...props }: IconButtonProps) {
	return (
		<Tooltip content={label}>
			<button
				type="button"
				aria-label={label}
				aria-pressed={active}
				onPointerDown={inkHandler(onPointerDown)}
				className={cn("si-iconbtn si-ink-host", active && "is-active", className)}
				{...props}
			>
				{children}
			</button>
		</Tooltip>
	);
}

/** Copies `value`; the icon turns into a check and the tooltip says 已复制. */
export type CopyButtonProps = Omit<React.ComponentPropsWithRef<"button">, "value" | "children"> & { value: string; label?: string; copiedLabel?: string };

export function CopyButton({ value, label: labelIn, copiedLabel: copiedIn, className, onClick, onPointerDown, ...props }: CopyButtonProps) {
	const label = labelIn ?? "复制";
	const copiedLabel = copiedIn ?? "已复制";
	const [done, setDone] = useState(false);
	useEffect(() => {
		if (!done) return;
		const timer = setTimeout(() => setDone(false), 1500);
		return () => clearTimeout(timer);
	}, [done]);

	return (
		<Tooltip content={done ? copiedLabel : label} open={done || undefined}>
			<button
				type="button"
				aria-label={done ? copiedLabel : label}
				disabled={!value}
				{...props}
				onPointerDown={inkHandler(onPointerDown)}
				onClick={async (e) => {
					onClick?.(e);
					try {
						await navigator.clipboard.writeText(value);
						setDone(true);
					} catch {
						// clipboard blocked: nothing to confirm
					}
				}}
				className={cn("si-iconbtn si-ink-host", done && "is-done", className)}
			>
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						key={done ? "done" : "copy"}
						className="si-swap"
						initial={{ scale: 0.4, rotate: done ? 30 : -30, opacity: 0 }}
						animate={{ scale: 1, rotate: 0, opacity: 1 }}
						exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
						transition={spring.bouncy}
					>
						{done ? <Check /> : <Copy />}
					</motion.span>
				</AnimatePresence>
			</button>
		</Tooltip>
	);
}
