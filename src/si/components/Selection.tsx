import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useId, useState } from "react";

import { cn, spring } from "../core";
import { useControllable } from "../internal/controllable";

/*
 * Toggles wrap a real <input>: the native props (name, value, required, onBlur,
 * aria-*, ref…) go to the input, `className` / `style` to the outer label.
 */
type InputProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "checked" | "defaultChecked" | "onChange" | "children">;

/** Controlled with `checked` + `onChange`, or uncontrolled with `defaultChecked`. */
type Toggle = { checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void };

export type SwitchProps = InputProps &
	Toggle & {
		label: React.ReactNode;
		description?: React.ReactNode;
	};

/** On / off. The knob stretches while pressed and springs into place. */
export function Switch({ checked: checkedIn, defaultChecked = false, onChange, label, description, disabled, className, style, ...props }: SwitchProps) {
	const [checked, setChecked] = useControllable(checkedIn, defaultChecked, onChange);
	const [pressed, setPressed] = useState(false);
	return (
		<label
			className={cn("si-switch", disabled && "is-disabled", className)}
			style={style}
			onPointerDown={() => setPressed(true)}
			onPointerUp={() => setPressed(false)}
			onPointerLeave={() => setPressed(false)}
		>
			<input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => setChecked(e.target.checked)} {...props} />
			<span className="si-switch-track">
				<motion.span className="si-switch-knob" layout transition={spring.bouncy} animate={{ width: pressed && !disabled ? 30 : 24 }}>
					<AnimatePresence initial={false}>
						{checked && (
							<motion.span
								style={{ display: "grid" }}
								initial={{ scale: 0.4, rotate: -40, opacity: 0 }}
								animate={{ scale: 1, rotate: 0, opacity: 1 }}
								exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.1 } }}
								transition={spring.bouncy}
							>
								<Check />
							</motion.span>
						)}
					</AnimatePresence>
				</motion.span>
			</span>
			<ToggleText label={label} description={description} strong />
		</label>
	);
}

export type CheckboxProps = InputProps & Toggle & { label: React.ReactNode; description?: React.ReactNode };

/** Checkbox whose tick is drawn like a brush stroke. */
export function Checkbox({ checked: checkedIn, defaultChecked = false, onChange, label, description, disabled, className, style, ...props }: CheckboxProps) {
	const [checked, setChecked] = useControllable(checkedIn, defaultChecked, onChange);
	return (
		<label className={cn("si-check", disabled && "is-disabled", className)} style={style}>
			<input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => setChecked(e.target.checked)} {...props} />
			<span className="si-check-box">
				<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<path d="M3.2 8.4 6.6 11.6 12.8 4.6" />
				</svg>
			</span>
			<ToggleText label={label} description={description} />
		</label>
	);
}

/** Label (+ optional explanation) beside a toggle. */
function ToggleText({ label, description, strong }: { label: React.ReactNode; description?: React.ReactNode; strong?: boolean }) {
	if (!description && !strong) return <span className="si-toggle-text">{label}</span>;
	return (
		<span className="si-toggle-text">
			<b>{label}</b>
			{description && <span>{description}</span>}
		</span>
	);
}

type RadioCtx = { name: string; value: string; onChange: (v: string) => void; disabled?: boolean };
const RadioContext = createContext<RadioCtx | null>(null);

export type RadioGroupProps = Omit<React.ComponentPropsWithRef<"div">, "onChange" | "defaultValue"> & {
	value?: string;
	defaultValue?: string;
	onChange?: (v: string) => void;
	label: string;
	/** Form field name of the radios (generated when not given). */
	name?: string;
	disabled?: boolean;
	children: React.ReactNode;
};

/** One choice out of a few. Children are <Radio value="…" label="…">. Controlled (`value`) or not (`defaultValue`). */
export function RadioGroup({ value: valueIn, defaultValue = "", onChange: onChangeIn, label, name: nameIn, disabled, children, className, ...props }: RadioGroupProps) {
	const autoName = useId();
	const name = nameIn ?? autoName;
	const [value, onChange] = useControllable(valueIn, defaultValue, onChangeIn);
	return (
		<RadioContext.Provider value={{ name, value, onChange, disabled }}>
			<div className={cn("si-radio-group", className)} role="radiogroup" aria-label={label} {...props}>
				{children}
			</div>
		</RadioContext.Provider>
	);
}

export type RadioProps = Omit<InputProps, "value" | "name"> & { value: string; label: React.ReactNode; description?: React.ReactNode };

export function Radio({ value, label, description, disabled: own, className, style, ...props }: RadioProps) {
	const ctx = useContext(RadioContext);
	if (!ctx) throw new Error("<Radio> needs <RadioGroup>");
	const disabled = own ?? ctx.disabled;
	return (
		<label className={cn("si-radio", disabled && "is-disabled", className)} style={style}>
			<input type="radio" name={ctx.name} value={value} checked={ctx.value === value} disabled={disabled} onChange={() => ctx.onChange(value)} {...props} />
			<span className="si-radio-dot" />
			<ToggleText label={label} description={description} />
		</label>
	);
}
