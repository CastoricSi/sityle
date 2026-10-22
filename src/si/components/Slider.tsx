import { useId } from "react";

/**
 * Pick a number in a range. The filled part of the track is 石绿; the thumb
 * grows a little while dragged. Shows the current value (formatted) on the right.
 */
export function Slider({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	format = (v) => String(v),
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
	step?: number;
	format?: (v: number) => string;
}) {
	const id = useId();
	const p = ((value - min) / (max - min)) * 100;
	return (
		<div className="si-slider">
			<div className="si-slider-head">
				<label htmlFor={id}>{label}</label>
				<output htmlFor={id}>{format(value)}</output>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				style={{ "--p": `${p}%` } as React.CSSProperties}
			/>
		</div>
	);
}
