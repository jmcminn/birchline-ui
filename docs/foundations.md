# Foundations

Birchline UI is a warm, editorial reskin of shadcn/ui built on **Tailwind CSS v4**.
All design decisions live as tokens in
[`src/registry/birchline-tokens.css`](../src/registry/birchline-tokens.css) via
the `@theme` directive, so every utility (`bg-primary`, `text-muted-foreground`,
`border-border`, …) resolves to a CSS variable and the whole system can be
re-themed by swapping token values.

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

### Raw palette

| Token | Value | Notes |
|---|---|---|
| `--color-ivory` | `#FAF9F5` | page background |
| `--color-clay` / `--color-clay-hover` | `#D97757` / `#C7684C` | brand accent |
| `--color-ink` | `#141413` | primary text |
| `--color-oat` | `#E3DACC` | decorative warm neutral |
| `--color-white` | `#FFFFFF` | surfaces |
| `--color-gray-100 / 300 / 500 / 700` | `#F0EEE6` / `#D1CFC5` / `#726F66` / `#3D3D3A` | neutral ramp |
| `--color-green / bronze / red / blue` | `#5F7348` / `#916426` / `#B04A4A` / `#526E92` | status hues |
| `--color-plum / teal` | `#7B6B8A` / `#5B8E8A` | extended accents |
| `--color-light-yellow` | `#F5E6B8` | highlight |

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

The system ships two schemes, toggled by a `data-theme` attribute on `<html>`:

- **Muted** (default) — no attribute; the base `@theme` values.
- **Bright** — `data-theme="bright"` overrides the **raw palette** only; semantic
  tokens reference the palette via `var()`, so they re-theme automatically.

To add a scheme (e.g. dark), add a `:root[data-theme="dark"]` block that remaps
the **semantic roles** (background, foreground, card, muted-foreground, …).
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
