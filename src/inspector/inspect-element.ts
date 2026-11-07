/**
 * Token inspector · DOM layer.
 *
 * Given a rendered component root, reads the classes on it and its descendants
 * (via parse-classes) and builds the simple spec list:
 *
 *   COLORS
 *   At Rest    --primary              "Create task" bg
 *              --primary-foreground   "Create task" text, plus icon
 *   Hover      --primary-hover        "Create task" bg
 *   Disabled   no new colors · opacity 50%
 *
 * Each non-rest state lists only what CHANGES versus rest, compared property by
 * property (so a token already used elsewhere at rest still shows up when it
 * moves onto a new property).
 */
import {
  parseClass,
  STATE_ORDER,
  type ColorProp,
  type ParsedClass,
  type StateKey,
  type TypeKind,
} from "./parse-classes"

export interface ColorRow {
  /** Token name (`primary`), or the raw CSS value when `raw` is set. */
  token: string
  opacity?: number
  /** True when the colour is not a Birchline token (e.g. a hard-coded hex). */
  raw?: boolean
  /** Where it's used, e.g. `"Create task" bg`, `plus icon`. */
  uses: string[]
}

export interface StateBlock {
  state: StateKey
  colors: ColorRow[]
  effects: string[]
}

export interface TypeRow {
  type: TypeKind
  token: string
  inherited?: boolean
}

export interface InspectReport {
  component: string
  /** Parent component for a part, e.g. "Select" for `select-item`. */
  parent?: string
  /** Nested components (their own `data-slot`), reported separately. */
  contains: string[]
  variant?: string
  size?: string
  label: string
  states: StateBlock[]
  type: TypeRow[]
}

export interface InspectOptions {
  /** Defaults to "is `--color-<name>` defined on :root". */
  isColorToken?: (name: string) => boolean
  /** Defaults to reading `data-mode` on <html>. */
  dark?: boolean
  /** Defaults to the computed border-top-width (jsdom has no stylesheet, so tests override it). */
  hasBorder?: (el: Element) => boolean
}

const PROP_LABEL: Record<ColorProp, string> = {
  bg: "bg",
  text: "text",
  border: "border",
  ring: "focus ring",
  outline: "outline",
  fill: "fill",
  stroke: "stroke",
  decoration: "underline",
}

export function defaultIsColorToken(name: string): boolean {
  if (!/^[a-z][\w-]*$/.test(name)) return false
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim() !== ""
}

/** Human label for the element a colour lands on. */
export function describeTarget(el: Element): string {
  if (el.tagName.toLowerCase() === "svg") {
    const lucide = Array.from(el.classList).find((c) => c.startsWith("lucide-") && c !== "lucide-icon")
    if (lucide) return `${lucide.slice(7).replace(/-/g, " ")} icon`
    return el.getAttribute("aria-label") ? `${el.getAttribute("aria-label")} icon` : "icon"
  }
  // SVG text (chart axes) groups as one row instead of one per tick.
  if (el.tagName.toLowerCase() === "text" || el.tagName.toLowerCase() === "tspan") return "tick label"
  const text = textOf(el)
  if (text) return `"${truncate(text, 28)}"`
  const aria = el.getAttribute("aria-label") ?? el.getAttribute("title")
  if (aria) return `"${truncate(aria, 28)}"`
  return el.tagName.toLowerCase()
}

/** Visible-ish text with a space between text nodes, so `<span>CH</span>Carol`
 *  reads "CH Carol" rather than "CHCarol". */
function textOf(el: Element): string {
  const parts: string[] = []
  const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent?.trim()
    if (t) parts.push(t)
  }
  return parts.join(" ").replace(/\s+/g, " ").trim()
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

/** Component families whose parts are named `<family>-<part>` (shadcn v4 style).
 *  Longest first so `alert-dialog-content` resolves to AlertDialog, not Alert. */
const FAMILIES = [
  "alert-dialog", "dropdown-menu", "navigation-menu", "toggle-group", "user-selector", "line-chart",
  "alert", "avatar", "badge", "breadcrumb", "calendar", "card", "command", "dialog", "popover",
  "progress", "select", "sheet", "sidebar", "table", "tabs", "toast", "tooltip",
]

export function pascal(slot: string): string {
  return slot.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())
}

/** Third-party roots we can't put a `data-slot` on, recognised by their own markup. */
const ADOPTED_SLOTS: [string, string][] = [["[data-sonner-toast]", "toast"]]

/** CSS selector that matches any adopted third-party root (for the inspector's hit-test). */
export const ADOPTED_SELECTOR = ADOPTED_SLOTS.map(([sel]) => sel).join(", ")

/** Slot name for a root: its own `data-slot`, or an adopted third-party root, else undefined. */
export function slotOf(el: Element): string | undefined {
  const own = el.getAttribute("data-slot")
  if (own) return own
  for (const [sel, name] of ADOPTED_SLOTS) if (el.matches(sel)) return name
  return undefined
}

export function parentOf(slot: string): string | undefined {
  const fam = FAMILIES.find((f) => slot.startsWith(`${f}-`))
  return fam ? pascal(fam) : undefined
}

/** Descendants that belong to this component: stops at nested `data-slot` roots. */
function ownElements(root: Element): { elements: Element[]; contains: string[] } {
  const elements: Element[] = [root]
  const contains: string[] = []
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      const slot = child.getAttribute("data-slot")
      if (slot) {
        const name = pascal(slot)
        if (!contains.includes(name)) contains.push(name)
        continue
      }
      elements.push(child)
      walk(child)
    }
  }
  walk(root)
  return { elements, contains }
}

/** Inline-style and SVG-attribute colours (charts, computed tints). */
const STYLE_PROPS: [string, ColorProp][] = [
  ["background-color", "bg"], ["background", "bg"], ["color", "text"], ["border-color", "border"],
  ["fill", "fill"], ["stroke", "stroke"],
]
const IGNORED_VALUES = /^(none|currentcolor|transparent|inherit|initial|unset|auto)$|^url\(/i

function nonClassColors(el: Element): { prop: ColorProp; value: string }[] {
  const out: { prop: ColorProp; value: string }[] = []
  const style = (el as HTMLElement).style
  for (const [css, prop] of STYLE_PROPS) {
    const v = style?.getPropertyValue?.(css)?.trim()
    if (v && !IGNORED_VALUES.test(v) && !out.some((o) => o.prop === prop)) out.push({ prop, value: v })
  }
  for (const attr of ["fill", "stroke"] as const) {
    const v = el.getAttribute(attr)?.trim()
    if (v && !IGNORED_VALUES.test(v) && !out.some((o) => o.prop === attr)) out.push({ prop: attr, value: v })
  }
  return out
}

/** ["line stroke", "line stroke", "x icon"] → ["line stroke ×2", "x icon"]. */
function countUses(uses: string[]): string[] {
  const counts = new Map<string, number>()
  for (const u of uses) counts.set(u, (counts.get(u) ?? 0) + 1)
  return Array.from(counts, ([u, n]) => (n > 1 ? `${u} ×${n}` : u))
}

const TYPE_ORDER: TypeKind[] = ["family", "size", "weight", "leading", "tracking"]

export function inspectElement(root: Element, opts: InspectOptions = {}): InspectReport {
  const isColorToken = opts.isColorToken ?? defaultIsColorToken
  const dark = opts.dark ?? document.documentElement.getAttribute("data-mode") === "dark"

  const { elements, contains } = ownElements(root)

  // value[state]["<elIndex>|<prop>"] = token(+opacity); later classes win, dark
  // variants win over light ones in dark mode (mirrors CSS order in Tailwind v4).
  type Slot = {
    token: string; opacity?: number; el: number; prop: ColorProp; specificity: number
    raw?: boolean; placeholder?: boolean
  }
  const colors = new Map<StateKey, Map<string, Slot>>()
  const effects = new Map<StateKey, Map<string, { effect: string; specificity: number }>>()
  const type = new Map<TypeKind, { token: string; specificity: number }>()
  for (const s of STATE_ORDER) {
    colors.set(s, new Map())
    effects.set(s, new Map())
  }

  elements.forEach((el, i) => {
    const classes = Array.from(el.classList)
    for (const cls of classes) {
      const p: ParsedClass | null = parseClass(cls, isColorToken)
      if (!p) continue
      if (p.dark && !dark) continue
      const specificity = p.dark ? 1 : 0
      if (p.kind === "color") {
        const key = `${i}|${p.prop}${p.pseudo ? "|placeholder" : ""}`
        const prev = colors.get(p.state)!.get(key)
        if (!prev || specificity >= prev.specificity)
          colors.get(p.state)!.set(key, {
            token: p.token, opacity: p.opacity, el: i, prop: p.prop, specificity,
            ...(p.pseudo ? { placeholder: true } : {}),
          })
      } else if (p.kind === "effect") {
        // effects are reported for the component root only
        if (i !== 0) continue
        const prev = effects.get(p.state)!.get(p.key)
        if (!prev || specificity >= prev.specificity) effects.get(p.state)!.set(p.key, { effect: p.effect, specificity })
      } else if (p.kind === "type" && p.state === "rest" && i === 0) {
        const prev = type.get(p.type)
        if (!prev || specificity >= prev.specificity) type.set(p.type, { token: p.token, specificity })
      }
    }
  })

  // Inline styles and SVG attributes beat classes. `var(--color-x)` resolves to a
  // token; anything else (hex, rgb, a computed tint) is listed as "not a token".
  elements.forEach((el, i) => {
    for (const { prop, value } of nonClassColors(el)) {
      const m = value.match(/^var\(--color-([\w-]+)\)$/)
      const key = `${i}|${prop}`
      if (m && isColorToken(m[1])) colors.get("rest")!.set(key, { token: m[1], el: i, prop, specificity: 2 })
      else if (!m) colors.get("rest")!.set(key, { token: value, el: i, prop, specificity: 2, raw: true })
    }
  })

  // Icons with no colour class of their own inherit `currentColor` from the
  // nearest ancestor that sets a text colour — list them alongside that token.
  const inheritsText = new Map<number, number[]>() // ancestor index → icon indices
  elements.forEach((el, i) => {
    if (i === 0 || el.tagName.toLowerCase() !== "svg") return
    const own = colors.get("rest")!
    if (own.has(`${i}|text`) || own.has(`${i}|fill`) || own.has(`${i}|stroke`)) return
    let p: Element | null = el.parentElement
    while (p) {
      const idx = elements.indexOf(p)
      if (idx === -1) break
      if (STATE_ORDER.some((s) => colors.get(s)!.has(`${idx}|text`))) {
        inheritsText.set(idx, [...(inheritsText.get(idx) ?? []), i])
        break
      }
      p = p.parentElement
    }
  })

  // A border colour with no border width (e.g. `focus-visible:border-ring` on
  // the borderless primary button) never renders — leave it out.
  const hasBorder = opts.hasBorder ?? ((el: Element) => parseFloat(getComputedStyle(el).borderTopWidth) > 0)
  for (const state of STATE_ORDER) {
    for (const [key, slot] of colors.get(state)!) {
      if (slot.prop === "border" && !hasBorder(elements[slot.el])) colors.get(state)!.delete(key)
    }
  }

  const labels = elements.map(describeTarget)
  const rest = colors.get("rest")!
  const restEffects = effects.get("rest")!

  const states: StateBlock[] = STATE_ORDER.map((state) => {
    const slots = Array.from(colors.get(state)!.entries())
      .filter(([key, slot]) => {
        if (state === "rest") return true
        const r = rest.get(key)
        return !r || r.token !== slot.token || r.opacity !== slot.opacity
      })
      .map(([, slot]) => slot)

    const rows: ColorRow[] = []
    for (const slot of slots) {
      const uses = [slot.placeholder ? "placeholder text" : `${labels[slot.el]} ${PROP_LABEL[slot.prop]}`]
      if (slot.prop === "text") for (const icon of inheritsText.get(slot.el) ?? []) uses.push(labels[icon])
      const existing = rows.find((r) => r.token === slot.token && r.opacity === slot.opacity && !!r.raw === !!slot.raw)
      if (existing) existing.uses.push(...uses)
      else
        rows.push({
          token: slot.token,
          ...(slot.opacity !== undefined ? { opacity: slot.opacity } : {}),
          ...(slot.raw ? { raw: true } : {}),
          uses,
        })
    }

    const fx = Array.from(effects.get(state)!.entries())
      .filter(([key, v]) => state === "rest" || restEffects.get(key)?.effect !== v.effect)
      .map(([, v]) => v.effect)

    for (const row of rows) row.uses = countUses(row.uses)
    return { state, colors: rows, effects: fx }
  }).filter((b) => b.state === "rest" || b.colors.length > 0 || b.effects.length > 0)

  // Font family is usually inherited from <body>; report which token it resolves to.
  if (!type.has("family") && typeof getComputedStyle === "function") {
    const fam = getComputedStyle(root).fontFamily.replace(/['"\s]/g, "")
    const rootStyle = getComputedStyle(document.documentElement)
    for (const f of ["sans", "serif", "mono"]) {
      const v = rootStyle.getPropertyValue(`--font-${f}`).replace(/['"\s]/g, "")
      if (v && fam === v) {
        type.set("family", { token: `--font-${f}`, specificity: -1 })
        break
      }
    }
  }

  const typeRows: TypeRow[] = TYPE_ORDER.filter((t) => type.has(t)).map((t) => ({
    type: t,
    token: type.get(t)!.token,
    ...(type.get(t)!.specificity === -1 ? { inherited: true } : {}),
  }))

  const slotName = slotOf(root) ?? root.tagName.toLowerCase()
  const parent = parentOf(slotName)
  return {
    component: pascal(slotName),
    ...(parent ? { parent } : {}),
    contains,
    variant: root.getAttribute("data-variant") ?? undefined,
    size: root.getAttribute("data-size") ?? undefined,
    label: labels[0],
    states,
    type: typeRows,
  }
}
