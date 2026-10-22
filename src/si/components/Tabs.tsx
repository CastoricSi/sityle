import { motion } from "motion/react";
import { useId } from "react";

import { spring } from "../core";

export type Option<T extends string> = { value: T; label?: React.ReactNode; icon?: React.ReactNode; title?: string };

/**
 * Switch between a few views or settings. The raised pill slides to the
 * chosen option. `role="radiogroup"` for settings, `"tablist"` for views.
 */
export function Segmented<T extends string>({
	value,
	onChange,
	options,
	label,
	role = "radiogroup",
}: {
	value: T;
	onChange: (v: T) => void;
	options: Option<T>[];
	label: string;
	role?: "radiogroup" | "tablist";
}) {
	const id = useId();
	const itemRole = role === "tablist" ? "tab" : "radio";
	return (
		<div className="si-seg" role={role} aria-label={label}>
			{options.map((o) => {
				const on = o.value === value;
				return (
					<button
						key={o.value}
						type="button"
						role={itemRole}
						aria-checked={itemRole === "radio" ? on : undefined}
						aria-selected={itemRole === "tab" ? on : undefined}
						aria-label={o.label ? undefined : o.title}
						title={o.title}
						onClick={() => onChange(o.value)}
					>
						{on && <motion.span layoutId={`${id}-pill`} className="si-seg-pill" transition={spring.bouncy} />}
						{o.icon}
						{o.label && <span>{o.label}</span>}
					</button>
				);
			})}
		</div>
	);
}

/** Sections within a page; a translucent brush swipe slides behind the current one, like a highlighter. */
export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: Option<T>[]; label: string }) {
	const id = useId();
	return (
		<div className="si-tabs" role="tablist" aria-label={label}>
			{options.map((o) => {
				const on = o.value === value;
				return (
					<button key={o.value} type="button" role="tab" aria-selected={on} onClick={() => onChange(o.value)}>
						{on && (
							<motion.span layoutId={`${id}-brush`} className="si-tabs-brush" transition={spring.bouncy}>
								<svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
									<path d="M3 3.4C20 1.5 45 2 70 1.7c10-.1 20.2.3 27 1.5 1.4 2 1.5 5.2.4 7.2C83.4 11.6 61 11 41 11.3c-13 .2-27 .6-38-.3C1.2 9 .9 5.5 3 3.4Z" fill="currentColor" />
								</svg>
							</motion.span>
						)}
						<span className="si-tabs-label">
							{o.icon}
							{o.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
