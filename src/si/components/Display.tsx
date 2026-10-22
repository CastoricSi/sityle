import { Check, ChevronRight } from "../internal/icons";
import { AnimatePresence, motion } from "motion/react";

import { cn, inkHandler, spring } from "../core";
import { PressableElement, type Pressable } from "../internal/pressable";
import type { Tone } from "./Button";

export type CardProps = Omit<React.ComponentPropsWithRef<"div">, "title"> & { title?: React.ReactNode; description?: React.ReactNode };

/** A sheet of paper laid on the page. */
export function Card({ title, description, className, children, ...props }: CardProps) {
	return (
		<div className={cn("si-card", className)} {...props}>
			{title && <h3 className="si-card-title">{title}</h3>}
			{description && <p className="si-card-note">{description}</p>}
			{children}
		</div>
	);
}

export type ChipProps = Omit<React.ComponentPropsWithRef<"button">, "onClick"> & { selected: boolean; onClick: () => void };

/** Filter chip; a check slides in when selected. */
export function Chip({ selected, onClick, children, className, onPointerDown, ...props }: ChipProps) {
	return (
		<button type="button" className={cn("si-chip si-ink-host", className)} aria-pressed={selected} onClick={onClick} onPointerDown={inkHandler(onPointerDown)} {...props}>
			<AnimatePresence initial={false}>
				{selected && (
					<motion.span className="si-chip-tick" initial={{ width: 0, opacity: 0 }} animate={{ width: 20, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={spring.bouncy}>
						<Check />
					</motion.span>
				)}
			</AnimatePresence>
			{children}
		</button>
	);
}

export type TagProps = Omit<React.ComponentPropsWithRef<"span">, "color"> & { tone?: Tone; icon?: React.ReactNode };

/** Small status label. */
export function Tag({ tone = "jade", icon, children, className, ...props }: TagProps) {
	return (
		<span className={cn("si-tag", `t-${tone}`, className)} {...props}>
			{icon}
			{children}
		</span>
	);
}

export type AvatarProps = Omit<React.ComponentPropsWithRef<"span">, "color" | "children"> & {
	name: string;
	tone?: Tone;
	size?: number;
	/** Hide it from screen readers when the name is written right next to it. */
	decorative?: boolean;
};

/** First character on a pigment tile ("招" for 招商银行). Read out as the full name. */
export function Avatar({ name, tone = "jade", size = 40, decorative, className, style, ...props }: AvatarProps) {
	const first = [...name.trim()][0]?.toLocaleUpperCase() ?? "·";
	const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name };
	return (
		<span className={cn("si-avatar", `t-${tone}`, className)} style={{ width: size, height: size, fontSize: size * 0.43, ...style }} {...a11y} {...props}>
			{first}
		</span>
	);
}

export function AvatarStack({ className, ...props }: React.ComponentPropsWithRef<"span">) {
	return <span className={cn("si-avatar-stack", className)} {...props} />;
}

export type SealProps = React.ComponentPropsWithRef<"span"> & {
	size?: number;
	outline?: boolean;
	/** What the seal means, for screen readers; without it the seal is decoration. */
	label?: string;
};

/** 朱印: one brush character in a cinnabar square. */
export function Seal({ children, size = 30, outline, label, className, style, ...props }: SealProps) {
	const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
	return (
		<span className={cn("si-seal", outline && "is-outline", className)} style={{ width: size, height: size, fontSize: size * 0.66, ...style }} {...a11y} {...props}>
			{children}
		</span>
	);
}

type ListItemOwn = {
	title: React.ReactNode;
	description?: React.ReactNode;
	leading?: React.ReactNode;
	current?: boolean;
};

/** With `onClick` a <button>, with `href` a link (`as` for a router link), with neither a plain row. */
export type ListItemProps = Pressable<ListItemOwn>;

/** Row in a list: avatar, title, description; an arrow appears on hover / when current. */
export function ListItem(allProps: ListItemProps) {
	const { title, description, leading, current, className, ...rest } = allProps;
	const inner = (
		<>
			{leading}
			<span className="si-listitem-text">
				<b>{title}</b>
				{description && <span>{description}</span>}
			</span>
		</>
	);
	if (rest.href === undefined && !rest.onClick) {
		const { type: _type, disabled: _disabled, ...props } = rest;
		return (
			<div className={cn("si-listitem is-static", className)} aria-current={current || undefined} {...(props as React.ComponentPropsWithRef<"div">)}>
				{inner}
			</div>
		);
	}
	const { onPointerDown, ...props } = rest;
	return (
		<PressableElement
			{...props}
			className={cn("si-listitem si-ink-host", className)}
			aria-current={current ? (props.href !== undefined ? "page" : "true") : undefined}
			onPointerDown={inkHandler(onPointerDown as React.PointerEventHandler<HTMLElement> | undefined)}
		>
			{inner}
			<span className="si-listitem-go">
				<ChevronRight />
			</span>
		</PressableElement>
	);
}
