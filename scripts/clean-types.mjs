// The library's CSS is shipped as sityle/style.css; drop the CSS side-effect
// imports that tsc copies into the type definitions.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../dist/lib/types/index.d.ts", import.meta.url);
writeFileSync(file, readFileSync(file, "utf8").replace(/^import "\.\/[\w-]+\.css";\r?\n/gm, ""));
