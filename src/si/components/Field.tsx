import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useId, useState } from "react";

import { cn, spring } from "../core";
import { CopyButton, IconButton } from "./Button";

type Common = {
	label: string;
	/** Shown under the box; replaced by `error` when there is one. */
	hint?: React.ReactNode;
	error?: React.ReactNode;
	/** Icon buttons at the right end of the box (copy, show, open…). */
	end?: React.ReactNode;
	className?: string;
};

export type TextFieldProps = Common &
	Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
		mono?: boolean;
	};

/**
 * Box with the label inside; the label floats up once there is focus or text.
 * Errors tint the box cinnabar and shake it once.
 */
export function TextField({ label, hint, error, end, mono, className, id, style, ...props }: TextFieldProps) {
	const autoId = useId();
	const fieldId = id ?? autoId;
	const endCount = Array.isArray(end) ? end.length : end ? 1 : 0;
	return (
		<FieldShell error={error} hint={hint} hintId={`${fieldId}-hint`} className={className}>
			<input
				id={fieldId}
				placeholder=" "
				aria-invalid={!!error || undefined}
				aria-describedby={hint || error ? `${fieldId}-hint` : undefined}
				className={cn(mono && "is-mono")}
				style={{ paddingRight: endCount ? 8 + endCount * 42 : undefined, ...style }}
				{...props}
			/>
			<label htmlFor={fieldId}>{label}</label>
			{end && <div className="si-field-end">{end}</div>}
		</FieldShell>
	);
}

export type TextAreaFieldProps = Common & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "placeholder">;

export function TextAreaField({ label, hint, error, end, className, id, ...props }: TextAreaFieldProps) {
	const autoId = useId();
	const fieldId = id ?? autoId;
	return (
		<FieldShell error={error} hint={hint} hintId={`${fieldId}-hint`} className={className}>
			<textarea id={fieldId} placeholder=" " aria-invalid={!!error || undefined} style={end ? { paddingRight: 52 } : undefined} {...props} />
			<label htmlFor={fieldId}>{label}</label>
			{end && <div className="si-field-end">{end}</div>}
		</FieldShell>
	);
}

function FieldShell({ error, hint, hintId, className, children }: { error?: React.ReactNode; hint?: React.ReactNode; hintId: string; className?: string; children: React.ReactNode }) {
	const [box, animate] = useAnimate<HTMLDivElement>();
	const invalid = !!error;
	// One shake when it becomes invalid (not on every keystroke while invalid).
	useEffect(() => {
		if (invalid) void animate(box.current, { x: [0, -6, 5, -3, 2, 0] }, { duration: 0.4 });
	}, [invalid, animate, box]);
	return (
		<div className={cn("si-field", invalid && "is-invalid", className)}>
			<div ref={box} className="si-field-box">
				{children}
			</div>
			<AnimatePresence initial={false} mode="wait">
				{(error || hint) && (
					<motion.p
						key={error ? "e" : "h"}
						id={hintId}
						className="si-field-hint"
						role={error ? "alert" : undefined}
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
						transition={spring.snappy}
					>
						{error || hint}
					</motion.p>
				)}
			</AnimatePresence>
		</div>
	);
}

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "end" | "mono"> & {
	value: string;
	/** Show the strength bar under the box. */
	strength?: boolean;
	copy?: boolean;
	/** Extra buttons after show / copy (e.g. generate). */
	extra?: React.ReactNode;
};

/** Password box: show / hide, copy, optional strength bar. */
export function PasswordField({ value, strength, copy = true, extra, ...props }: PasswordFieldProps) {
	const [visible, setVisible] = useState(false);
	const end = [
		<IconButton key="eye" label={visible ? "隐藏" : "显示"} onClick={() => setVisible((v) => !v)} active={visible}>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span key={visible ? "off" : "on"} className="si-swap" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={spring.bouncy}>
					{visible ? <EyeOff /> : <Eye />}
				</motion.span>
			</AnimatePresence>
		</IconButton>,
		copy && <CopyButton key="copy" value={value} />,
		extra,
	].filter(Boolean);
	return (
		<div>
			<TextField {...props} value={value} type={visible ? "text" : "password"} mono autoComplete="off" spellCheck={false} end={end} />
			{strength && <StrengthMeter value={value} />}
		</div>
	);
}

/** 0 (too short) … 4 (very strong). A rough guide, not a guarantee. */
export function passwordStrength(v: string): 0 | 1 | 2 | 3 | 4 {
	let s = 0;
	if (v.length >= 8) s++;
	if (v.length >= 12) s++;
	if (/[^A-Za-z0-9]/.test(v) && /\d/.test(v)) s++;
	if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
	return s as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_LABELS = ["太短", "弱", "一般", "较强", "很强"];
const STRENGTH_COLORS = ["var(--si-cinnabar)", "var(--si-cinnabar)", "var(--si-gold)", "var(--si-jade)", "var(--si-jade)"];

export function StrengthMeter({ value, labels = STRENGTH_LABELS }: { value: string; labels?: string[] }) {
	const s = passwordStrength(value);
	return (
		<>
			<div className="si-strength" aria-hidden="true">
				{[0, 1, 2, 3].map((n) => (
					<i key={n} className={cn(n < s && "is-on")} style={{ "--sc": STRENGTH_COLORS[s] } as React.CSSProperties} />
				))}
			</div>
			<div className="si-strength-label">{labels[s]}</div>
		</>
	);
}
