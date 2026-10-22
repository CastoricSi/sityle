// The installable package: dist/lib/index.js (ES module) + dist/lib/style.css.
// React, Motion and lucide-react stay external (peer dependencies).
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const external = ["react", "react-dom", "motion", "lucide-react"];

export default defineConfig({
	plugins: [react()],
	publicDir: false,
	build: {
		outDir: "dist/lib",
		emptyOutDir: true,
		sourcemap: true,
		lib: {
			entry: fileURLToPath(new URL("./src/si/index.ts", import.meta.url)),
			formats: ["es"],
			fileName: "index",
			cssFileName: "style",
		},
		rollupOptions: {
			external: (id) => external.some((e) => id === e || id.startsWith(`${e}/`)),
			// Every component uses hooks: React Server Components frameworks (Next.js app router) need this.
			output: { banner: '"use client";' },
		},
	},
});
