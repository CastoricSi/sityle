// ESLint: TypeScript + the rules of hooks. `npm run lint`.
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({ ignores: ["dist", ".wrangler", "node_modules"] }, js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat.recommended, {
	languageOptions: { globals: { ...globals.browser, ...globals.node } },
	rules: {
		"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
	},
});
