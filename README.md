# sityle · 丹青

An ink-wash (水墨丹青) design language: rice-paper ground, ink text, the
mineral pigments 石绿 / 石青 / 泥金 / 朱砂, and Material-style motion
(ink-drop ripples, springy switches and tabs, dialogs set down like paper).

This repo is two things:

- **The package** `sityle` — tokens, styles and React components (`src/si/`).
- **The style page** — a live tour of every component (`src/showcase/`),
  deployed as the Cloudflare Worker `sityle` (static assets in `dist/client`).

## Use it in a project

Install a release (each GitHub Release has the exact command in its notes):

```sh
npm i https://github.com/CastoricSi/sityle/releases/download/v0.1.0/sityle-0.1.0.tgz
npm i react react-dom motion lucide-react   # peer dependencies, if not there yet
```

```tsx
import { SiProvider, Button, TextField } from "sityle";
import "sityle/style.css";

<SiProvider>
  <Button>保存</Button>
</SiProvider>;
```

- Load the fonts (Ma Shan Zheng, Noto Serif SC, Noto Sans SC, JetBrains Mono —
  see `index.html`), or the fallbacks are used.
- `style.css` includes page basics (`body` background and text, focus ring,
  reduced motion). Colours are CSS variables `--si-*`; classes are `si-*`.
- `useTheme()` → `{ choice, resolved, setChoice }` ("light" | "dark" | "system");
  `<html data-theme>` is set for you. Uncontrolled, the choice is remembered;
  an app that keeps its own setting passes `<SiProvider theme onThemeChange>`.
- Text sizes are in `rem`, so they follow the page's root font size.

While working on sityle and a project together, link the local copy instead
of the release (don't commit this): `npm i ../sityle` in the project, and run
`npm run build:lib` here after changes. With a local link, add
`resolve: { dedupe: ["react", "react-dom", "motion", "lucide-react"] }` to the
project's Vite config, or two copies of React load ("Invalid hook call").

## Develop

```sh
npm install
npm run dev          # style page
npm run build        # typecheck + style page + Worker (what Cloudflare runs)
npm run build:lib    # the package → dist/lib (index.js, style.css, types/)
```

## Release

```sh
npm run release:patch   # 0.1.0 → 0.1.1   (or release:minor / release:major)
```

That typechecks and builds the package, bumps `package.json`, commits, tags
`vX.Y.Z` and pushes. The tag starts `.github/workflows/release.yml`, which
builds again, runs `npm pack` and creates the GitHub Release with
`sityle-X.Y.Z.tgz` attached. Projects then switch to the new URL.

The working tree must be clean before releasing.

## Layout

```
src/si/            The package.
  tokens.css         Colours (light 宣纸 / dark 浓墨), type, radius, elevation, motion.
  base.css           Page ground, focus ring, reduced motion.
  components.css     Component styles (.si-*).
  core.tsx           SiProvider, useTheme, spring presets, ink ripple, BrushStroke, cn.
  components/        Button, IconButton, CopyButton, TextField, TextAreaField,
                     Input / TextArea / Select (label outside), PasswordField, StrengthMeter, Switch, Checkbox, RadioGroup,
                     Segmented, Tabs, Chip, Tag, Avatar(Stack), Seal, Card,
                     ListItem, Tooltip, Menu, Dialog, Slider, InkDrop, InkBars,
                     BrushSpinner, Skeleton, InkWash.
  index.ts           Public exports.
src/showcase/      The style page (not part of the package).
src/worker/        The Worker (assets only; 404 for anything else).
vite.config.ts     Style page + Worker build (@cloudflare/vite-plugin).
vite.lib.config.ts Package build; react / motion / lucide-react stay external.
```

## Rules

- **Colour:** only `--si-*` tokens. 石绿 is the one primary; 石青 / 泥金 are
  accents; 朱砂 only for danger and seals.
- **Type:** brush (Ma Shan Zheng) only for the brand and rare display titles;
  serif for headings; sans for UI and body; mono for secrets and codes.
- **Buttons:** one `solid` per area; `flat` / `bordered` / `light` for the rest.
- **Motion:** entering ease-out; shape changes spring (`spring.bouncy`);
  leaving ease-in, short. Everything respects "reduce motion".
- **Icons:** Lucide, stroke 1.75; icon-only buttons always have a tooltip.
- **Dialogs** only for decisions; feedback where the action was, no toasts.

## License

MIT — see `LICENSE`. Exception: the portrait of the character 祀 (fan art) —
`src/showcase/sigil.webp` and the browser icons `public/favicon.png`,
`public/apple-touch-icon.png` — is used for this site only; it is not covered
by the MIT license and is not part of the package.
