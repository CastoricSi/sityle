# Changelog

## Unreleased (0.9.0)

A review pass: bugs, accessibility, server rendering, and the API a library
needs. Several renames — see **Migrating** below.

### Fixed

- **Dialog:** typing in a field inside a dialog no longer throws focus out to the
  trigger and the first button (an inline `onClose` re-ran the focus effect on every
  parent render).
- **Dialog:** Tab stays inside the dialog; focus that lands behind it is pulled back;
  the page behind no longer scrolls; focus returns to the trigger only when nothing
  else took it.
- **Button:** a `loading` button ignores presses (it submitted twice).
- **PasswordField:** `autoComplete` is the caller's (default `current-password`), not a
  forced `off` that hid the field from password managers.
- **SelectField / Menu:** their lists float on `<body>`, so a dialog or card no longer
  clips them; Escape closes the list, not the dialog around it.
- **Server rendering:** no more crash (`getServerSnapshot`, portals after mount), no
  hydration mismatch for a remembered theme, `"use client"` banner for RSC frameworks.
- Solid azure / gold / danger buttons have a hover colour.
- Current links (`aria-current="page"`) are highlighted like current buttons.
- Slider survives `min === max`.

### Added

- `className`, `style`, `ref` and native props on every component; prop types exported.
- Uncontrolled form controls (`defaultValue` / `defaultChecked`, optional `onChange`),
  `name` on SelectField and RadioGroup (forms submit them), `disabled` on RadioGroup,
  Slider, Tabs / Segmented options and Menu items.
- `href` (and `as` for router links) on Button, NavItem, ListItem.
- `TabPanel`; Tabs / Segmented with roving focus and arrow keys; Menu Home / End,
  typeahead and Tab; Tooltip `aria-describedby`; Avatar and Seal names; Steps as a
  progress bar.
- `SiProvider messages` with `zh` / `en`, `useMessages`.
- `themeScript` for `<head>` (no theme flash).
- `sityle/base.css` (optional page ground), `sityle/style.layer.css`, `sityle/css/*.css`
  (per component).
- Tokens: `--si-*-fill`, `--si-*-hover`, `--si-on-seal`, `--si-h-*`, `--si-space-*`,
  `--si-z-*`.
- Tests (Vitest: behaviour, SSR, hydration, axe), ESLint + Prettier, CI on every push / PR.

### Changed

- `style.css` no longer resets the page or adds the paper-fibre overlay: import
  `sityle/base.css` for that.
- Colour tokens are written once with `light-dark()`; `--si-ink-3` is darker
  (4.5:1 on every paper); solid azure / gold fills are a shade darker for contrast.
- InkWash resolves any CSS colour and repaints when its own box resizes.
- `passwordStrength` discounts repeats, runs and well-known passwords.
- Icons inside the components are inlined: `lucide-react` is no longer a peer
  dependency. Peer ranges have upper bounds.
- The shared SVG filter is added once per page (no duplicate ids); ink and
  BrushStroke work without a provider.
- `cn` is no longer exported.

### Migrating

| Before                                               | After                                                  |
| ---------------------------------------------------- | ------------------------------------------------------ |
| `color="azure"` on Button, Tag, Avatar               | `tone="azure"`                                         |
| type `Color`                                         | type `Tone`                                            |
| `<Note tone="warn">` / `tone="accent"`               | `tone="gold"` / `tone="jade"`                          |
| `<Card note>`                                        | `<Card description>`                                   |
| `<ListItem subtitle>`                                | `<ListItem description>`                               |
| `<GroupRow hint>`                                    | `<GroupRow description>`                               |
| `<Checkbox>标点</Checkbox>`                          | `<Checkbox label="标点" />`                            |
| `<Radio value="a">慢</Radio>`                        | `<Radio value="a" label="慢" />`                       |
| `<ConfirmDialog>` without `open`                     | pass `open`                                            |
| CSS `.si-btn.is-azure`, `.c-jade`, `.si-note.t-warn` | `.si-btn.t-azure`, `.si-tag.t-jade`, `.si-note.t-gold` |
| page reset / paper fibre from `style.css`            | also `import "sityle/base.css"`                        |
| `import { cn } from "sityle"`                        | your own `clsx` / join                                 |
| `lucide-react` installed for sityle                  | not needed (keep it if your app uses it)               |

## 0.8.3 and earlier

See the [GitHub Releases](https://github.com/CastoricSi/sityle/releases).
