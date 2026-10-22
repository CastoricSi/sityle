import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn, inkHandler, spring } from "../core";
import type { Color } from "./Button";

/** A sheet of paper laid on the page. */
export function Card({ title, note, className, style, children }: { title?: React.ReactNode; note?: React.ReactNode; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
	return (
		<div className={cn("si-card", className)} style={style}>
			{title && <h3 className="si-card-title">{title}</h3>}
			{note && <p className="si-card-note">{note}</p>}
			{children}
		</div>
	);
}

/** Filter chip; a check slides in when selected. */
export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
	return (
		<button type="button" className="si-chip si-ink-host" aria-pressed={selected} onClick={onClick} onPointerDown={inkHandler()}>
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

/** Small status label. */
export function Tag({ color = "jade", icon, children }: { color?: Color; icon?: React.ReactNode; children: React.ReactNode }) {
	return (
		<span className={cn("si-tag", `c-${color}`)}>
			{icon}
			{children}
		</span>
	);
}

/** First character on a pigment tile ("招" for 招商银行). */
export function Avatar({ name, color = "jade", size = 40 }: { name: string; color?: Color; size?: number }) {
	const first = [...name.trim()][0]?.toLocaleUpperCase() ?? "·";
	return (
		<span className={cn("si-avatar", `c-${color}`)} style={{ width: size, height: size, fontSize: size * 0.43 }} aria-hidden="true">
			{first}
		</span>
	);
}

export function AvatarStack({ children }: { children: React.ReactNode }) {
	return <span className="si-avatar-stack">{children}</span>;
}

/** 朱印: one brush character in a cinnabar square. */
export function Seal({ children, size = 30, outline, className, style }: { children: React.ReactNode; size?: number; outline?: boolean; className?: string; style?: React.CSSProperties }) {
	return (
		<span className={cn("si-seal", outline && "is-outline", className)} style={{ width: size, height: size, fontSize: size * 0.66, ...style }} aria-hidden="true">
			{children}
		</span>
	);
}

/** Row in a list: avatar, title, subtitle; an arrow appears on hover / when current. */
export function ListItem({ title, subtitle, leading, current, onClick }: { title: React.ReactNode; subtitle?: React.ReactNode; leading?: React.ReactNode; current?: boolean; onClick?: () => void }) {
	return (
		<button type="button" className="si-listitem si-ink-host" aria-current={current || undefined} onClick={onClick} onPointerDown={inkHandler()}>
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
