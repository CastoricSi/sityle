import { useId } from "react";

import { cn } from "../core";

export type SliderProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "value" | "onChange" | "min" | "max" | "step"> & {
	label: React.ReactNode;
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
	step?: number;
	/** How the value is shown on the right (and read out by screen readers). */
	format?: (v: number) => string;
};

/**
 * Pick a number in a range. The filled part of the track is 石绿; the thumb
 * grows a little while dragged. Shows the current value (formatted) on the right.
 * Native props go to the <input type="range">; `className` / `style` to the wrapper.
 */
export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, format = String, id, className, style, disabled, ...props }: SliderProps) {
	const autoId = useId();
	const inputId = id ?? autoId;
	const p = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;
	const text = format(value);
	return (
		<div className={cn("si-slider", disabled && "is-disabled", className)} style={style}>
			<div className="si-slider-head">
				<label htmlFor={inputId}>{label}</label>
				<output htmlFor={inputId}>{text}</output>
			</div>
			<input
				id={inputId}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				disabled={disabled}
				aria-valuetext={text}
				onChange={(e) => onChange(Number(e.target.value))}
				style={{ "--p": `${p}%` } as React.CSSProperties}
				{...props}
			/>
		</div>
	);
}
