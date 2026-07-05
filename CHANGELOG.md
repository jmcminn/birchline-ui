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
