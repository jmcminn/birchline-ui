/**
 * Birchline design tokens — single source of truth.
 *
 * Three tiers: primitives → aliases → semantic, plus mode overrides (bright,
 * dark) and non-colour scales. `scripts/build-tokens.mjs` generates both
 * `src/registry/birchline-tokens.css` (the Tailwind v4 @theme file the app and
 * shadcn registry consume) and `dist/birchline.tokens.json` (a portable W3C
 * DTCG document for Figma / native / other-platform tooling) from this file.
 *
 * Edit tokens HERE, then run `npm run tokens:build`. Never hand-edit the
 * generated CSS.
 *
 * Value grammar: a string starting with `#` is a literal hex; any other string
 * is a reference to another colour token by name (emitted as `var(--color-…)`).
 */

/** Tier 1 · primitives — the only place raw hexes live. */
export const primitives = {
  // Warm-neutral ramp: lightest cream (50) → ink (975). Single source of truth
  // for every neutral surface, in both light and dark.
  "warm-50": "#FAF9F5",
  "warm-100": "#F0EEE6",
  "warm-150": "#ECE8DE",
  "warm-300": "#D1CFC5",
  "warm-350": "#C6C1B4",
  "warm-450": "#9C978A",
  "warm-500": "#8B8578",
  "warm-550": "#726F66",
  "warm-650": "#4A453E",
  "warm-680": "#46433B",
  "warm-700": "#3E3A32",
  "warm-720": "#3D3D3A",
  "warm-750": "#37342C",
  "warm-780": "#34312B",
  "warm-800": "#302D27",
  "warm-850": "#262420",
  "warm-900": "#211F1B",
  "warm-950": "#1B1A17",
  "warm-975": "#141413",

  white: "#FFFFFF",
  oat: "#E3DACC", // warm accent — intentionally outside the neutral ramp

  // Brand + status hues: light (-500) and dark-tuned (-400) values.
  clay: "#D97757",
  "clay-hover": "#C7684C",
  "green-500": "#5F7348",
  "green-400": "#8FB06B",
  "bronze-500": "#916426",
  "bronze-400": "#D69C4E",
  "red-500": "#B04A4A",
  "red-400": "#C9413F",
  "red-hover": "#9A3F3F",
  "red-hover-dark": "#B13937",
  "blue-500": "#526E92",
  "blue-400": "#7FA3D0",
  plum: "#7B6B8A",
  teal: "#5B8E8A",
  "light-yellow": "#F5E6B8",
  "highlight-dark": "#4A3C18",
}

/** Legacy aliases — keep existing component/palette names working. */
export const aliases = {
  ivory: "warm-50",
  ink: "warm-975",
  "gray-100": "warm-100",
  "gray-300": "warm-300",
  "gray-500": "warm-550",
  "gray-700": "warm-720",
  green: "green-500",
  bronze: "bronze-500",
  red: "red-500",
  blue: "blue-500",
}

/** Tier 2 · semantic — purpose-based tokens components consume (light values). */
export const semantic = {
  success: "green-500",
  warning: "bronze-500",
  danger: "red-500",
  "danger-hover": "red-hover",
  info: "blue-500",
  highlight: "light-yellow",

  background: "warm-50",
  foreground: "warm-975",

  card: "white",
  "card-foreground": "warm-975",
  popover: "white",
  "popover-foreground": "warm-975",

  primary: "clay",
  "primary-hover": "clay-hover",
  "primary-foreground": "white",

  secondary: "warm-100",
  "secondary-foreground": "warm-720",

  muted: "warm-100",
  "muted-foreground": "warm-550",

  accent: "warm-100",
  "accent-foreground": "warm-720",

  border: "warm-300",
  input: "warm-300",
  ring: "clay",

  skeleton: "warm-100",
  "skeleton-highlight": "white",
}

/**
 * Mode overrides. `bright` overrides accent-hue PRIMITIVES (flows through the
 * -500 aliases + semantic status). `dark` remaps SEMANTIC + shifting alias
 * tokens to the dark end of the ramp / the -400 hues.
 */
export const modes = {
  bright: {
    clay: "#D05E38",
    "green-500": "#658E3B",
    "bronze-500": "#C2822A",
    "red-500": "#C9413F",
    "blue-500": "#608AD5",
    plum: "#9B67B6",
    teal: "#5DB2AC",
  },
  dark: {
    background: "warm-950",
    foreground: "warm-150",
    card: "warm-850",
    "card-foreground": "warm-150",
    popover: "warm-850",
    "popover-foreground": "warm-150",
    secondary: "warm-850",
    "secondary-foreground": "warm-350",
    muted: "warm-900",
    "muted-foreground": "warm-450",
    accent: "warm-800",
    "accent-foreground": "warm-150",
    border: "warm-650",
    input: "warm-750",
    skeleton: "warm-780",
    "skeleton-highlight": "warm-680",
    success: "green-400",
    warning: "bronze-400",
    danger: "red-400",
    "danger-hover": "red-hover-dark",
    info: "blue-400",
    highlight: "highlight-dark",
    "gray-300": "warm-680",
    "gray-500": "warm-500",
  },
}

/** Non-colour scales — emitted verbatim into @theme. */
export const scales = {
  font: {
    serif: "ui-serif, Georgia, serif",
    sans: "system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, monospace",
  },
  radius: { xs: "4px", sm: "8px", md: "12px", lg: "20px" },
  shadow: {
    sm: "0 1px 2px rgba(20, 20, 19, 0.06)",
    md: "0 4px 10px rgba(20, 20, 19, 0.08)",
    lg: "0 12px 28px rgba(20, 20, 19, 0.12)",
  },
  spacing: {
    "sp-1": "4px",
    "sp-2": "8px",
    "sp-3": "12px",
    "sp-4": "16px",
    "sp-5": "24px",
    "sp-6": "32px",
    "sp-7": "48px",
    "sp-8": "64px",
  },
}
