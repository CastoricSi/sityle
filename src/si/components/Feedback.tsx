import { cn } from "../core";
import { useMessages } from "../messages";

type SpanProps = Omit<React.ComponentPropsWithRef<"span">, "children">;

/** Three rings of ink spreading out. Takes the current text colour. */
export function InkDrop({ className, label, ...props }: SpanProps & { label?: string }) {
	return (
		<span className={cn("si-inkdrop", className)} role={label ? "status" : undefined} aria-label={label} {...props}>
			<i />
			<i />
			<i />
		</span>
	);
}

/** Three slanted bars hopping in turn (loading). Colour: currentColor (朱砂 by default). */
export function InkBars({ label, className, ...props }: SpanProps & { label?: string }) {
	const t = useMessages();
	return (
		<span className={cn("si-inkbars", className)} role="status" aria-label={label ?? t.loading} {...props}>
			<i />
			<i />
			<i />
		</span>
	);
}

/** A brush circle being drawn and wiped, round and round. */
export function BrushSpinner({ label, className, ...props }: Omit<React.ComponentPropsWithRef<"svg">, "children"> & { label?: string }) {
	const t = useMessages();
	return (
		<svg className={cn("si-brushspin", className)} viewBox="0 0 24 24" role="status" aria-label={label ?? t.loading} {...props}>
			<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
		</svg>
	);
}

/** Placeholder line while content loads. */
export function Skeleton({ width = "100%", className, style, ...props }: Omit<React.ComponentPropsWithRef<"div">, "children"> & { width?: string | number }) {
	return <div className={cn("si-skeleton", className)} style={{ width, ...style }} aria-hidden="true" {...props} />;
}
