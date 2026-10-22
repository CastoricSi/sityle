import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn, inkHandler, spring } from "../core";
import type { Color } from "./Button";

export type CardProps = Omit<React.ComponentPropsWithRef<"div">, "title"> & { title?: React.ReactNode; note?: React.ReactNode };

/** A sheet of paper laid on the page. */
export function Card({ title, note, className, children, ...props }: CardProps) {
	return (
		<div className={cn("si-card", className)} {...props}>
			{title && <h3 className="si-card-title">{title}</h3>}
			{note && <p className="si-card-note">{note}</p>}
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

export type TagProps = Omit<React.ComponentPropsWithRef<"span">, "color"> & { color?: Color; icon?: React.ReactNode };

/** Small status label. */
export function Tag({ color = "jade", icon, children, className, ...props }: TagProps) {
	return (
		<span className={cn("si-tag", `c-${color}`, className)} {...props}>
			{icon}
			{children}
		</span>
	);
}

export type AvatarProps = Omit<React.ComponentPropsWithRef<"span">, "color" | "children"> & { name: string; color?: Color; size?: number };

/** First character on a pigment tile ("招" for 招商银行). */
export function Avatar({ name, color = "jade", size = 40, className, style, ...props }: AvatarProps) {
	const first = [...name.trim()][0]?.toLocaleUpperCase() ?? "·";
	return (
		<span className={cn("si-avatar", `c-${color}`, className)} style={{ width: size, height: size, fontSize: size * 0.43, ...style }} aria-hidden="true" {...props}>
			{first}
		</span>
	);
}

export function AvatarStack({ className, ...props }: React.ComponentPropsWithRef<"span">) {
	return <span className={cn("si-avatar-stack", className)} {...props} />;
}

export type SealProps = React.ComponentPropsWithRef<"span"> & { size?: number; outline?: boolean };

/** 朱印: one brush character in a cinnabar square. */
export function Seal({ children, size = 30, outline, className, style, ...props }: SealProps) {
	return (
		<span className={cn("si-seal", outline && "is-outline", className)} style={{ width: size, height: size, fontSize: size * 0.66, ...style }} aria-hidden="true" {...props}>
			{children}
		</span>
	);
}

export type ListItemProps = Omit<React.ComponentPropsWithRef<"button">, "title"> & {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	leading?: React.ReactNode;
	current?: boolean;
};

/** Row in a list: avatar, title, subtitle; an arrow appears on hover / when current. */
export function ListItem({ title, subtitle, leading, current, className, onPointerDown, ...props }: ListItemProps) {
	return (
		<button type="button" className={cn("si-listitem si-ink-host", className)} aria-current={current || undefined} onPointerDown={inkHandler(onPointerDown)} {...props}>
			{leading}
			<span className="si-listitem-text">
				<b>{title}</b>
				{subtitle && <span>{subtitle}</span>}
			</span>
			<span className="si-listitem-go">
				<ChevronRight />
			</span>
		</button>
	);
}
