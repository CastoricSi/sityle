import { cn } from "../core";

/**
 * Plain boxes for forms that put the label outside (TextField floats it
 * inside instead). Same well, focus ring and invalid tint as TextField.
 */
export function Input({ className, mono, ...props }: React.ComponentPropsWithRef<"input"> & { mono?: boolean }) {
	return <input className={cn("si-input", mono && "is-mono", className)} {...props} />;
}

export function TextArea({ className, ...props }: React.ComponentPropsWithRef<"textarea">) {
	return <textarea className={cn("si-input", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentPropsWithRef<"select">) {
	return <select className={cn("si-input", className)} {...props} />;
}
