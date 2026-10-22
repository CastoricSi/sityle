import { cn } from "../core";

/** Three rings of ink spreading out. Takes the current text colour. */
export function InkDrop({ className, label }: { className?: string; label?: string }) {
	return (
		<span className={cn("si-inkdrop", className)} role={label ? "status" : undefined} aria-label={label}>
			<i />
			<i />
			<i />
		</span>
	);
}

/** Three slanted bars hopping in turn (loading). Colour: currentColor (朱砂 by default). */
export function InkBars({ label = "加载中", className }: { label?: string; className?: string }) {
	return (
		<span className={cn("si-inkbars", className)} role="status" aria-label={label}>
			<i />
			<i />
			<i />
		</span>
	);
}

/** A brush circle being drawn and wiped, round and round. */
export function BrushSpinner({ label = "加载中" }: { label?: string }) {
	return (
		<svg className="si-brushspin" viewBox="0 0 24 24" role="status" aria-label={label}>
			<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
		</svg>
	);
}

/** Placeholder line while content loads. */
export function Skeleton({ width = "100%" }: { width?: string | number }) {
	return <div className="si-skeleton" style={{ width }} aria-hidden="true" />;
}
