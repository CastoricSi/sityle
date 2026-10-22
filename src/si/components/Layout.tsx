import { Search, X } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { cn, inkHandler, spring } from "../core";
import { useControllable } from "../internal/controllable";
import { PressableElement, type Pressable } from "../internal/pressable";
import { Button, IconButton } from "./Button";
import { Card } from "./Display";
import { Dialog } from "./Dialog";

/** A row in a side navigation: icon, label, optional count; `current` marks the open one. */
export type NavItemProps = Pressable<{
	icon?: React.ReactNode;
	label: React.ReactNode;
	count?: number;
	/** The open one (aria-current="page" for links). */
	current?: boolean;
	/** Colour the row (e.g. a sync status). */
	tone?: "jade" | "gold" | "danger";
}>;

/** A <button>, or a real link with `href` (middle-click, copy link; `as` renders a router link). */
export function NavItem(allProps: NavItemProps) {
	const { icon, label, count, current, tone, className, ...props } = allProps;
	const currentValue = props.href !== undefined ? "page" : "true";
	return (
		<PressableElement {...props} className={cn("si-nav", tone && `t-${tone}`, className)} aria-current={current ? currentValue : undefined}>
			{icon}
			<span className="si-nav-label">{label}</span>
			{count !== undefined && <span className="si-nav-count">{count}</span>}
		</PressableElement>
	);
}

/**
 * A titled group of settings whose rows are divided by a line. Children:
 * GroupRow (or anything). In a card by default; `plain` drops the card (a
 * section title and rows, groups separated by a line), e.g. inside a dialog.
 */
export type GroupProps = Omit<React.ComponentPropsWithRef<"section">, "title"> & { title?: React.ReactNode; plain?: boolean };

export function Group({ title, plain, children, className, ...props }: GroupProps) {
	if (plain)
		return (
			<section className={cn("si-group-plain", className)} {...props}>
				{title && <h3 className="si-card-title">{title}</h3>}
				<div className="si-group">{children}</div>
			</section>
		);
	return (
		<Card title={title} className={className} {...(props as React.ComponentPropsWithRef<"div">)}>
			<div className="si-group">{children}</div>
		</Card>
	);
}

/** Title + explanation on the left, the control on the right (wraps when narrow). */
export type GroupRowProps = Omit<React.ComponentPropsWithRef<"div">, "title"> & { title?: React.ReactNode; hint?: React.ReactNode };

export function GroupRow({ title, hint, children, className, ...props }: GroupRowProps) {
	return (
		<div className={cn("si-group-row", className)} {...props}>
			{(title || hint) && (
				<div className="si-group-text">
					{title && <div>{title}</div>}
					{hint && <div className="si-group-hint">{hint}</div>}
				</div>
			)}
			{children}
		</div>
	);
}

/** "Step 2 of 3" with a bar per step. */
export type StepsProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & { current: number; total: number; label: string };

export function Steps({ current, total, label, className, ...props }: StepsProps) {
	return (
		<div className={cn("si-steps", className)} aria-label={label} {...props}>
			<div className="si-steps-bar" aria-hidden="true">
				{Array.from({ length: total }, (_, i) => (
					<i key={i} className={cn(i < current && "is-done")} />
				))}
			</div>
			<p>{label}</p>
		</div>
	);
}

/** A radio as a card: icon, title, explanation; the chosen one is framed in 石绿. */
export type RadioCardProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "onChange" | "title"> & {
	name: string;
	checked: boolean;
	onChange: () => void;
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
};

/** Native props go to the radio <input>; `className` / `style` to the card. */
export function RadioCard({ name, checked, onChange, icon, title, description, className, style, disabled, ...props }: RadioCardProps) {
	return (
		<label className={cn("si-radiocard", disabled && "is-disabled", className)} style={style}>
			<input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} {...props} />
			{icon}
			<span>
				<b>{title}</b>
				{description && <span className="si-radiocard-text">{description}</span>}
			</span>
		</label>
	);
}

/** A short note on a tinted ground: neutral, warn (泥金), accent (石绿) or danger (朱砂). */
export type NoteProps = React.ComponentPropsWithRef<"div"> & { tone?: "neutral" | "warn" | "accent" | "danger"; icon?: React.ReactNode };

export function Note({ tone = "neutral", icon, children, className, ...props }: NoteProps) {
	return (
		<div className={cn("si-note", `t-${tone}`, className)} {...props}>
			{icon}
			<div>{children}</div>
		</div>
	);
}

/** Round 石绿 badge around one icon (a lock, a cloud…). */
export function IconBadge({ children, size = 40, className, style, ...props }: React.ComponentPropsWithRef<"span"> & { size?: number }) {
	return (
		<span className={cn("si-badge", className)} style={{ width: size, height: size, ...style }} aria-hidden="true" {...props}>
			{children}
		</span>
	);
}

/** Search box with a magnifier; Escape or the × clears it. */
export type SearchFieldProps = Omit<React.ComponentPropsWithRef<"input">, "value" | "defaultValue" | "onChange" | "type"> & {
	/** Controlled query; or leave it out and give `defaultValue`. */
	value?: string;
	defaultValue?: string;
	onChange?: (q: string) => void;
	label: string;
	clearLabel?: string;
};

/** Native props go to the <input>; `className` / `style` to the wrapper. */
export function SearchField({ value: valueIn, defaultValue = "", onChange: onChangeIn, label, clearLabel = "清除", className, style, id, onKeyDown, ...props }: SearchFieldProps) {
	const [value, onChange] = useControllable(valueIn, defaultValue, onChangeIn);
	const box = useRef<HTMLDivElement>(null);
	const autoId = useId();
	return (
		<div className={cn("si-search", className)} style={style} ref={box}>
			<Search aria-hidden="true" />
			<input
				id={id ?? autoId}
				className="si-input"
				type="search"
				value={value}
				placeholder={label}
				aria-label={label}
				onChange={(e) => onChange(e.target.value)}
				{...props}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					// clear (and stay in a dialog) only when there is something to clear
					if (e.key === "Escape" && value) {
						e.stopPropagation();
						onChange("");
					}
				}}
			/>
			{value && (
				<IconButton
					label={clearLabel}
					onClick={() => {
						onChange("");
						box.current?.querySelector("input")?.focus();
					}}
				>
					<X />
				</IconButton>
			)}
		</div>
	);
}

/** "Are you sure?": the safe choice first, a 朱砂 confirm; `seal` stamps one character (删 for deletes). */
export function ConfirmDialog({
	open = true,
	title,
	body,
	confirmLabel,
	cancelLabel = "取消",
	onConfirm,
	onCancel,
	seal,
}: {
	open?: boolean;
	title: React.ReactNode;
	body?: React.ReactNode;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	seal?: string;
}) {
	return (
		<Dialog
			open={open}
			onClose={onCancel}
			title={title}
			seal={seal}
			actions={
				<>
					<Button variant="ghost" onClick={onCancel}>
						{cancelLabel}
					</Button>
					<Button color="danger" onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</>
			}
		>
			{body}
		</Dialog>
	);
}

/**
 * Floating action button: the one main action of a screen, large, fixed to the
 * bottom-right. With a label it is a pill ("＋ 新建"); `round` keeps the icon only.
 * Move it with `style` (e.g. above a bottom bar).
 */
export type FabProps = Pick<React.ComponentPropsWithRef<"button">, "ref" | "id" | "className" | "style" | "disabled" | "onClick" | "aria-controls" | "aria-expanded"> & {
	icon: React.ReactNode;
	label: string;
	round?: boolean;
};

export function Fab({ icon, label, round, className, ...props }: FabProps) {
	return (
		<motion.button
			type="button"
			className={cn("si-fab si-ink-host", round && "is-round", className)}
			aria-label={label}
			title={round ? label : undefined}
			onPointerDown={inkHandler()}
			{...props}
			initial={{ scale: 0.6, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			whileHover={{ y: -2 }}
			whileTap={{ scale: 0.94 }}
			transition={spring.bouncy}
			layout="position"
		>
			{icon}
			{!round && <span>{label}</span>}
		</motion.button>
	);
}

/**
 * Grows and shrinks with its content on a spring instead of jumping (e.g. one
 * card whose steps change). Clips only while it moves, so focus rings and
 * dropdowns inside are not cut off at rest.
 */
export function AutoHeight({ children, className, style, id }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; id?: string }) {
	const inner = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | "auto">("auto");
	const [moving, setMoving] = useState(false);
	useLayoutEffect(() => {
		const el = inner.current!;
		const measure = () => setHeight(el.offsetHeight);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	return (
		<motion.div
			id={id}
			className={className}
			style={{ ...style, overflow: moving ? "hidden" : "visible" }}
			initial={false}
			animate={{ height }}
			transition={spring.gentle}
			onAnimationStart={() => setMoving(true)}
			onAnimationComplete={() => setMoving(false)}
		>
			<div ref={inner}>{children}</div>
		</motion.div>
	);
}
