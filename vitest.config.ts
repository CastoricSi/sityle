// Unit tests for the package (jsdom). `npm test`.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: ["./test/setup.ts"],
		// component CSS stays out of jsdom; tests that read a stylesheet import it with ?raw
		css: { include: [/\?raw$/] },
	},
});
