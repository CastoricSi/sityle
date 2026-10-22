import { useEffect, useRef } from "react";

import { useTheme } from "../core";

type Blot = { x: number; y: number; r: number; color: string; alpha: number };

/**
 * Decorative ink-wash background (fills its positioned parent). Soft blots
 * of 石绿 / 石青 / 墨 / 泥金 bloom in once, then stay still. Repaints on
 * theme change and resize. Deterministic: the same seed paints the same wash.
 */
export function InkWash({ seed = 20261022, blots = DEFAULT_BLOTS }: { seed?: number; blots?: Array<[number, number, number, string, number]> }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const { resolved } = useTheme();
	const first = useRef(true);

	useEffect(() => {
		const cv = canvas.current!;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		const paint = (animate: boolean) => {
			cancelAnimationFrame(raf);
			const ctx = cv.getContext("2d")!;
			const dpr = Math.min(2, devicePixelRatio || 1);
			const w = cv.clientWidth;
			const h = cv.clientHeight;
			cv.width = w * dpr;
			cv.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const css = getComputedStyle(document.documentElement);
			let s = seed;
			const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
			const base = Math.max(w, 600);
			const spots: Blot[] = [];
			for (const [fx, fy, fr, token, alpha] of blots) {
				const color = css.getPropertyValue(token).trim();
				const b = { x: w * fx, y: h * fy, r: base * fr };
				for (let i = 0; i < 46; i++) {
					const ang = rnd() * Math.PI * 2;
					const d = Math.pow(rnd(), 0.7) * b.r;
					spots.push({ x: b.x + Math.cos(ang) * d, y: b.y + Math.sin(ang) * d * 0.7, r: b.r * (0.12 + rnd() * 0.3), color, alpha: alpha * (0.35 + rnd() * 0.65) });
				}
			}
			const draw = (t: number) => {
				ctx.clearRect(0, 0, w, h);
				for (const p of spots) {
					const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * t);
					g.addColorStop(0, rgba(p.color, p.alpha));
					g.addColorStop(0.55, rgba(p.color, p.alpha * 0.45));
					g.addColorStop(1, rgba(p.color, 0));
					ctx.fillStyle = g;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r * t, 0, Math.PI * 2);
					ctx.fill();
				}
			};
			if (!animate || reduce) return draw(1);
			const t0 = performance.now();
			const step = (now: number) => {
				const k = Math.min(1, (now - t0) / 1600);
				draw(0.35 + 0.65 * (1 - Math.pow(1 - k, 3)));
				if (k < 1) raf = requestAnimationFrame(step);
			};
			draw(0.35);
			raf = requestAnimationFrame(step);
		};
		// wait a frame so the theme's variables are applied before reading them
		const kick = requestAnimationFrame(() => {
			paint(first.current);
			first.current = false;
		});
		let timer = 0;
		const onResize = () => {
			clearTimeout(timer);
			timer = window.setTimeout(() => paint(false), 120);
		};
		addEventListener("resize", onResize);
		return () => {
			cancelAnimationFrame(kick);
			cancelAnimationFrame(raf);
			clearTimeout(timer);
			removeEventListener("resize", onResize);
		};
	}, [resolved, seed, blots]);

	return <canvas ref={canvas} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/** [x, y, radius (fractions of the box), colour token, strength] */
const DEFAULT_BLOTS: Array<[number, number, number, string, number]> = [
	[0.78, 0.2, 0.26, "--si-jade", 0.1],
	[0.95, 0.85, 0.2, "--si-azure", 0.08],
	[0.55, 1.05, 0.16, "--si-ink", 0.06],
	[0.06, 0.05, 0.12, "--si-gold", 0.07],
];

function rgba(c: string, a: number) {
	if (c.startsWith("#")) {
		const n = c.length === 4 ? [...c.slice(1)].map((x) => x + x).join("") : c.slice(1, 7);
		return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`;
	}
	const m = c.match(/[\d.]+/g) ?? ["0", "0", "0"];
	return `rgba(${m[0]},${m[1]},${m[2]},${a})`;
}
