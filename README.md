# sityle · 丹青

An ink-wash (水墨丹青) design language: rice-paper ground, ink text, the
mineral pigments 石绿 / 石青 / 泥金 / 朱砂, and Material-style motion
(ink-drop ripples, springy switches and tabs, dialogs set down like paper).

**Documentation:** [style.si16.app/docs](https://style.si16.app/docs) (install, SiProvider,
tokens, typography, conventions, every component). **Live components:**
[style.si16.app](https://style.si16.app).

This repo is two things:

- **The package** `sityle` — tokens, styles and React components (`src/si/`).
- **The style page and docs** — a live tour of every component and the documentation (`src/showcase/`),
  deployed as the Cloudflare Worker `sityle` (static assets in `dist/client`).

## Use it in a project

Install a release — each [GitHub Release](https://github.com/CastoricSi/sityle/releases)
has the exact command in its notes:

```sh
npm i https://github.com/CastoricSi/sityle/releases/download/vX.Y.Z/sityle-X.Y.Z.tgz
npm i react react-dom motion   # peer dependencies, if not there yet
```

```tsx
import { SiProvider, Button, TextField } from "sityle";
import "sityle/style.css";
import "sityle/base.css"; // optional: only when the whole page is a sityle page

<SiProvider>
	<Button>保存</Button>
</SiProvider>;
```

Peer dependencies: React 19 and Motion (12–14). Icons inside the components are
inlined; the app is free to use any icon set (the style page uses Lucide).

### Stylesheets

| Import                   | What it is                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sityle/style.css`       | Tokens and every component. Touches nothing but `si-*` elements: their box-sizing, focus ring and reduced motion are scoped with `:where()` (zero specificity — your rules win).                              |
| `sityle/base.css`        | Optional page ground: reset, rice-paper `body`, the paper-fibre overlay, focus ring and reduced motion for the whole page. Leave it out when sityle lives inside another app or design.                       |
| `sityle/style.layer.css` | `style.css` inside `@layer sityle`, for apps that order their CSS with cascade layers.                                                                                                                        |
| `sityle/css/<file>.css`  | One file per component module, for apps that use only a few: `tokens.css` + `core.css` + e.g. `button.css`, `field.css`, `dialog.css` (Dialog also uses `display.css` for its seal; fields use `button.css`). |

Load the fonts (Ma Shan Zheng, Noto Serif SC, Noto Sans SC, JetBrains Mono —
see `index.html`), or the fallbacks are used. Text sizes are in `rem`.

### Theme

- `useTheme()` → `{ choice, resolved, setChoice }` (`"light" | "dark" | "system"`);
  `<html data-theme>` is set for you. Uncontrolled, the choice is remembered in
  `localStorage`; an app that keeps its own setting passes `<SiProvider theme onThemeChange>`.
- No flash of the wrong theme: put `themeScript` in `<head>` so a remembered
  theme applies before the first paint.

  ```tsx
  import { themeScript } from "sityle";
  <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
  ```

- **Motion** is always on by default, even when the system asks to reduce it
  (Windows "animation effects" off, macOS "reduce motion"), which would otherwise
  quietly turn the ink, springs and slides off. `<SiProvider motion="reduce">`
  keeps fades only; `motion="system"` follows the system setting. The choice is
  on `<html data-si-motion>`, which the CSS (and `base.css`) read too.
- Colours are CSS variables `--si-*`, each written once as `light-dark(light, dark)`.
  Fields draw a `--si-ring` focus halo outside their box: a scroll container
  (`overflow` not visible) right at a field's edge clips it, so leave that much
  padding there. While a dialog is open the page's scrollbar is hidden and the page
  padded by exactly its width; `--si-scrollbar` on `<html>` holds that width for an
  app's own `position: fixed` bars. Scrollbars inside components (and, with
  `base.css`, the page's) are a slim stroke: `--si-scroll-thumb`. `--si-overscan` is how far a dialog's backdrop reaches past the
  viewport: Safari on iPhone shows the page under its status bar and toolbar but
  clips `position: fixed` layers to the viewport, so the backdrop (and a sheet's
  paper) are absolute layers in the page instead, which Safari does paint there. There are also tokens for radii (`--si-r-*`), control heights (`--si-h-*`),
  spacing (`--si-space-*`) and stacking (`--si-z-*`).

### Server rendering (Next.js, Remix…)

Everything renders on the server. The build starts with `"use client"`, so the
Next.js app router can import components directly. Dialogs, tooltips, menus and
select lists portal to `<body>` only after hydration.

### Texts (i18n)

The few texts sityle writes itself (copy, show / hide, clear, cancel, loading,
password strength) are Chinese by default. Switch them app-wide:

```tsx
import { en, SiProvider } from "sityle";

<SiProvider messages={en}>…</SiProvider>; // or { ...en, cancel: "Never mind" }
```

Per-component label props (`CopyButton label`, `PasswordField labels`, …) still win.

### Conventions

- **Props pass through.** Every component takes `className`, `style`, `ref` and the
  native props of its element (`data-*`, `aria-*`, handlers…). Form controls
  (Switch, Checkbox, Radio, Slider, TextField, SearchField, RadioCard) put native
  props and `ref` on their `<input>` and `className` / `style` on the wrapper.
- **Controlled or not.** Form controls take `value` + `onChange` (or `checked`),
  or `defaultValue` (`defaultChecked`) and a `name`, and then just work inside a
  plain `<form>` — SelectField submits through a hidden input.
- **Links.** `Button`, `NavItem` and `ListItem` with `href` render a real `<a>`;
  `as` renders your router's link instead (Next.js `Link` takes `href` as is; for
  `to`-style links pass a small wrapper). A `ListItem` with neither `onClick` nor
  `href` is a plain row. `ButtonProps` is the button form (extend or `Omit<>` it in
  a wrapper); `ButtonLinkProps` the link form.
- **Popovers.** Menus and select lists float on `<body>`, so a dialog or card never
  clips them; place a menu with `align`, `matchWidth` and `className`, not with
  descendant selectors. Their height is capped by `--si-room` (room left on screen).
- **Names.** Colour is `tone` (`jade | azure | gold | danger`, Note also `neutral`).
  Secondary text of an item is `description`; `hint` is the helper text under a
  form field. Toggles take `label` + `description`.
- **Keyboard.** Tabs and Segmented have one Tab stop and move with arrow keys /
  Home / End (`<Tabs id>` + `<TabPanel tabs value>` link tabs to panels). Menu:
  ↑ ↓ Home End, typeahead, Escape, Tab. Dialog keeps Tab inside, locks page
  scroll and returns focus when it closes.

### Browser support

Current evergreen browsers: the tokens use `light-dark()` (Chrome 123, Safari
17.5, Firefox 120), and `:has()` and `color-mix()`.

An unreleased branch installs straight from git (the `prepare` script builds
`dist/lib` on install): `npm i github:CastoricSi/sityle#<branch>`.

### Linking a local copy

While working on sityle and a project together, link the local copy instead of
the release (don't commit this): `npm i ../sityle` in the project, and run
`npm run build:lib` here after changes. With a local link, add
`resolve: { dedupe: ["react", "react-dom", "motion"] }` to the project's Vite
config, or two copies of React load ("Invalid hook call").

## Obsidian theme

`obsidian/` is sityle as an [Obsidian](https://obsidian.md) theme (not in the npm
package): rice paper, ink, 石绿 accent, 石青 links, 泥金 highlights, 朱砂 errors,
serif headings, the paper fibre, follows Obsidian's light / dark setting.

Copy `obsidian/manifest.json` and `obsidian/theme.css` into
`<vault>/.obsidian/themes/Sityle/`, then pick **Sityle** in Settings → Appearance →
Themes. The fonts load from Google Fonts (offline, the system fallbacks are used).

`theme.css` is generated: edit `obsidian/sityle.css` (Obsidian's variables mapped
onto `--si-*`) or `src/si/tokens.css`, then `npm run build:obsidian`. A test fails
when it is out of date.

## Develop

```sh
npm install
npm run dev          # style page
npm test             # unit, SSR, hydration and axe tests (Vitest + jsdom)
npm run lint         # ESLint + Prettier check (npm run format to fix)
npm run typecheck
npm run build        # typecheck + style page + Worker (what Cloudflare runs)
npm run build:lib    # the package → dist/lib (index.js, style*.css, base.css, css/, types/)
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and both builds on
every push and pull request.

## Release

```sh
npm run release:patch   # 0.9.0 → 0.9.1   (or release:minor / release:major)
```

That typechecks, lints, tests and builds the package, bumps `package.json`,
commits, tags `vX.Y.Z` and pushes. The tag starts `.github/workflows/release.yml`,
which checks again, runs `npm pack` and creates the GitHub Release with
`sityle-X.Y.Z.tgz` attached. Projects then switch to the new URL. Note the
changes in `CHANGELOG.md` first.

The working tree must be clean before releasing.

## Layout

```
src/si/            The package.
  tokens.css         Colours (light 宣纸 / dark 浓墨 via light-dark()), type, radius, heights, spacing, z-index, motion.
  base.css           Optional page ground (reset, body, paper fibre, global focus ring / reduced motion).
  components.css     Imports styles/*.css (one file per component module).
  core.tsx           SiProvider, useTheme, themeScript, spring presets, ink ripple, BrushStroke.
  messages.ts        Built-in texts: zh (default), en, useMessages.
  components/        Button, IconButton, CopyButton, TextField, TextAreaField, SelectField,
                     Input / TextArea / Select (label outside), PasswordField, StrengthMeter, Switch,
                     Checkbox, RadioGroup, Radio, Segmented, Tabs, TabPanel, Chip, Tag, Avatar(Stack),
                     Seal, Card, ListItem, Tooltip, Menu, Dialog, ConfirmDialog, Slider, NavItem,
                     Group, GroupRow, Steps, RadioCard, Note, IconBadge, SearchField, Fab,
                     AutoHeight, InkDrop, InkBars, BrushSpinner, Skeleton, InkWash, Typography.
  internal/          Not exported: popover placement, modal focus / scroll lock, controllable state,
                     link-or-button, inline icons, SSR helpers.
  index.ts           Public exports.
src/showcase/      The style page and docs (not part of the package): design.tsx (pigments, type, shape,
                   motion, icons), components.tsx (a card per component), sample.tsx, docs.tsx (/docs),
                   catalogue.ts (what each component is for: read by the cards and the docs).
obsidian/          The Obsidian theme: sityle.css (hand-written), theme.css (built), manifest.json.
scripts/           finish-lib.mjs (after the package build), build-obsidian.mjs (obsidian/theme.css).
src/worker/        The Worker (assets only; 404 for anything else).
test/              Vitest tests.
vite.config.ts     Style page + Worker build (@cloudflare/vite-plugin).
vite.lib.config.ts Package build; react / motion stay external.
```

## Rules

- **Colour:** only `--si-*` tokens. 石绿 is the one primary; 石青 / 泥金 are
  accents; 朱砂 only for danger and seals. Text on a solid colour uses the
  `--si-*-fill` tokens (≥ 4.5:1).
- **Type:** brush (Ma Shan Zheng) only for the brand and rare display titles;
  serif for headings; sans for UI and body; mono for secrets and codes.
- **Buttons:** one `solid` per area; `flat` / `bordered` / `light` for the rest.
  Navigation is a link (`href`), an action is a button.
- **Motion:** entering ease-out; shape changes spring (`spring.bouncy`);
  leaving ease-in, short. `<SiProvider motion>` decides whether "reduce motion" applies.
- **Icons:** stroke icons (Lucide in the style page); icon-only buttons always have a tooltip.
- **Dialogs** only for decisions; feedback where the action was, no toasts.
  On phones (≤600px) a Dialog is a bottom sheet; pass `phone="full"` for
  long content (settings, forms) to fill the screen.

## License

MIT — see `LICENSE`. The few icons drawn inside the components are from
[Lucide](https://lucide.dev) (ISC). Exception: the portrait of the character 祀
(fan art) — `src/showcase/sigil.webp` and the browser icons `public/favicon.png`,
`public/apple-touch-icon.png` — is used for this site only; it is not covered
by the MIT license and is not part of the package.
