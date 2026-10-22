// Helpers for modal layers (Dialog): what can take focus, and page scroll lock.

const TABBABLE = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=hidden])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
	"[contenteditable='true']",
].join(",");

/** Elements inside `root` reachable with Tab, in order. */
export function tabbables(root: HTMLElement): HTMLElement[] {
	return [...root.querySelectorAll<HTMLElement>(TABBABLE)].filter((el) => !el.closest("[inert]") && (el.checkVisibility?.() ?? true));
}

/** Popovers portaled to <body> (menus, lists, tooltips) mark themselves so a modal treats them as its own. */
export const LAYER_ATTR = "data-si-layer";

let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/** Stops the page behind from scrolling; nested locks stack. Returns the unlock. */
export function lockScroll(): () => void {
	const html = document.documentElement;
	if (locks++ === 0) {
		saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
		// keep the layout from jumping when the scrollbar disappears
		const bar = innerWidth - html.clientWidth;
		html.style.overflow = "hidden";
		if (bar > 0) html.style.paddingRight = `${bar}px`;
	}
	let done = false;
	return () => {
		if (done) return;
		done = true;
		if (--locks === 0 && saved) {
			html.style.overflow = saved.overflow;
			html.style.paddingRight = saved.paddingRight;
			saved = null;
		}
	};
}
