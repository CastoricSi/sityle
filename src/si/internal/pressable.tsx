// A control that is a <button>, or a link when it has `href` (optionally rendered
// by the app's router link via `as`).

/** Props of the button form: no href. */
export type AsButton<Own> = Own & Omit<React.ComponentPropsWithRef<"button">, keyof Own | "color"> & { href?: undefined; as?: undefined };

/**
 * Props of the link form: an `href`, rendered as <a> or as `as` (a router link:
 * Next.js `Link` takes href as is; for `to`-style links pass a small wrapper).
 */
export type AsLink<Own> = Own & Omit<React.ComponentPropsWithRef<"a">, keyof Own | "color"> & { href: string; as?: React.ElementType; disabled?: boolean };

export type Pressable<Own> = AsButton<Own> | AsLink<Own>;

// Either form's handlers: typed for a button or an anchor, called with whichever rendered.
type AnyClick = React.MouseEventHandler<never>;
type Loose = { href?: string; as?: React.ElementType; disabled?: boolean; type?: string; onClick?: AnyClick; [k: string]: unknown };

/** Renders the element; a disabled link loses its href and ignores clicks. */
export function PressableElement({ href, as, disabled, type = "button", onClick, ...props }: Loose) {
	if (href === undefined) return <button type={type as "button"} disabled={disabled} onClick={onClick} {...props} />;
	const Link = as ?? "a";
	return (
		<Link
			href={disabled ? undefined : href}
			aria-disabled={disabled || undefined}
			onClick={(e: React.MouseEvent<HTMLElement>) => {
				if (disabled) return e.preventDefault();
				(onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(e);
			}}
			{...props}
		/>
	);
}
