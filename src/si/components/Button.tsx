import { Check, Copy } from "../internal/icons";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn, inkHandler, spring } from "../core";
import { PressableElement, type AsButton, type AsLink } from "../internal/pressable";
import { useMessages } from "../messages";
import { InkDrop } from "./Feedback";
import { Tooltip } from "./Tooltip";

/** The pigments: 石绿 jade (primary), 石青 azure, 泥金 gold, 朱砂 danger. */
export type Tone = "jade" | "azure" | "gold" | "danger";

type ButtonOwn = {
	/** solid: the one main action of an area. flat / bordered / light: secondary. ghost: quiet. shadow: solid that floats. */
	variant?: "solid" | "shadow" | "flat" | "bordered" | "light" | "ghost";
	tone?: Tone;
	size?: "sm" | "md" | "lg";
	icon?: React.ReactNode;
	/** Square button with only `icon`; give it `aria-label`. */
	iconOnly?: boolean;
	pill?: boolean;
	/** Swaps the label for an ink-drop loader (keeps the width) and ignores presses. */
	loading?: boolean;
	disabled?: boolean;
};

/** Props of a Button that is a <button> — the type to extend or Omit<> in a wrapper. */
export type ButtonProps = AsButton<ButtonOwn>;
/** Props of a Button with `href`: a link that looks the same (`as` renders a router link). */
export type ButtonLinkProps = AsLink<ButtonOwn>;

export function Button(allProps: ButtonProps | ButtonLinkProps) {
	const { variant = "solid", tone = "jade", size = "md", icon, iconOnly, pill, loading, className, children, onPointerDown, onClick, ...props } = allProps;
	const handleClick = onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
	const handleDown = onPointerDown as React.PointerEventHandler<HTMLElement> | undefined;
	return (
		<PressableElement
			{...props}
			aria-busy={loading || undefined}
			// While loading it keeps focus but ignores presses (no double submit).
			aria-disabled={loading || props.disabled || undefined}
			onPointerDown={loading ? handleDown : inkHandler(handleDown)}
			onClick={(e: React.MouseEvent<HTMLElement>) => {
				if (loading) return e.preventDefault();
				handleClick?.(e);
			}}
			className={cn("si-btn si-ink-host", `v-${variant}`, tone !== "jade" && `t-${tone}`, size !== "md" && `s-${size}`, iconOnly && "is-icon", pill && "is-pill", loading && "is-loading", className)}
		>
			<span className="si-btn-label">
				{icon}
				{!iconOnly && children}
			</span>
			<span className="si-btn-spin" aria-hidden={!loading}>
				<InkDrop />
			</span>
		</PressableElement>
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
		<Tooltip content={label} describe={false}>
			<button type="button" aria-label={label} aria-pressed={active} onPointerDown={inkHandler(onPointerDown)} className={cn("si-iconbtn si-ink-host", active && "is-active", className)} {...props}>
				{children}
			</button>
		</Tooltip>
	);
}

/** Copies `value`; the icon turns into a check and the tooltip says 已复制. */
export type CopyButtonProps = Omit<React.ComponentPropsWithRef<"button">, "value" | "children"> & { value: string; label?: string; copiedLabel?: string };

export function CopyButton({ value, label: labelIn, copiedLabel: copiedIn, className, onClick, onPointerDown, ...props }: CopyButtonProps) {
	const t = useMessages();
	const label = labelIn ?? t.copy;
	const copiedLabel = copiedIn ?? t.copied;
	const [done, setDone] = useState(false);
	useEffect(() => {
		if (!done) return;
		const timer = setTimeout(() => setDone(false), 1500);
		return () => clearTimeout(timer);
	}, [done]);

	return (
		<Tooltip content={done ? copiedLabel : label} open={done || undefined} describe={false}>
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
