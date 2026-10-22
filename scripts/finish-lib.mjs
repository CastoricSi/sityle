// After the package build: drop the CSS side-effect imports that tsc copies into
// the type definitions, ship base.css as is, and wrap style.css in a cascade layer
// for apps that order their CSS with @layer, and copy the per-component CSS files.
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const lib = new URL("../dist/lib/", import.meta.url);
const types = new URL("types/index.d.ts", lib);
writeFileSync(types, readFileSync(types, "utf8").replace(/^import "\.\/[\w-]+\.css";\r?\n/gm, ""));

copyFileSync(new URL("../src/si/base.css", import.meta.url), new URL("base.css", lib));
writeFileSync(new URL("style.layer.css", lib), `@layer sityle{${readFileSync(new URL("style.css", lib), "utf8")}}\n`);

// sityle/css/<file>.css: tokens + core + the files of the components in use
const css = new URL("css/", lib);
mkdirSync(css, { recursive: true });
copyFileSync(new URL("../src/si/tokens.css", import.meta.url), new URL("tokens.css", css));
const styles = new URL("../src/si/styles/", import.meta.url);
for (const f of readdirSync(styles)) copyFileSync(new URL(f, styles), new URL(f, css));
