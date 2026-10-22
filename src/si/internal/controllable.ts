import { useState } from "react";

/**
 * Controlled when `value` is given, otherwise keeps its own state starting at
 * `defaultValue`. Either way `onChange` hears every change.
 */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void] {
	const [own, setOwn] = useState(defaultValue);
	const controlled = value !== undefined;
	return [
		controlled ? value : own,
		(v: T) => {
			if (!controlled) setOwn(v);
			onChange?.(v);
		},
	];
}
