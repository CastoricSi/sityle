import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false while rendering on the server and during hydration, true after. */
export function useIsClient(): boolean {
	return useSyncExternalStore(
		noop,
		() => true,
		() => false,
	);
}

/** A media query as state; false on the server. */
export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		(cb) => {
			const mql = matchMedia(query);
			mql.addEventListener("change", cb);
			return () => mql.removeEventListener("change", cb);
		},
		() => matchMedia(query).matches,
		() => false,
	);
}
