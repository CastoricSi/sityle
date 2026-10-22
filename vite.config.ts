// The style page (deployed as the "sityle" Cloudflare Worker's static assets).
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as { version: string };

export default defineConfig({
	plugins: [react(), cloudflare()],
	// The page shows which release it is.
	define: { __SI_VERSION__: JSON.stringify(version) },
	resolve: {
		alias: { "@si": fileURLToPath(new URL("./src/si", import.meta.url)) },
	},
});
