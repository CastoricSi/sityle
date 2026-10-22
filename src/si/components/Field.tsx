import { Check, ChevronDown, Eye, EyeOff } from "../internal/icons";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn, spring } from "../core";
import { useIsClient } from "../internal/client";
import { useControllable } from "../internal/controllable";
import { useMessages } from "../messages";
import { LAYER_ATTR } from "../internal/modal";
import { useAnchoredPosition, useDismiss } from "../internal/popover";
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
	Omit<React.ComponentPropsWithRef<"input">, "placeholder"> & {
		mono?: boolean;
	};

/**
 * Box with the label inside; the label floats up once there is focus or text.
 * Errors tint the box cinnabar and shake it once.
 */
export function TextField({ label, hint, error, end, mono, className, id, style, ...props }: TextFieldProps) {
	const autoId = useId();
	const fieldId = id ?? autoId;
	return (
		<FieldShell error={error} hint={hint} hintId={`${fieldId}-hint`} className={className}>
			<input
				id={fieldId}
				placeholder=" "
				aria-invalid={!!error || undefined}
				aria-describedby={hint || error ? `${fieldId}-hint` : undefined}
				className={cn(mono && "is-mono")}
				style={style}
				{...props}
			/>
			<label htmlFor={fieldId}>{label}</label>
			{end && <FieldEnd>{end}</FieldEnd>}
		</FieldShell>
	);
}

/** The buttons at the right end; the box keeps its text clear of them, however many there are. */
function FieldEnd({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		const el = ref.current!;
		const box = el.parentElement!;
		const set = () => box.style.setProperty("--si-end", `${el.offsetWidth}px`);
		set();
		const ro = new ResizeObserver(set);
		ro.observe(el);
		return () => {
			ro.disconnect();
			box.style.removeProperty("--si-end");
		};
	}, []);
	return (
		<div ref={ref} className="si-field-end">
			{children}
		</div>
	);
}

export type TextAreaFieldProps = Common & Omit<React.ComponentPropsWithRef<"textarea">, "placeholder">;

export function TextAreaField({ label, hint, error, end, className, id, ...props }: TextAreaFieldProps) {
	const autoId = useId();
	const fieldId = id ?? autoId;
	return (
		<FieldShell error={error} hint={hint} hintId={`${fieldId}-hint`} className={className}>
			<textarea id={fieldId} placeholder=" " aria-invalid={!!error || undefined} aria-describedby={hint || error ? `${fieldId}-hint` : undefined} {...props} />
			<label htmlFor={fieldId}>{label}</label>
			{end && <FieldEnd>{end}</FieldEnd>}
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

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "end" | "mono" | "value" | "defaultValue"> & {
	/** Controlled value; or leave it out and give `defaultValue`. */
	value?: string;
	defaultValue?: string;
	/** Show the strength bar under the box. */
	strength?: boolean;
	/** Strength bar labels, weakest first (5). */
	strengthLabels?: string[];
	copy?: boolean;
	/** Start with the password shown (e.g. a freshly generated one). */
	defaultVisible?: boolean;
	/** Extra buttons after show / copy (e.g. generate). */
	extra?: React.ReactNode;
	/** Default "current-password" so password managers fill it; "new-password" for sign-up / generated ones. */
	autoComplete?: string;
	/** Button texts for this field (app-wide: <SiProvider messages>). */
	labels?: { show?: string; hide?: string; copy?: string; copied?: string };
};

/** Password box: show / hide, copy, optional strength bar. */
export function PasswordField({
	value: valueIn,
	defaultValue = "",
	onChange,
	strength,
	strengthLabels,
	copy = true,
	defaultVisible = false,
	extra,
	labels,
	className,
	autoComplete = "current-password",
	...props
}: PasswordFieldProps) {
	const t = useMessages();
	const [visible, setVisible] = useState(defaultVisible);
	// Track the text even when uncontrolled: the copy button and strength bar need it.
	const [value, setValue] = useControllable(valueIn, defaultValue, undefined);
	const end = [
		<IconButton key="eye" label={visible ? (labels?.hide ?? t.hide) : (labels?.show ?? t.show)} onClick={() => setVisible((v) => !v)} active={visible}>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={visible ? "off" : "on"}
					className="si-swap"
					initial={{ scale: 0.6, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.6, opacity: 0 }}
					transition={spring.bouncy}
				>
					{visible ? <EyeOff /> : <Eye />}
				</motion.span>
			</AnimatePresence>
		</IconButton>,
		copy && <CopyButton key="copy" value={value} label={labels?.copy} copiedLabel={labels?.copied} />,
		extra,
	].filter(Boolean);
	return (
		<div className={className}>
			<TextField
				spellCheck={false}
				{...props}
				autoComplete={autoComplete}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					onChange?.(e);
				}}
				type={visible ? "text" : "password"}
				mono
				end={end}
			/>
			{strength && <StrengthMeter value={value} labels={strengthLabels} />}
		</div>
	);
}

export type SelectOption<T extends string = string> = { value: T; label: React.ReactNode; icon?: React.ReactNode };

export type SelectFieldProps<T extends string = string> = Omit<Common, "end"> &
	Omit<React.ComponentPropsWithRef<"button">, "value" | "defaultValue" | "onChange" | "children" | "type" | "name" | "className"> & {
		/** Controlled value; or leave it out and give `defaultValue`. */
		value?: T;
		defaultValue?: T;
		onChange?: (value: T) => void;
		options: SelectOption<T>[];
		/** Submitted with the form (a hidden input carries the value). */
		name?: string;
	};

/**
 * A dropdown in the TextField box; the label sits up top. Opens sityle's own
 * list (not the browser's): arrows / Home / End move, Enter or Space picks,
 * Escape closes, typing a letter jumps to the next option starting with it.
 * The list floats above the page, so a dialog or card never clips it.
 */
/** Other button props (onBlur, aria-*, ref…) go to the trigger; `style` to the box. */
export function SelectField<T extends string = string>({
	label,
	hint,
	error,
	className,
	id,
	value: valueIn,
	defaultValue,
	onChange: onChangeIn,
	options,
	name,
	disabled,
	style,
	ref,
	onKeyDown,
	onClick,
	...props
}: SelectFieldProps<T>) {
	const [value, onChange] = useControllable(valueIn, defaultValue ?? options[0]?.value, onChangeIn);
	const autoId = useId();
	const fieldId = id ?? autoId;
	const listId = `${fieldId}-list`;
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const wrap = useRef<HTMLDivElement>(null);
	const trigger = useRef<HTMLButtonElement | null>(null);
	const setTrigger = (el: HTMLButtonElement | null) => {
		trigger.current = el;
		if (typeof ref === "function") ref(el);
		else if (ref) ref.current = el;
	};
	const list = useRef<HTMLUListElement>(null);
	const current = options.find((o) => o.value === value);
	const placement = useAnchoredPosition(wrap, open, { matchWidth: true });
	const client = useIsClient();
	const up = placement?.up ?? false;

	const show = () => {
		setActive(
			Math.max(
				0,
				options.findIndex((o) => o.value === value),
			),
		);
		setOpen(true);
	};
	const pick = (i: number) => {
		const o = options[i];
		if (o) onChange(o.value);
		setOpen(false);
		trigger.current?.focus();
	};

	useDismiss(open, [wrap, list], () => setOpen(false));
	useEffect(() => {
		if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
	}, [open, active]);

	const onKey = (e: React.KeyboardEvent) => {
		if (!open) {
			if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
				e.preventDefault();
				show();
			}
			return;
		}
		const last = options.length - 1;
		if (e.key === "ArrowDown") setActive((i) => Math.min(last, i + 1));
		else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
		else if (e.key === "Home") setActive(0);
		else if (e.key === "End") setActive(last);
		else if (e.key === "Enter" || e.key === " ") pick(active);
		else if (e.key === "Escape") {
			// close the list, not the dialog around it
			e.stopPropagation();
			setOpen(false);
		} else if (e.key === "Tab") {
			setOpen(false);
			return;
		} else if (e.key.length === 1) {
			const k = e.key.toLowerCase();
			const text = (o: SelectOption<T>) => (typeof o.label === "string" ? o.label : String(o.value)).toLowerCase();
			const next = options.findIndex((o, i) => i > active && text(o).startsWith(k));
			const first = options.findIndex((o) => text(o).startsWith(k));
			if (next >= 0 || first >= 0) setActive(next >= 0 ? next : first);
			return;
		} else return;
		e.preventDefault();
	};

	return (
		<FieldShell error={error} hint={hint} hintId={`${fieldId}-hint`} className={cn("is-select", className)}>
			<div ref={wrap} style={style}>
				<button
					{...props}
					ref={setTrigger}
					id={fieldId}
					type="button"
					className="si-select-trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls={listId}
					aria-activedescendant={open ? `${listId}-${active}` : undefined}
					aria-invalid={!!error || undefined}
					aria-describedby={hint || error ? `${fieldId}-hint` : undefined}
					disabled={disabled}
					onClick={(e) => {
						onClick?.(e);
						if (e.defaultPrevented) return;
						if (open) setOpen(false);
						else show();
					}}
					onKeyDown={(e) => {
						onKeyDown?.(e);
						if (!e.defaultPrevented) onKey(e);
					}}
				>
					{current?.label ?? "\u00a0"}
				</button>
				<label htmlFor={fieldId}>{label}</label>
				<ChevronDown className="si-field-chevron" aria-hidden="true" />
				{name !== undefined && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
			</div>
			{client &&
				createPortal(
					<AnimatePresence>
						{open && placement && (
							<motion.ul
								ref={list}
								id={listId}
								role="listbox"
								aria-label={label}
								{...{ [LAYER_ATTR]: "" }}
								className={cn("si-listbox", up && "is-up")}
								style={placement.style}
								initial={{ opacity: 0, scale: 0.96, y: up ? 6 : -6 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
								transition={spring.bouncy}
							>
								{options.map((o, i) => (
									<li
										key={o.value}
										id={`${listId}-${i}`}
										data-index={i}
										role="option"
										aria-selected={o.value === value}
										data-active={i === active}
										className="si-option"
										onMouseEnter={() => setActive(i)}
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => pick(i)}
									>
										{o.icon}
										<span>{o.label}</span>
										{o.value === value && <Check className="si-option-check" />}
									</li>
								))}
							</motion.ul>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</FieldShell>
	);
}

const COMMON = /^(password|passw0rd|qwerty|qwertyuiop|asdfgh|letmein|welcome|admin|iloveyou|monkey|dragon|abc|123|1234|12345|123456|111111|000000|woaini|aini)+$/;

/**
 * 0 (too short) … 4 (very strong): roughly the bits of guessing it takes.
 * Repeats ("aaaa"), runs ("abcd", "4321") and well-known passwords count for
 * little. A guide for the meter, not a guarantee.
 */
export function passwordStrength(v: string): 0 | 1 | 2 | 3 | 4 {
	const chars = [...v];
	if (chars.length < 8) return 0;
	if (COMMON.test(v.toLowerCase().replace(/[\d!@#$%^&*._-]+$/, "")) || COMMON.test(v.toLowerCase())) return 1;
	let pool = 0;
	if (/[a-z]/.test(v)) pool += 26;
	if (/[A-Z]/.test(v)) pool += 26;
	if (/\d/.test(v)) pool += 10;
	if (/[^A-Za-z0-9]/.test(v)) pool += 33;
	// characters that add something: not a repeat or the next step of a run
	let effective = 0;
	for (let i = 0; i < chars.length; i++) {
		const c = chars[i]!.codePointAt(0)!;
		const p = i > 0 ? chars[i - 1]!.codePointAt(0)! : NaN;
		const pp = i > 1 ? chars[i - 2]!.codePointAt(0)! : NaN;
		const repeat = c === p;
		const run = Math.abs(c - p) === 1 && c - p === p - pp;
		if (!repeat && !run) effective++;
	}
	const bits = effective * Math.log2(pool);
	return bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
}

const STRENGTH_COLORS = ["var(--si-cinnabar)", "var(--si-cinnabar)", "var(--si-gold)", "var(--si-jade)", "var(--si-jade)"];

export function StrengthMeter({ value, labels: labelsIn }: { value: string; labels?: string[] }) {
	const t = useMessages();
	const labels = labelsIn ?? t.strength;
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
