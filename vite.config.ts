// The style page (deployed as the "sityle" Cloudflare Worker's static assets).
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), cloudflare()],
	resolve: {
		alias: { "@si": fileURLToPath(new URL("./src/si", import.meta.url)) },
	},
});
