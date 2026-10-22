import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useId, useState } from "react";

import { spring } from "../core";

/** On / off. The knob stretches while pressed and springs into place. */
export function Switch({
	checked,
	onChange,
	label,
	description,
	disabled,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
}) {
	const [pressed, setPressed] = useState(false);
	return (
		<label
			className="si-switch"
			style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
			onPointerDown={() => setPressed(true)}
			onPointerUp={() => setPressed(false)}
			onPointerLeave={() => setPressed(false)}
		>
			<input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
			<span className="si-switch-track">
				<motion.span className="si-switch-knob" layout transition={spring.bouncy} animate={{ width: pressed ? 30 : 24 }}>
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
			<span className="si-switch-text">
				<b>{label}</b>
				{description && <span>{description}</span>}
			</span>
		</label>
	);
}

/** Checkbox whose tick is drawn like a brush stroke. */
export function Checkbox({ checked, onChange, children, disabled }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode; disabled?: boolean }) {
	return (
		<label className="si-check" style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
			<input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
			<span className="si-check-box">
				<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<path d="M3.2 8.4 6.6 11.6 12.8 4.6" />
				</svg>
			</span>
			{children}
		</label>
	);
}

type RadioCtx = { name: string; value: string; onChange: (v: string) => void };
const RadioContext = createContext<RadioCtx | null>(null);

/** One choice out of a few. Children are <Radio value="…">. */
export function RadioGroup({ value, onChange, label, children }: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
	const name = useId();
	return (
		<RadioContext.Provider value={{ name, value, onChange }}>
			<div className="si-radio-group" role="radiogroup" aria-label={label}>
				{children}
			</div>
		</RadioContext.Provider>
	);
}

export function Radio({ value, children }: { value: string; children: React.ReactNode }) {
	const ctx = useContext(RadioContext);
	if (!ctx) throw new Error("<Radio> needs <RadioGroup>");
	return (
		<label className="si-radio">
			<input type="radio" name={ctx.name} checked={ctx.value === value} onChange={() => ctx.onChange(value)} />
			<span className="si-radio-dot" />
			{children}
		</label>
	);
}
