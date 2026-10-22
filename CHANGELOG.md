# Changelog

## Unreleased

- Dialog backdrop: dims only, no blur (re-blurring the whole screen on every frame was the
  heaviest part of opening a dialog, about a quarter of its frame time).

- **Performance:** every Button carried its loading spinner with its animation running
  (hidden, but restyled and laid out on every frame) — dozens of idle loops behind any
  page with buttons. The spinner now only animates while loading. Loaders loop on
  transform / opacity only (the compositor runs those): InkDrop no longer animates its
  border width, Skeleton's sheen slides instead of moving the background, BrushSpinner
  is a fixed stroke going round. In a throttled phone profile, a page at rest went from
  ~59 ms to ~17–30 ms a frame and opening a dialog from ~92 ms to ~40 ms a frame.

- Menus and select lists open smoothly: a short ease-out (no spring overshoot), rising
  from the trigger when they open above it; menu items fade in place. `popover()` preset.
- TextAreaField: the box is the field and the text scrolls below the label, so lines no
  longer slide under the label; a press anywhere in the box puts the caret in the text.
- Style page: 中 / EN switches all of its sample text.

## 0.9.2

From trying it on an iPhone again.

- **Rows press like buttons, without ink.** ListItem, NavItem, RadioCard, SelectField
  options and Menu items give a little (scale 0.985) and darken while held; Tabs and
  Segmented options give a little too. Ink across a whole row read as a smear. Buttons,
  icon buttons, chips and the Fab keep their ink.
- **Safari's edges:** on iPhone the page shows under the status bar and the floating
  toolbar, outside what `position: fixed` fills. The dialog backdrop, the bottom sheet's
  paper and the full-screen dialog's paper now reach `--si-overscan` (160px) past the top
  and bottom, so nothing shows through there; their content stays where it was.
- Style page: the top bar fits a phone again (it ran 50px wider than the screen).

## 0.9.1

Touch screens, from trying password-manager on an iPhone.

- **Fields no longer zoom the page on iOS.** Safari zooms into any field under 16px and
  doesn't zoom back out; on touch screens (`pointer: coarse`) fields are at least 16px.
- **Ink on touch:** a finger rests ~70 ms before the drop appears, so starting to scroll
  a list leaves no mark; a quick tap still gets its drop, and a released drop finishes
  blooming faster.
- **Press feedback where desktops have hover:** NavItem, SelectField options, Tabs,
  Segmented and RadioCard drop ink too; nav rows and list rows darken while pressed on
  touch; RadioCard gives a little. `:active` works on iOS (a passive touchstart listener).
  No grey tap flash and no double-tap-zoom wait on anything pressable.
- `--si-ring` token: the width of the focus halo around fields. A scroll container
  clips it unless it leaves that much room at its edges.

## 0.9.0

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
- `href` (and `as` for router links) on Button, NavItem, ListItem. `ButtonProps` /
  `NavItemProps` / `ListItemProps` stay the button form (wrappers can `Omit<>` them); the
  link form is `ButtonLinkProps` / `NavItemLinkProps` / `ListItemLinkProps`.
- Menu `matchWidth` (panel as wide as the trigger); popovers expose the room left on
  screen as `--si-room`, so an app class can cap their height without `!important`.
- `prepare` script: an unreleased branch installs from git.
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
  `sityle/base.css` for that. Its rules have zero specificity (`:where`), so it can be
  imported before or after `style.css`.
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

| Before                                               | After                                                             |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `color="azure"` on Button, Tag, Avatar               | `tone="azure"`                                                    |
| type `Color`                                         | type `Tone`                                                       |
| `<Note tone="warn">` / `tone="accent"`               | `tone="gold"` / `tone="jade"`                                     |
| `<Card note>`                                        | `<Card description>`                                              |
| `<ListItem subtitle>`                                | `<ListItem description>`                                          |
| `<GroupRow hint>`                                    | `<GroupRow description>`                                          |
| `<Checkbox>标点</Checkbox>`                          | `<Checkbox label="标点" />`                                       |
| `<Radio value="a">慢</Radio>`                        | `<Radio value="a" label="慢" />`                                  |
| `<ConfirmDialog>` without `open`                     | pass `open`                                                       |
| CSS `.si-btn.is-azure`, `.c-jade`, `.si-note.t-warn` | `.si-btn.t-azure`, `.si-tag.t-jade`, `.si-note.t-gold`            |
| page reset / paper fibre from `style.css`            | also `import "sityle/base.css"`                                   |
| `import { cn } from "sityle"`                        | your own `clsx` / join                                            |
| `lucide-react` installed for sityle                  | not needed (keep it if your app uses it)                          |
| `.app .si-menu { … }` to place a menu                | Menu `align` / `matchWidth` / `className` (it floats on `<body>`) |

## 0.8.3 and earlier

See the [GitHub Releases](https://github.com/CastoricSi/sityle/releases).
