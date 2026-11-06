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
