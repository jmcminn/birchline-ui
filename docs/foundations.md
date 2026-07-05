# Foundations

Birchline UI is a warm, editorial reskin of shadcn/ui built on **Tailwind CSS v4**.
Every utility (`bg-primary`, `text-muted-foreground`, `border-border`, …)
resolves to a CSS variable, so the whole system re-themes by swapping token
values.

## Token architecture

Tokens are organized in three tiers — **a hex value lives in exactly one place
(a primitive); everything above references it by name.**

1. **Primitives** — raw named values. The warm-neutral ramp (`--color-warm-50 …
   975`) and the brand/status hues (`clay`, `green-500` / `green-400`, …). The
   only place hexes live.
2. **Aliases** — legacy names (`ivory`, `gray-300`, `green`, …) kept working,
   sourced from the ramp/hues.
3. **Semantic** — purpose-based roles (`background`, `border`, `primary`,
   `muted-foreground`, …). **This is what components consume.** Dark mode remaps
   these to different primitives, never to new hexes.

### Editing tokens

The source of truth is **[`tokens/birchline.tokens.mjs`](../tokens/birchline.tokens.mjs)**.
Edit it there, then run:

```bash
npm run tokens:build
```

This generates two artifacts (never hand-edit them):

- [`src/registry/birchline-tokens.css`](../src/registry/birchline-tokens.css) —
  the Tailwind v4 `@theme` file the app and shadcn registry consume.
- [`tokens/birchline.tokens.json`](../tokens/birchline.tokens.json) — a portable
  **W3C DTCG** document for Figma, native, and other-platform tooling.

`build` and `registry:build` regenerate automatically. Opacity modifiers
(`bg-primary/15`) derive from a token and are correct as-is — you don't tokenize
every alpha step.

## How to use tokens

**Always reach for a semantic role over a raw palette color.** Semantic tokens
carry intent and re-theme correctly:

```tsx
// ✅ semantic — communicates intent, themes correctly
<div className="bg-card text-foreground border border-border" />
// ❌ raw palette — bypasses the role layer
<div className="bg-white text-ink border border-gray-300" />
```

Raw palette colors are reserved for genuinely decorative, one-off cases (e.g. a
role-specific avatar color).

## Color

### Primitives — the warm-neutral ramp

One continuous ramp is the single source of truth for every neutral surface,
lightest (`50`) → ink (`975`). Light surfaces draw from the top, dark surfaces
from the bottom; the tuned dark values are preserved as named steps.

| Step | Value | | Step | Value |
|---|---|---|---|---|
| `warm-50` | `#FAF9F5` | | `warm-700` | `#3E3A32` |
| `warm-100` | `#F0EEE6` | | `warm-720` | `#3D3D3A` |
| `warm-150` | `#ECE8DE` | | `warm-750` | `#37342C` |
| `warm-300` | `#D1CFC5` | | `warm-780` | `#34312B` |
| `warm-350` | `#C6C1B4` | | `warm-800` | `#302D27` |
| `warm-450` | `#9C978A` | | `warm-850` | `#262420` |
| `warm-500` | `#8B8578` | | `warm-900` | `#211F1B` |
| `warm-550` | `#726F66` | | `warm-950` | `#1B1A17` |
| `warm-650 / 680` | `#4A453E` / `#46433B` | | `warm-975` | `#141413` |

### Primitives — brand & status hues

Each carries a light (`-500`) and dark-tuned (`-400`) value.

| Token | Light `-500` | Dark `-400` |
|---|---|---|
| `clay` / `clay-hover` | `#D97757` / `#C7684C` | (carries through both modes) |
| `green` | `#5F7348` | `#8FB06B` |
| `bronze` | `#916426` | `#D69C4E` |
| `red` | `#B04A4A` | `#C9413F` |
| `blue` | `#526E92` | `#7FA3D0` |
| `plum` / `teal` | `#7B6B8A` / `#5B8E8A` | extended accents |
| `white` `#FFFFFF` · `oat` `#E3DACC` · `light-yellow` `#F5E6B8` | | |

Aliases (`ivory` → `warm-50`, `gray-300` → `warm-300`, `green` → `green-500`, …)
keep the older names working.

### Semantic roles

| Role | Resolves to | Use for |
|---|---|---|
| `background` / `foreground` | ivory / ink | page surface + default text |
| `card` / `card-foreground` | white / ink | cards, elevated surfaces, form fields |
| `popover` / `popover-foreground` | white / ink | menus, dialogs, tooltips (floating) |
| `primary` / `primary-hover` / `primary-foreground` | clay / clay-hover / white | primary actions, selected states |
| `secondary` / `secondary-foreground` | gray-100 / gray-700 | secondary surfaces + their text |
| `muted` / `muted-foreground` | gray-100 / gray-500 | subtle fills; captions, meta, placeholders |
| `accent` / `accent-foreground` | gray-100 / gray-700 | hover/active highlight in menus & lists |
| `border` / `input` / `ring` | gray-300 / gray-300 / clay | borders, field borders, focus ring |
| `success` / `warning` / `danger` / `info` / `highlight` | green / bronze / red / blue / light-yellow | status semantics |

### Contrast status

A WCAG audit drove a first pass. **Fixed** (now ≥ AA 4.5:1 on ivory *and* white):

- `muted-foreground` — 3.5 → **4.8** (darkened to `#726F66`)
- `success` / `warning` / `info` text — 3.7 / 2.9 / 4.3 → **~5.2** each

**Accepted brand exceptions** (below AA, intentionally kept):

- white on `primary` (clay) — ~3.1 (primary buttons)
- `primary` as link text on light — ~3.0

Clay is the brand's signature color; darkening it to meet AA would compromise the
identity, so these are documented exceptions rather than defects. Mitigation:
where a clay button or link carries critical meaning, pair it with a non-color
cue (icon or clear label) so meaning never rests on color alone. Borders
(`gray-300`) are intentionally low-contrast and exempt.

## Typography

Families: `--font-serif` (Georgia) for display/headings, `--font-sans`
(system-ui) for UI/body, `--font-mono` for code/labels.

| Style | Font | Size / Line / Weight |
|---|---|---|
| Display | serif | 48 / 1.1 / 500 |
| Heading 1 | serif | 32 / 1.2 / 500 |
| Heading 2 | serif | 24 / 1.3 / 500 |
| Heading 3 | serif | 20 / 1.3 / 400 |
| Body | sans | 16 / 1.55 / 430 |
| Small | sans | 14 / 1.5 / 430 |
| Fine | sans | 13 / 1.45 / 430 |
| Caption | sans | 12 / 1.4 / 500 |
| Code | mono | 12 / 1.4 / 400 |

## Spacing

`--spacing-sp-1 … sp-8` → `4, 8, 12, 16, 24, 32, 48, 64` px. Prefer these steps
for padding/gaps so rhythm stays consistent.

## Radius

`--radius-xs` `4px` · `--radius-sm` `8px` · `--radius-md` `12px` · `--radius-lg` `20px`.

## Shadows

`--shadow-sm` / `--shadow-md` / `--shadow-lg` — subtle, warm-tinted elevation.

## Theming

Two **independent axes** compose on `<html>` — palette (`data-theme`) × mode
(`data-mode`):

| Axis | Attribute | Values | Overrides |
|---|---|---|---|
| Palette | `data-theme` | *(absent)* = Muted · `bright` | accent-hue **primitives** |
| Mode | `data-mode` | *(absent)* = light · `dark` | **semantic** surface/neutral roles |

Because they're orthogonal, all four combinations work with no extra blocks:
Muted + light, Bright + light, Muted + dark, Bright + dark. The Bright block
overrides only the `-500` accent primitives (which flow through the aliases and
semantic status), and the Dark block remaps semantic roles + shifting neutral
aliases to the dark end of the ramp — so brand accents carry through and the two
axes never conflict.

Apply before first paint to avoid a flash — read the stored choice in a blocking
`<head>` script and set the attributes (see [`index.html`](../index.html)).

**Adding a palette or mode:** edit `modes` in
[`tokens/birchline.tokens.mjs`](../tokens/birchline.tokens.mjs) and rebuild.
Because components consume semantic tokens, no component changes are needed.

## Focus

One unified, keyboard-only focus treatment on all interactive controls:

```
focus-visible:outline-none
focus-visible:border-ring
focus-visible:ring-[3px]
focus-visible:ring-ring/40
```

Menu/list items use an `accent` background highlight instead of a ring (correct
convention for roving-focus lists).
