// After the package build: drop the CSS side-effect imports that tsc copies into
// the type definitions, ship base.css as is, and wrap style.css in a cascade layer
// for apps that order their CSS with @layer.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const lib = new URL("../dist/lib/", import.meta.url);
const types = new URL("types/index.d.ts", lib);
writeFileSync(types, readFileSync(types, "utf8").replace(/^import "\.\/[\w-]+\.css";\r?\n/gm, ""));

copyFileSync(new URL("../src/si/base.css", import.meta.url), new URL("base.css", lib));
writeFileSync(new URL("style.layer.css", lib), `@layer sityle{${readFileSync(new URL("style.css", lib), "utf8")}}\n`);
