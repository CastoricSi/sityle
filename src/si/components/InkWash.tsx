import { useEffect, useRef } from "react";

import { useTheme } from "../core";

type Blot = { x: number; y: number; r: number; rgb: [number, number, number]; alpha: number };
/** [x, y, radius (fractions of the box), colour token, strength] */
export type InkBlot = [number, number, number, string, number];

/**
 * Decorative ink-wash background (fills its positioned parent). Soft blots
 * of 石绿 / 石青 / 墨 / 泥金 bloom in once, then stay still. Repaints on
 * theme change and when its box changes size. Deterministic: the same seed
 * paints the same wash.
 */
export function InkWash({ seed = 20261022, blots = DEFAULT_BLOTS, className, style }: { seed?: number; blots?: InkBlot[]; className?: string; style?: React.CSSProperties }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const { resolved } = useTheme();
	const first = useRef(true);
	// compare by content, so an inline array does not repaint on every render
	const blotsKey = JSON.stringify(blots);

	useEffect(() => {
		const cv = canvas.current!;
		const list = JSON.parse(blotsKey) as InkBlot[];
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		const paint = (animate: boolean) => {
			cancelAnimationFrame(raf);
			const ctx = cv.getContext("2d");
			if (!ctx) return;
			const dpr = Math.min(2, devicePixelRatio || 1);
			const w = cv.clientWidth;
			const h = cv.clientHeight;
			cv.width = w * dpr;
			cv.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			let s = seed;
			const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
			const base = Math.max(w, 600);
			const spots: Blot[] = [];
			for (const [fx, fy, fr, token, alpha] of list) {
				const rgb = tokenRGB(cv, token);
				const b = { x: w * fx, y: h * fy, r: base * fr };
				for (let i = 0; i < 46; i++) {
					const ang = rnd() * Math.PI * 2;
					const d = Math.pow(rnd(), 0.7) * b.r;
					spots.push({ x: b.x + Math.cos(ang) * d, y: b.y + Math.sin(ang) * d * 0.7, r: b.r * (0.12 + rnd() * 0.3), rgb, alpha: alpha * (0.35 + rnd() * 0.65) });
				}
			}
			const draw = (t: number) => {
				ctx.clearRect(0, 0, w, h);
				for (const p of spots) {
					const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * t);
					const [r, gr, bl] = p.rgb;
					g.addColorStop(0, `rgba(${r},${gr},${bl},${p.alpha})`);
					g.addColorStop(0.55, `rgba(${r},${gr},${bl},${p.alpha * 0.45})`);
					g.addColorStop(1, `rgba(${r},${gr},${bl},0)`);
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
		// SiProvider applies the theme in a layout effect, so the tokens are current here.
		paint(first.current);
		first.current = false;
		let timer = 0;
		let size = `${cv.clientWidth}x${cv.clientHeight}`;
		const ro = new ResizeObserver(() => {
			const now = `${cv.clientWidth}x${cv.clientHeight}`;
			if (now === size) return;
			size = now;
			clearTimeout(timer);
			timer = window.setTimeout(() => paint(false), 120);
		});
		ro.observe(cv);
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(timer);
			ro.disconnect();
		};
	}, [resolved, seed, blotsKey]);

	return <canvas ref={canvas} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }} />;
}

const DEFAULT_BLOTS: InkBlot[] = [
	[0.78, 0.2, 0.26, "--si-jade", 0.1],
	[0.95, 0.85, 0.2, "--si-azure", 0.08],
	[0.55, 1.05, 0.16, "--si-ink", 0.06],
	[0.06, 0.05, 0.12, "--si-gold", 0.07],
];

let scratch: CanvasRenderingContext2D | null = null;

/**
 * A colour token as RGB, whatever its CSS form (hex, rgb, oklch, light-dark(),
 * color-mix()…): the browser resolves it on a probe next to the canvas (so local
 * overrides apply), then a 1×1 canvas turns the result into bytes.
 */
function tokenRGB(near: Element, token: string): [number, number, number] {
	const probe = document.createElement("i");
	probe.style.cssText = `display:none;color:var(${token})`;
	(near.parentElement ?? document.body).appendChild(probe);
	const color = getComputedStyle(probe).color;
	probe.remove();
	scratch ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
	if (!scratch) return [0, 0, 0];
	scratch.clearRect(0, 0, 1, 1);
	scratch.fillStyle = "#000";
	scratch.fillStyle = color;
	scratch.fillRect(0, 0, 1, 1);
	const [r = 0, g = 0, b = 0] = scratch.getImageData(0, 0, 1, 1).data;
	return [r, g, b];
}
