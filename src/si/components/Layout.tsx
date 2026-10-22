import { Search, X } from "lucide-react";
import { useId, useRef } from "react";

import { cn } from "../core";
import { Button, IconButton } from "./Button";
import { Card } from "./Display";
import { Dialog } from "./Dialog";

/** A row in a side navigation: icon, label, optional count; `current` marks the open one. */
export function NavItem({
	icon,
	label,
	count,
	current,
	onClick,
	tone,
}: {
	icon?: React.ReactNode;
	label: React.ReactNode;
	count?: number;
	current?: boolean;
	onClick?: () => void;
	/** Colour the row (e.g. a sync status). */
	tone?: "jade" | "gold" | "danger";
}) {
	return (
		<button type="button" className={cn("si-nav", tone && `t-${tone}`)} aria-current={current || undefined} onClick={onClick}>
			{icon}
			<span className="si-nav-label">{label}</span>
			{count !== undefined && <span className="si-nav-count">{count}</span>}
		</button>
	);
}

/** A titled card of settings whose rows are divided by a line. Children: GroupRow (or anything). */
export function Group({ title, children }: { title?: React.ReactNode; children: React.ReactNode }) {
	return (
		<Card title={title}>
			<div className="si-group">{children}</div>
		</Card>
	);
}

/** Title + explanation on the left, the control on the right (wraps when narrow). */
export function GroupRow({ title, hint, children }: { title?: React.ReactNode; hint?: React.ReactNode; children?: React.ReactNode }) {
	return (
		<div className="si-group-row">
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
export function Steps({ current, total, label }: { current: number; total: number; label: string }) {
	return (
		<div className="si-steps" aria-label={label}>
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
export function RadioCard({
	name,
	checked,
	onChange,
	icon,
	title,
	description,
}: {
	name: string;
	checked: boolean;
	onChange: () => void;
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		<label className="si-radiocard">
			<input type="radio" name={name} checked={checked} onChange={onChange} />
			{icon}
			<span>
				<b>{title}</b>
				{description && <span className="si-radiocard-text">{description}</span>}
			</span>
		</label>
	);
}

/** A short note on a tinted ground: neutral, warn (泥金), accent (石绿) or danger (朱砂). */
export function Note({ tone = "neutral", icon, children }: { tone?: "neutral" | "warn" | "accent" | "danger"; icon?: React.ReactNode; children: React.ReactNode }) {
	return (
		<div className={cn("si-note", `t-${tone}`)}>
			{icon}
			<div>{children}</div>
		</div>
	);
}

/** Round 石绿 badge around one icon (a lock, a cloud…). */
export function IconBadge({ children, size = 40 }: { children: React.ReactNode; size?: number }) {
	return (
		<span className="si-badge" style={{ width: size, height: size }} aria-hidden="true">
			{children}
		</span>
	);
}

/** Search box with a magnifier; Escape or the × clears it. */
export function SearchField({ value, onChange, label, clearLabel = "清除" }: { value: string; onChange: (q: string) => void; label: string; clearLabel?: string }) {
	const box = useRef<HTMLDivElement>(null);
	const id = useId();
	return (
		<div className="si-search" ref={box}>
			<Search aria-hidden="true" />
			<input
				id={id}
				className="si-input"
				type="search"
				value={value}
				placeholder={label}
				aria-label={label}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => e.key === "Escape" && onChange("")}
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
