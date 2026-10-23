# Changelog

## 1.0.0

The first stable release: the API is settled, and from here on a breaking change
means a new major version. New: Typography and documentation; slim scrollbars; a
review round of fixes.

**Upgrading from 0.9:** `style` on TextField / TextAreaField now styles the field
(as `className` already did); to style the `<input>` itself, use a class on the field
and `.your-class input`. Nothing else changes.

- **TextField / TextAreaField:** `className` and `style` go to the field around the control,
  as on every other form control (`style` used to land on the `<input>` / `<textarea>`).
- Fields: your own `aria-describedby` joins the hint / error instead of replacing it
  (TextField, TextAreaField, SelectField).
- StrengthMeter gives no verdict before anything is typed.
- Menus stay on screen: one that opens from a trigger near the screen's edge opens
  inward. Tooltips follow a resized window.
- NavItem labels, ListItem lines and `Typography lines={1}` no longer cut off descenders
  (g, q, y): the ellipsis' clip box reaches past the line without making the row taller.
- **Typography:** text on the type scale — `display`, `h1`–`h4`, `body`, `body-sm`, `label`,
  `caption`, `code`, `quote`; `as` changes the element, `tone` the colour (`muted`, `faint`
  or a pigment), `lines` cuts it short with an ellipsis. Each step is also a token
  (`font: var(--si-type-h2)`) for your own CSS.
- **Documentation** at `/docs` on the style page: install, SiProvider, stylesheets and
  tokens, typography, conventions, a reference of every component, motion, SSR.
- **Style page reorganised:** components grouped by what they are for, one card per
  component saying what it does, a live demo and the code to write it; the index at the
  top jumps to each card. The design sections (pigments, type, shape, motion, icons) come
  first; the type scale is shown with Typography.
- Style page header: just the seal, the title and the language / theme switches. In the
  docs, ☰ before the seal folds the contents sidebar (a drawer on narrow screens, where
  the title gives way to the seal); the section being read is highlighted.
  On iPhone the drawer and its shade reach under Safari's toolbar (absolute layers in
  the page while it is open, as the dialog backdrop does).
- **Slim scrollbars:** inside sityle components (text areas, select lists, menus,
  dialogs) a scrollbar is one thin rounded stroke with no arrows and no track, a
  little darker on hover (`--si-scroll-thumb`, `--si-scroll-thumb-hover`); a text
  area's resize grip is two short strokes. `base.css` gives the page's own
  scrollbars the same look.
- **Not selectable:** controls you press or drag (Button, IconButton, Fab, Chip, NavItem,
  pressable ListItem, options, menu items, Segmented, Tabs, Switch, Checkbox, Radio,
  RadioCard, the select trigger, Slider, Steps) and marks (Seal, Avatar, badges), as in
  most UI kits: a double-click or a drag across them no longer selects their text.
  Content stays selectable (tags, card text, notes, field labels, tooltips, dialogs).

## 0.9.3

- **Motion is on by default.** The system's "reduce motion" (Windows' animation
  effects switched off, macOS' reduce motion) used to turn off the ink, springs and
  slides without a word, so one computer looked smooth and another stripped.
  `<SiProvider motion>`: `"on"` (default), `"reduce"` (fades only) or `"system"`.
  `motionReduced()` tells your own code. The style page has the switch under 动效.
- Dialog: the page behind no longer moves when its scrollbar is hidden: the padding
  that stands in for it is measured exactly (fractional scrollbars on zoomed pages
  were rounded), and the dialog stays centred on the page instead of sliding 7.5px
  sideways as it opens and closes (its fixed layer leaves the scrollbar's room too).
  `--si-scrollbar` holds the width for an app's own fixed bars.

- Dialog backdrop on iPhone: Safari clips `position: fixed` layers to the viewport, so
  the 0.9.2 overscan never showed under its status bar and toolbar. The tint, and the
  sheet's / full-screen dialog's paper past the screen edges, are now absolute layers
  in the page at the dialog's place (the page doesn't scroll while it is open).
- Style page: on phones the hero (portrait, title, subtitle) is centred.

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
