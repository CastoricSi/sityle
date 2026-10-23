import { cn } from "../core";
import type { Tone } from "./Button";

export type TypographyVariant = "display" | "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "label" | "caption" | "code" | "quote";

/** The element each variant renders by default (`as` changes it, the look stays). */
const ELEMENT: Record<TypographyVariant, React.ElementType> = {
	display: "h1",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	body: "p",
	"body-sm": "p",
	label: "span",
	caption: "span",
	code: "code",
	quote: "blockquote",
};

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
	ref?: React.Ref<HTMLElement>;
	/** The step of the type scale (default `body`). */
	variant?: TypographyVariant;
	/** The element to render, when the meaning differs from the look: `<Typography variant="h3" as="h2">`. */
	as?: React.ElementType;
	/** Colour: `muted` (secondary), `faint` (hints), or a pigment. Default: the colour around it. */
	tone?: "muted" | "faint" | Tone;
	/** Cut the text after this many lines, with an ellipsis (1 = one line). */
	lines?: number;
	align?: "start" | "center" | "end";
};

/**
 * Text on the type scale: brush display, serif headings (`--si-font-heading`),
 * sans body, mono code. No margins: space it with the layout around it.
 */
export function Typography({ variant = "body", as, tone, lines, align, className, style, ...props }: TypographyProps) {
	const Tag = as ?? ELEMENT[variant];
	return (
		<Tag
			className={cn("si-text", `v-${variant}`, tone && `t-${tone}`, lines ? (lines === 1 ? "is-truncate" : "is-clamp") : undefined, align && `a-${align}`, className)}
			style={lines && lines > 1 ? { WebkitLineClamp: lines, ...style } : style}
			{...props}
		/>
	);
}
