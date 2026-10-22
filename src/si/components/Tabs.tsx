import { motion } from "motion/react";
import { useId } from "react";

import { cn, inkHandler, spring } from "../core";
import { useControllable } from "../internal/controllable";

export type Option<T extends string> = { value: T; label?: React.ReactNode; icon?: React.ReactNode; title?: string; disabled?: boolean };

/**
 * Arrow keys (and Home / End) move between options and choose as they go;
 * only the chosen option is in the Tab order (WAI-ARIA tabs / radio group).
 */
function useRovingKeys<T extends string>(options: Option<T>[], value: T | undefined, onChange: (v: T) => void) {
	return (e: React.KeyboardEvent<HTMLElement>) => {
		const enabled = options.filter((o) => !o.disabled);
		const i = enabled.findIndex((o) => o.value === value);
		const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
		const step = { ArrowRight: rtl ? -1 : 1, ArrowDown: 1, ArrowLeft: rtl ? 1 : -1, ArrowUp: -1 }[e.key];
		let next: Option<T> | undefined;
		if (step) next = enabled[(i + step + enabled.length) % enabled.length];
		else if (e.key === "Home") next = enabled[0];
		else if (e.key === "End") next = enabled[enabled.length - 1];
		if (!next) return;
		e.preventDefault();
		onChange(next.value);
		[...e.currentTarget.querySelectorAll<HTMLElement>("[data-value]")].find((el) => el.dataset.value === next.value)?.focus();
	};
}

export type SegmentedProps<T extends string> = Omit<React.ComponentPropsWithRef<"div">, "onChange" | "role" | "defaultValue"> & {
	value?: T;
	defaultValue?: T;
	onChange?: (v: T) => void;
	options: Option<T>[];
	label: string;
	role?: "radiogroup" | "tablist";
};

/**
 * Switch between a few views or settings. The raised pill slides to the
 * chosen option. `role="radiogroup"` for settings, `"tablist"` for views.
 */
export function Segmented<T extends string>({ value: valueIn, defaultValue, onChange: onChangeIn, options, label, role = "radiogroup", className, onKeyDown, ...props }: SegmentedProps<T>) {
	const [value, onChange] = useControllable(valueIn, defaultValue ?? options[0]?.value, onChangeIn);
	const id = useId();
	const itemRole = role === "tablist" ? "tab" : "radio";
	const keys = useRovingKeys(options, value, onChange);
	const focusable = options.some((o) => o.value === value) ? value : options.find((o) => !o.disabled)?.value;
	return (
		<div
			className={cn("si-seg", className)}
			role={role}
			aria-label={label}
			onKeyDown={(e) => {
				onKeyDown?.(e);
				if (!e.defaultPrevented) keys(e);
			}}
			{...props}
		>
			{options.map((o) => {
				const on = o.value === value;
				return (
					<button
						key={o.value}
						type="button"
						onPointerDown={inkHandler()}
						role={itemRole}
						data-value={o.value}
						tabIndex={o.value === focusable ? 0 : -1}
						disabled={o.disabled}
						aria-checked={itemRole === "radio" ? on : undefined}
						aria-selected={itemRole === "tab" ? on : undefined}
						aria-label={o.label ? undefined : o.title}
						title={o.title}
						onClick={() => onChange(o.value)}
					>
						{on && <motion.span layoutId={`${id}-pill`} className="si-seg-pill" transition={spring.bouncy} />}
						{/* the ink is clipped here, not by the button: the pill slides between buttons */}
						<span className="si-ink-layer" aria-hidden="true" />
						{o.icon}
						{o.label && <span>{o.label}</span>}
					</button>
				);
			})}
		</div>
	);
}

export type TabsProps<T extends string> = Omit<React.ComponentPropsWithRef<"div">, "onChange" | "role" | "defaultValue"> & {
	value?: T;
	defaultValue?: T;
	onChange?: (v: T) => void;
	options: Option<T>[];
	label: string;
	/** Give the tabs an id and render <TabPanel tabs={id} value=…> to link each tab to its panel. */
	id?: string;
};

const tabId = (tabs: string, value: string) => `${tabs}-tab-${value}`;
const panelId = (tabs: string, value: string) => `${tabs}-panel-${value}`;

/** Sections within a page; a translucent brush swipe slides behind the current one, like a highlighter. */
export function Tabs<T extends string>({ value: valueIn, defaultValue, onChange: onChangeIn, options, label, className, id, onKeyDown, ...props }: TabsProps<T>) {
	const [value, onChange] = useControllable(valueIn, defaultValue ?? options[0]?.value, onChangeIn);
	const autoId = useId();
	const keys = useRovingKeys(options, value, onChange);
	const focusable = options.some((o) => o.value === value) ? value : options.find((o) => !o.disabled)?.value;
	return (
		<div
			id={id}
			className={cn("si-tabs", className)}
			role="tablist"
			aria-label={label}
			onKeyDown={(e) => {
				onKeyDown?.(e);
				if (!e.defaultPrevented) keys(e);
			}}
			{...props}
		>
			{options.map((o) => {
				const on = o.value === value;
				return (
					<button
						key={o.value}
						id={id ? tabId(id, o.value) : undefined}
						type="button"
						onPointerDown={inkHandler()}
						role="tab"
						data-value={o.value}
						tabIndex={o.value === focusable ? 0 : -1}
						disabled={o.disabled}
						aria-selected={on}
						aria-controls={id ? panelId(id, o.value) : undefined}
						onClick={() => onChange(o.value)}
					>
						{on && (
							<motion.span layoutId={`${autoId}-brush`} className="si-tabs-brush" transition={spring.bouncy}>
								<svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
									<path d="M3 3.4C20 1.5 45 2 70 1.7c10-.1 20.2.3 27 1.5 1.4 2 1.5 5.2.4 7.2C83.4 11.6 61 11 41 11.3c-13 .2-27 .6-38-.3C1.2 9 .9 5.5 3 3.4Z" fill="currentColor" />
								</svg>
							</motion.span>
						)}
						<span className="si-ink-layer" aria-hidden="true" />
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

export type TabPanelProps = React.ComponentPropsWithRef<"div"> & {
	/** The `id` of the <Tabs>. */
	tabs: string;
	/** The option this panel belongs to. */
	value: string;
};

/** The content of one tab; render the current one (or all, with `hidden` on the rest). */
export function TabPanel({ tabs, value, className, ...props }: TabPanelProps) {
	return <div role="tabpanel" id={panelId(tabs, value)} aria-labelledby={tabId(tabs, value)} tabIndex={0} className={cn("si-tab-panel", className)} {...props} />;
}
