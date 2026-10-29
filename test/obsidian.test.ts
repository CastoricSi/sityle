// obsidian/theme.css is generated from tokens.css and obsidian/sityle.css: it must be current.
import { expect, test } from "vitest";
// @ts-expect-error -- a plain .mjs script, no types
import { obsidianTheme } from "../scripts/build-obsidian.mjs";
import theme from "../obsidian/theme.css?raw";
import mapping from "../obsidian/sityle.css?raw";
import tokens from "../src/si/tokens.css?raw";

test("obsidian/theme.css is up to date (npm run build:obsidian)", () => {
	expect(theme).toBe(obsidianTheme(tokens, mapping));
});

test("every --si-* token the theme uses is defined", () => {
	const used = new Set([...theme.matchAll(/var\((--si-[\w-]+)\)/g)].map((m) => m[1]));
	for (const name of used) expect(theme, name).toMatch(new RegExp(`${name}\\s*:`));
});
