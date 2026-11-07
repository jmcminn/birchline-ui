# Changelog

All notable changes to Birchline UI are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning policy

**Design tokens are a public API.** Consumers write `bg-card`,
`text-muted-foreground`, `--color-warm-800`, etc. into production code, so
changes are versioned by their blast radius:

- **MAJOR** — remove or rename a **semantic** token, or change what a semantic
  role _means_. The expensive, migration-inducing changes.
- **MINOR** — add a token, palette, mode, or component; retune a value without
  breaking the contract.
- **PATCH** — contrast/bug fixes, docs, internal refactors that leave every
  resolved value unchanged.

Primitive tokens (`--color-warm-*`, `-500` / `-400` hues) are considered part of
the contract too, but the **semantic** tier is what components should consume.

## [Unreleased]

### Removed

- **The Muted theme and the Bright / Muted toggle.** The `:root[data-theme="bright"]`
  selector, the `bright` token mode (in `tokens/birchline.tokens.json`) and the
  `birchline-palette` preference are gone. If you set `data-theme="bright"`, just
  delete the attribute — Bright is now the only palette. (The `muted` /
  `muted-foreground` color roles are unrelated and unchanged.)

### Changed

- **Textarea showcase Type Size menu opens on Small (14px)** (was Body).
- **Token inspector toggle**: the on state is now a clay tint (15% `--primary` fill, 2px
  `--primary` border, `--primary` icon) instead of a gray fill, so it stands out from hover.
- **Token inspector panel**: the "uses" text in the Colors section is now left-aligned in one
  shared column (was right-aligned per row), and the panel is 540px wide (was 400px). The gap between the token and uses columns is 24px.
  Body text is 13px (was 11.5px) and the COLORS / TEXT headings are 14px Inter semi-bold in
  `--primary` (were 10px mono regular, muted). The panel title is 14px (was 13px). Color swatches are 24px (were 10px) and only the swatches that show --white or --ivory
  (including tokens that resolve to them, such as --background, --card, --primary-foreground)
  keep a 1px stroke. The panel opens on whichever side of its target has more room and caps
  its height to stay inside the window, scrolling only if it has to. Vertical spacing is doubled: 8px between color rows (was 4px), 20px between
  states (was 10px), and 8px between Text rows (was 4px).
- **Input showcase fields are 200px wide** (were 260px); heights and padding follow the Input
  Size menu as before.
- **Toggle and ToggleGroup showcase icon buttons are 32x32px** (were about 40x36); icons stay
  16px. The "With text" toggle and the Toggle component's own sizes are unchanged.
- **Tooltip showcase triggers are 32x32px** (were 38x38); icons stay 16px.
- **DropdownMenu showcase triggers are 32x32px** (were 38x38); the three-dot icon stays
  16px. The `icon` Button size itself is unchanged.
- **Badge Type Size (showcase, Badge and Badge: Removable) now uses whole-number
  heights**: Body 28px, Small 24px, Fine 22px, Caption 20px (were 28.8 / 25 / 22.85 /
  20.8). Body and Small horizontal padding is now 12px (was 10px); Fine and Caption
  stay at 10px. Removable badges keep 4px right padding, and the × button is a
  whole-pixel size (18 / 16 / 16 / 14px). The Badge component's own defaults are
  unchanged.
- **Select Size: Small now has 12px side padding** (was 8px) in the showcase; Large and
  Medium are unchanged.
- **Button sizes are now Large / Medium / Small (`lg` / `md` / `sm`)**: lg 38px tall /
  16px side padding / 14px text (the former default, +2px tall), md 32px / 12px /
  13px (the former `sm`, text +1px), sm 28px / 10px / 12px (new). `size="default"`
  remains as an alias of `lg`; `icon` is 38x38. The former 40px `lg` (24px padding)
  is replaced by the new `lg`. The showcase gets a Button Size control.
- **Border-color utilities now take effect in the showcase.** The default
  `* { border-color }` reset moved into `@layer base`, so classes like
  `focus-visible:border-ring`, `border-transparent` and `data-[state=checked]:border-ring`
  work (clay focus border, checked checkbox, borderless switch, white avatar-group
  separators). Table and settings-row dividers keep the stronger `border-border` gray.
  Alert variants no longer need the `!` modifier. Registry consumers are unaffected.
- **Accent primitives now equal the former Bright values**: `clay` `#D05E38`,
  `green-500` `#658E3B`, `bronze-500` `#C2822A`, `red-500` `#C9413F`,
  `blue-500` `#608AD5`, `plum` `#9B67B6`, `teal` `#5DB2AC`. Consumers who relied on
  the old Muted values will see an accent color shift. `clay-hover` is recomputed
  to `#B75331` and `red-hover` to `#B13937` to match.

### Added

- **Token inspector covers the in-page components, not just Button.** Every exported
  component and part now carries a `data-slot` attribute (shadcn/ui v4 naming, e.g.
  `card-header`, `table-row`, `select-trigger`) plus `data-variant` / `data-size` where it
  has variants: Badge, Input, Textarea, Checkbox, Switch, Toggle, ToggleGroup, Tabs, Avatar,
  Alert, Card, Progress, Separator, Skeleton, Label, Breadcrumb, Table, Select trigger,
  NavigationMenu trigger, UserSelector and the LineChart root. These attributes ship to
  registry consumers; visual output is unchanged.
- **Token inspector reaches overlay components.** The parts of Select, DropdownMenu,
  Popover, Tooltip, Dialog, AlertDialog, Sheet, Command and NavigationMenu now carry
  `data-slot` (e.g. `select-content`, `dropdown-menu-item`, `dialog-title`,
  `command-item`, `navigation-menu-link`), so they can be inspected like any other
  component. While inspecting, **Alt-click (Option-click) passes through** to open a menu,
  select, popover, dialog or sheet, then its contents inspect with a normal click. Esc now
  unpins first, then closes an open overlay, then exits inspect mode, and the inspector
  panel sits above overlays and stays interactive inside a modal dialog without dismissing
  it. These attributes ship to registry consumers; visual output is unchanged.
- Inspector engine: nested components are listed under **Contains** instead of being mixed
  into the report; a pinned part names its parent ("in Card") with an ↑ button to inspect
  it; inline-style and SVG `fill` / `stroke` colors are read, with non-token values shown as
  "not a token"; new **Invalid** state (`aria-invalid:`), menu highlight
  (`data-[highlighted]`) as Hover, `placeholder:` colors, `peer-disabled:`, `data-[active=true]`
  and explicit off states; repeated uses collapse to `×n`.
- **`line-chart`** — an area-filled line chart ported from the Range Analytics
  events chart, built on Recharts 3. Cumulative / daily modes, an optional
  per-series breakdown ("By Platform"), week-based zoom with a range toast,
  evenly anchored gridlines and a dark hover card with per-series values and
  day-over-day change. Ships with `line-chart-data` (the pure data helpers) and
  `line-chart-sample-data` (seeded, synthetic demo data). Adds four semantic
  **`chart-1` … `chart-5`** series tokens (light and dark). Recharts also exports
  a `LineChart`, so alias one of the two if you import both.
- **Public distribution** — the shadcn registry is now published to GitHub Pages
  (auto-rebuilt on every push to `main`) and installable at
  `https://jmcminn.github.io/birchline-ui/r/{name}.json`. Verified end-to-end:
  every item's npm + registry dependency chain resolves and serves real content.

## [0.1.0] — 2026-07-04

First tagged release — the design-system foundation.

### Added

- **Three-tier token architecture** — primitives → aliases → semantic. A named
  warm-neutral ramp (`--color-warm-50 … 975`) is now the single source of truth
  for every neutral surface; brand/status hues carry paired light (`-500`) /
  dark (`-400`) values.
- **Token build pipeline** — `tokens/birchline.tokens.mjs` is the single source;
  `npm run tokens:build` generates the Tailwind `@theme` CSS and a portable
  **W3C DTCG** document (`tokens/birchline.tokens.json`) for Figma / native.
- **Dark mode** as an independent axis (`data-mode="dark"`), composing with the
  palette axis (`data-theme`) for all four Muted/Bright × light/dark combos.
- Skeleton **shimmer** animation with a dedicated `--color-skeleton` token.
- Color-picker menus: selected-colour name + checkmark, theme-reactive swatches,
  and a live "(default)" row for dark-mode surface defaults.

### Changed

- Default palette is now **Bright**.
- Table column resize is **neighbor-pair** (only adjacent columns trade width).

### Fixed

- Dark-mode contrast raised on loading/placeholder surfaces that previously sat
  _below_ their card: skeleton, progress track, default badge, sidebar selected
  item, alert fills, and menu separators / calendar "today".
- Removed the last raw hex in a shipped component (`progress.tsx`), now routed
  through `--color-warm-700`.

_Baseline release; the architecture above is verified value-for-value identical
to the prior hand-authored tokens._

[Unreleased]: https://github.com/jmcminn/birchline-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jmcminn/birchline-ui/releases/tag/v0.1.0
