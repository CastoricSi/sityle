import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { palettes, SiProvider, useTheme, type Palette } from "../src/si";
import tokens from "../src/si/tokens.css?raw";

const root = () => document.documentElement;

function Show() {
	const { palette } = useTheme();
	return <span>{palettes[palette]}</span>;
}

test("丹青 by default: no palette attribute", () => {
	render(
		<SiProvider>
			<Show />
		</SiProvider>,
	);
	expect(root().hasAttribute("data-si-palette")).toBe(false);
	expect(screen.getByText("丹青")).toBeTruthy();
});

test("palette=cyrene sets <html data-si-palette>, follows the prop, and is put back on unmount", () => {
	const view = (palette: Palette) => (
		<SiProvider palette={palette}>
			<Show />
		</SiProvider>
	);
	const { rerender, unmount } = render(view("cyrene"));
	expect(root().getAttribute("data-si-palette")).toBe("cyrene");
	expect(screen.getByText("落英")).toBeTruthy();
	rerender(view("si"));
	expect(root().hasAttribute("data-si-palette")).toBe(false);
	rerender(view("cyrene"));
	unmount();
	expect(root().hasAttribute("data-si-palette")).toBe(false);
});

test("落英 gives every colour token of 丹青 a value of its own", () => {
	const blocks = [...tokens.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim(), body }));
	const names = (body = "") => new Set([...body.matchAll(/(--si-[\w-]+)\s*:\s*light-dark\(/g)].map((m) => m[1]));
	const si = names(blocks.find((b) => b.selector === ":root" && b.body.includes("--si-paper"))?.body);
	const cyrene = names(blocks.find((b) => b.selector === ':root[data-si-palette="cyrene"]')?.body);
	expect(si.size).toBeGreaterThan(20);
	expect([...si].filter((n) => !cyrene.has(n))).toEqual([]);
});
