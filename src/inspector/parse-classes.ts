/**
 * Token inspector · class parser.
 *
 * Birchline components are styled with Tailwind v4 utilities whose values are
 * design tokens (`bg-primary` → `var(--color-primary)`), and Tailwind variants
 * name the interaction state (`hover:bg-primary-hover`). So a component's final
 * class list already says which token each state uses — no stylesheet parsing
 * or reverse-matching of computed hex values needed.
 *
 * Pure functions only (no DOM), so this is unit-testable and reusable by the
 * inspector UI, docs generators or CI checks.
 */

export type StateKey = "rest" | "hover" | "focus" | "pressed" | "selected" | "invalid" | "disabled"

export const STATE_ORDER: StateKey[] = ["rest", "hover", "focus", "pressed", "selected", "invalid", "disabled"]

export const STATE_LABEL: Record<StateKey, string> = {
  rest: "At Rest",
  hover: "Hover",
  focus: "Focus",
  pressed: "Pressed",
  selected: "Selected",
  invalid: "Invalid",
  disabled: "Disabled",
}

export type ColorProp = "bg" | "text" | "border" | "ring" | "outline" | "fill" | "stroke" | "decoration"

export type TypeKind = "family" | "size" | "weight" | "tracking" | "leading"

export type ParsedClass =
  | { kind: "color"; state: StateKey; dark: boolean; prop: ColorProp; token: string; opacity?: number; pseudo?: "placeholder" }
  | { kind: "effect"; state: StateKey; dark: boolean; effect: string; key: string }
  | { kind: "type"; state: StateKey; dark: boolean; type: TypeKind; token: string }

/** Tailwind variant → interaction state. Unknown variants (breakpoints,
 *  `[&_svg]:`, `group-data-…`) return undefined and the class is skipped. */
const STATE_VARIANTS: Record<string, StateKey> = {
  hover: "hover",
  "group-hover": "hover",
  focus: "focus",
  "focus-visible": "focus",
  "focus-within": "focus",
  active: "pressed",
  disabled: "disabled",
  "aria-disabled": "disabled",
  "data-[disabled]": "disabled",
  "aria-selected": "selected",
  "aria-checked": "selected",
  "aria-pressed": "selected",
  "aria-current": "selected",
  "aria-expanded": "selected",
  "data-[state=on]": "selected",
  "data-[state=active]": "selected",
  "data-[state=checked]": "selected",
  "data-[state=open]": "selected",
  "data-[selected=true]": "selected",
  checked: "selected",
  // Menu / select / command items: highlighted by pointer or keyboard.
  "data-[highlighted]": "hover",
  "data-highlighted": "hover",
  // Sidebar menu buttons, nav links.
  "data-[active=true]": "selected",
  "data-active": "selected",
  // Chevrons and other children that react to an open parent.
  "group-data-[state=open]": "selected",
  // Labels that dim with their control.
  "peer-disabled": "disabled",
  "group-data-[disabled=true]": "disabled",
  // Validation.
  "aria-invalid": "invalid",
  "aria-[invalid=true]": "invalid",
  "data-[invalid]": "invalid",
  "data-invalid": "invalid",
  // Explicit "off" states are the resting look.
  "data-[state=unchecked]": "rest",
  "data-[state=closed]": "rest",
  "data-[state=inactive]": "rest",
  "data-[state=off]": "rest",
  // Sonner scopes a toast's colours by DOM context, not interaction state, so
  // `group-[.toaster]:bg-popover` / `group-[.toast]:text-...` are resting colours.
  "group-[.toaster]": "rest",
  "group-[.toast]": "rest",
}

const COLOR_PREFIXES: [string, ColorProp][] = [
  // longest first so `border-t-` wins over `border-`
  ["border-x-", "border"], ["border-y-", "border"], ["border-t-", "border"], ["border-r-", "border"],
  ["border-b-", "border"], ["border-l-", "border"], ["border-", "border"],
  ["decoration-", "decoration"], ["outline-", "outline"], ["stroke-", "stroke"],
  ["fill-", "fill"], ["ring-", "ring"], ["text-", "text"], ["bg-", "bg"],
]

const TEXT_SIZES = new Set(["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"])
const FONT_WEIGHTS = new Set(["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"])
const FONT_FAMILIES = new Set(["sans", "serif", "mono"])

/** Split `dark:hover:bg-x` into variants + utility, ignoring `:` inside `[...]`. */
export function splitVariants(cls: string): { variants: string[]; utility: string } {
  const parts: string[] = []
  let depth = 0
  let cur = ""
  for (const ch of cls) {
    if (ch === "[" || ch === "(") depth++
    else if (ch === "]" || ch === ")") depth--
    if (ch === ":" && depth === 0) {
      parts.push(cur)
      cur = ""
    } else cur += ch
  }
  parts.push(cur)
  const utility = parts.pop() ?? ""
  return { variants: parts, utility }
}

/** `primary-hover` or `[var(--color-primary)]` / `(--color-primary)` → token name. */
function tokenName(value: string): string {
  const m = value.match(/^[[(](?:var\()?--color-([\w-]+)\)?[\])]$/)
  return m ? m[1] : value
}

/**
 * Parse one class. `isColorToken(name)` decides whether `name` is a Birchline
 * colour token (e.g. `primary`, `gray-500`) — it separates `text-primary`
 * (colour) from `text-sm` (size) and `border-border` from `border-2`.
 */
export function parseClass(cls: string, isColorToken: (name: string) => boolean): ParsedClass | null {
  const { variants, utility: raw } = splitVariants(cls)
  let dark = false
  let state: StateKey = "rest"
  let pseudo: "placeholder" | undefined
  for (const v of variants) {
    if (v === "dark") {
      dark = true
      continue
    }
    if (v === "placeholder") {
      pseudo = "placeholder"
      continue
    }
    const s = STATE_VARIANTS[v]
    if (!s) return null // breakpoint, arbitrary selector, etc. — not a state
    state = s
  }

  const utility = raw.replace(/^!|!$/g, "")
  if (utility.startsWith("-")) return null

  // ── Colour utilities ──
  for (const [prefix, prop] of COLOR_PREFIXES) {
    if (!utility.startsWith(prefix)) continue
    const rest = utility.slice(prefix.length)
    const [value, op] = splitOpacity(rest)
    const name = tokenName(value)
    if (isColorToken(name)) {
      const opacity = op === undefined ? undefined : Number(op)
      return {
        kind: "color", state, dark, prop, token: name,
        ...(opacity !== undefined && !Number.isNaN(opacity) ? { opacity } : {}),
        ...(pseudo ? { pseudo } : {}),
      }
    }
  }

  if (pseudo) return null // only placeholder colours are reported

  // ── Typography ──
  if (utility.startsWith("text-")) {
    const v = utility.slice(5).split("/")[0]
    if (TEXT_SIZES.has(v)) return { kind: "type", state, dark, type: "size", token: `--text-${v}` }
    if (/^\[\d/.test(v)) return { kind: "type", state, dark, type: "size", token: v.slice(1, -1) }
  }
  if (utility.startsWith("font-")) {
    const v = utility.slice(5)
    if (FONT_WEIGHTS.has(v)) return { kind: "type", state, dark, type: "weight", token: `--font-weight-${v}` }
    if (FONT_FAMILIES.has(v)) return { kind: "type", state, dark, type: "family", token: `--font-${v}` }
  }
  if (utility.startsWith("tracking-")) return { kind: "type", state, dark, type: "tracking", token: `--tracking-${utility.slice(9)}` }
  if (utility.startsWith("leading-")) return { kind: "type", state, dark, type: "leading", token: `--leading-${utility.slice(8)}` }

  // ── Effects that change appearance without changing a colour token ──
  let m: RegExpMatchArray | null
  if ((m = utility.match(/^opacity-(\d+)$/))) return { kind: "effect", state, dark, key: "opacity", effect: `opacity ${m[1]}%` }
  if ((m = utility.match(/^brightness-(\d+)$/))) return { kind: "effect", state, dark, key: "filter", effect: `brightness ${m[1]}%` }
  if (utility === "underline") return { kind: "effect", state, dark, key: "decoration-line", effect: "underline" }
  if ((m = utility.match(/^shadow-(xs|sm|md|lg|xl|2xl)$/))) return { kind: "effect", state, dark, key: "shadow", effect: `--shadow-${m[1]}` }

  return null
}

function splitOpacity(v: string): [string, string | undefined] {
  // `ring/40` → ["ring", "40"]; leave `[...]` values intact
  if (v.startsWith("[") || v.startsWith("(")) return [v, undefined]
  const i = v.lastIndexOf("/")
  return i === -1 ? [v, undefined] : [v.slice(0, i), v.slice(i + 1)]
}
