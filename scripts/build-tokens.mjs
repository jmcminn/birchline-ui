/**
 * Token build — generates from tokens/birchline.tokens.mjs:
 *   1. src/registry/birchline-tokens.css   (Tailwind v4 @theme, consumed by the app + registry)
 *   2. tokens/birchline.tokens.json        (W3C DTCG, portable to Figma / native / other tooling)
 *
 * Run: npm run tokens:build
 */
import { primitives, aliases, semantic, modes, scales } from "../tokens/birchline.tokens.mjs"
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const isHex = (v) => typeof v === "string" && v.startsWith("#")
const cssColor = (v) => (isHex(v) ? v : `var(--color-${v})`)

// ── 1 · Tailwind v4 @theme CSS ───────────────────────────────────────────────
const emitColors = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `  --color-${k}: ${cssColor(v)};`)
    .join("\n")
const emitScale = (prefix, obj) =>
  Object.entries(obj)
    .map(([k, v]) => `  --${prefix}-${k}: ${v};`)
    .join("\n")

const SHIMMER = `/* ── Skeleton shimmer ──
   A highlight band sweeps across the base fill. Both colours come from the
   --color-skeleton* tokens, so it adapts to palette + mode automatically. The
   band is an ::after overlay clipped to the element's rounded shape. */
.bl-skeleton {
  position: relative;
  overflow: hidden;
  background-color: var(--color-skeleton);
}
.bl-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  /* Fade to the base fill (not \`transparent\`) so the band edges never pick up a
     muddy transparent-black tint on dark surfaces. */
  background-image: linear-gradient(
    90deg,
    var(--color-skeleton),
    var(--color-skeleton-highlight),
    var(--color-skeleton)
  );
  animation: bl-skeleton-shimmer 1.6s ease-in-out infinite;
}
@keyframes bl-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bl-skeleton::after {
    animation: none;
  }
}`

const css = `/* AUTO-GENERATED — do not edit by hand.
   Source: tokens/birchline.tokens.mjs · Build: scripts/build-tokens.mjs (npm run tokens:build)

   Three tiers: primitives → aliases → semantic, with mode overrides. A hex value
   lives once (a primitive); everything above references it. Import after
   \`@import "tailwindcss";\`. */

@theme {
  /* ═══ TIER 1 · PRIMITIVES ═══ */
${emitColors(primitives)}

  /* Legacy aliases — existing names, sourced from the ramp/hues. */
${emitColors(aliases)}

  /* ═══ TIER 2 · SEMANTIC (light) ═══ */
${emitColors(semantic)}

  /* ── Typography ── */
${emitScale("font", scales.font)}

  /* ── Border Radius ── */
${emitScale("radius", scales.radius)}

  /* ── Shadows ── */
${emitScale("shadow", scales.shadow)}

  /* ── Spacing (aliases) ── */
${emitScale("spacing", scales.spacing)}
}

/* ── Alternative "Bright" scheme — overrides accent-hue primitives only. ── */
:root[data-theme="bright"] {
${emitColors(modes.bright)}
}

/* ── Dark mode — remaps semantic + shifting aliases to dark primitives. ── */
:root[data-mode="dark"] {
${emitColors(modes.dark)}
}

${SHIMMER}
`

// ── 2 · W3C DTCG JSON (flat; references by name) ─────────────────────────────
const dtcgColor = (v) => ({ $type: "color", $value: isHex(v) ? v : `{${v}}` })
const mapColors = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, dtcgColor(v)]))
const mapDim = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { $type: "dimension", $value: v }]))

const dtcg = {
  $description:
    "Birchline UI design tokens (W3C DTCG, flat). Generated from tokens/birchline.tokens.mjs — do not edit by hand. Mode overrides live under $extensions.",
  ...mapColors(primitives),
  ...mapColors(aliases),
  ...mapColors(semantic),
  radius: mapDim(scales.radius),
  spacing: mapDim(scales.spacing),
  font: Object.fromEntries(
    Object.entries(scales.font).map(([k, v]) => [k, { $type: "fontFamily", $value: v }]),
  ),
  $extensions: {
    "com.birchline.shadow": scales.shadow,
    "com.birchline.modes": {
      bright: mapColors(modes.bright),
      dark: mapColors(modes.dark),
    },
  },
}

// ── write ────────────────────────────────────────────────────────────────────
writeFileSync(resolve(root, "src/registry/birchline-tokens.css"), css)
writeFileSync(resolve(root, "tokens/birchline.tokens.json"), JSON.stringify(dtcg, null, 2) + "\n")

// ── self-check: every color value resolves (no dangling references) ──────────
const known = new Set([...Object.keys(primitives), ...Object.keys(aliases), ...Object.keys(semantic)])
const dangling = []
for (const [scope, obj] of [
  ["aliases", aliases],
  ["semantic", semantic],
  ["modes.dark", modes.dark],
]) {
  for (const [k, v] of Object.entries(obj)) {
    if (!isHex(v) && !known.has(v)) dangling.push(`${scope}.${k} → ${v}`)
  }
}
if (dangling.length) {
  console.error("✗ dangling references:\n  " + dangling.join("\n  "))
  process.exit(1)
}

console.log("✓ tokens built → src/registry/birchline-tokens.css, tokens/birchline.tokens.json")
