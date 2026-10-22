import { MotionConfig, type Transition } from "motion/react";
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from "react";

import { useMediaQuery } from "./internal/client";
import { MessagesContext, zh, type Messages } from "./messages";

/* ── class names ── */
export function cn(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ");
}

/* ── motion presets (match the CSS easings in tokens.css) ── */
export const spring = {
	/** 回弹: things that change shape or slide (pills, knobs, dialogs). */
	bouncy: { type: "spring", stiffness: 520, damping: 30, mass: 0.9 },
	/** Snappier, barely overshoots: indicators that follow the pointer. */
	snappy: { type: "spring", stiffness: 640, damping: 40 },
	/** Soft settle for large surfaces. */
	gentle: { type: "spring", stiffness: 260, damping: 28 },
} satisfies Record<string, Transition>;

export const ease = {
	out: [0.22, 1, 0.36, 1],
	in: [0.55, 0, 0.75, 0.2],
} as const;

/* ── ink ripple ── */
const prefersReducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drops ink at the pointer: grows with a ragged, bleeding edge, then fades
 * once the pointer is released. The host needs `si-ink-host` (any component
 * here that takes `ink` already has it).
 */
export function spawnInk(host: HTMLElement, clientX: number, clientY: number) {
	if (prefersReducedMotion()) return;
	const r = host.getBoundingClientRect();
	const size = Math.hypot(r.width, r.height) * 2.2;
	const ink = document.createElement("span");
	ink.className = "si-ink";
	Object.assign(ink.style, {
		width: `${size}px`,
		height: `${size}px`,
		left: `${clientX - r.left - size / 2}px`,
		top: `${clientY - r.top - size / 2}px`,
	});
	host.appendChild(ink);
	const grow = ink.animate(
		[
			{ transform: "scale(0)", opacity: 0.3 },
			{ transform: "scale(1)", opacity: 0.18 },
		],
		{ duration: 620, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
	);
	const release = () => {
		removeEventListener("pointerup", release);
		removeEventListener("pointercancel", release);
		void grow.finished.then(() =>
			ink
				.animate([{ opacity: 0.18 }, { opacity: 0 }], { duration: 420, easing: "ease-out", fill: "forwards" })
				.finished.then(() => ink.remove()),
		);
	};
	addEventListener("pointerup", release);
	addEventListener("pointercancel", release);
}

/** onPointerDown that drops ink, then calls the caller's own handler. */
export function inkHandler<T extends HTMLElement>(own?: React.PointerEventHandler<T>): React.PointerEventHandler<T> {
	return (e) => {
		const el = e.currentTarget;
		const off = ("disabled" in el && el.disabled === true) || el.getAttribute("aria-disabled") === "true";
		if (e.button === 0 && !off) spawnInk(el, e.clientX, e.clientY);
		own?.(e);
	};
}

/* ── theme ── */
export type ThemeChoice = "light" | "dark" | "system";
type ThemeContext = { choice: ThemeChoice; resolved: "light" | "dark"; setChoice: (c: ThemeChoice) => void };

const ThemeCtx = createContext<ThemeContext | null>(null);
const STORAGE_KEY = "si-theme";

function readChoice(): ThemeChoice {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === "light" || v === "dark" || v === "system") return v;
	} catch {
		// storage blocked: fall back to the system
	}
	return "system";
}

// The remembered choice as an external store: the server (and hydration) render
// "system", the client then switches to what was stored, without a mismatch.
const choiceListeners = new Set<() => void>();
const storedChoice = {
	subscribe(cb: () => void) {
		choiceListeners.add(cb);
		const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && cb();
		addEventListener("storage", onStorage);
		return () => {
			choiceListeners.delete(cb);
			removeEventListener("storage", onStorage);
		};
	},
	set(c: ThemeChoice) {
		try {
			localStorage.setItem(STORAGE_KEY, c);
		} catch {
			// not remembered; still applied
		}
		memory = c;
		choiceListeners.forEach((l) => l());
	},
	get: (): ThemeChoice => memory ?? readChoice(),
};
let memory: ThemeChoice | null = null;

/**
 * Put this in <head> (before the stylesheet paints) so a remembered theme
 * applies on the first frame, with no flash of the light theme:
 * `<script dangerouslySetInnerHTML={{ __html: themeScript }} />`.
 */
export const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

/**
 * Wrap the app once: theme (宣纸 / 浓墨 / system), the SVG filters the ink
 * effects use, and Motion's reduced-motion handling.
 * Uncontrolled, the theme is remembered in localStorage. Pass `theme` (and
 * `onThemeChange`) when the app keeps the setting itself.
 */
export function SiProvider({
	children,
	theme,
	onThemeChange,
	messages,
}: {
	children: React.ReactNode;
	theme?: ThemeChoice;
	onThemeChange?: (choice: ThemeChoice) => void;
	/** The texts sityle writes itself (default Chinese): `en`, or your own / a partial override. */
	messages?: Partial<Messages>;
}) {
	const own = useSyncExternalStore(storedChoice.subscribe, storedChoice.get, () => "system" as const);
	const controlled = theme !== undefined;
	const choice = controlled ? theme : own;
	const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
	const resolved = choice === "system" ? (systemDark ? "dark" : "light") : choice;

	// a layout effect: children's effects (InkWash reads tokens) already see the new theme
	useLayoutEffect(() => {
		const root = document.documentElement;
		if (choice === "system") root.removeAttribute("data-theme");
		else root.setAttribute("data-theme", choice);
	}, [choice]);

	const setChoice = useCallback(
		(c: ThemeChoice) => {
			if (!controlled) storedChoice.set(c);
			onThemeChange?.(c);
		},
		[controlled, onThemeChange],
	);

	const value = useMemo(() => ({ choice, resolved, setChoice }), [choice, resolved, setChoice]);
	const texts = useMemo(() => ({ ...zh, ...messages }), [messages]);
	return (
		<ThemeCtx.Provider value={value}>
			<MessagesContext.Provider value={texts}>
				<MotionConfig reducedMotion="user">
					<SiDefs />
					{children}
				</MotionConfig>
			</MessagesContext.Provider>
		</ThemeCtx.Provider>
	);
}

export function useTheme(): ThemeContext {
	const ctx = useContext(ThemeCtx);
	if (!ctx) throw new Error("useTheme needs <SiProvider>");
	return ctx;
}

/** Shared SVG: the ink-bleed filter and the brush-stroke shape. */
function SiDefs() {
	return (
		<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
			<filter id="si-bleed" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves={2} seed={7} result="n" />
				<feDisplacementMap in="SourceGraphic" in2="n" scale={14} />
				<feGaussianBlur stdDeviation={1.2} />
			</filter>
			<symbol id="si-stroke" viewBox="0 0 120 10" preserveAspectRatio="none">
				<path d="M2 6.5C20 3.8 42 3.2 62 4.1c18 .8 36 1.6 56-1.2-15 3.7-36 4.6-56 4.3C40 7 20 7.8 2 6.5Z" fill="currentColor" />
			</symbol>
		</svg>
	);
}

/** A brush stroke (underlines, tab indicator). Colour = currentColor. */
export function BrushStroke({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<svg className={className} style={style} aria-hidden="true">
			<use href="#si-stroke" />
		</svg>
	);
}
