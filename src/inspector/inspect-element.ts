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
  token: string
  opacity?: number
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
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim()
  if (text) return `"${truncate(text, 28)}"`
  const aria = el.getAttribute("aria-label") ?? el.getAttribute("title")
  if (aria) return `"${truncate(aria, 28)}"`
  return el.tagName.toLowerCase()
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

const TYPE_ORDER: TypeKind[] = ["family", "size", "weight", "leading", "tracking"]

export function inspectElement(root: Element, opts: InspectOptions = {}): InspectReport {
  const isColorToken = opts.isColorToken ?? defaultIsColorToken
  const dark = opts.dark ?? document.documentElement.getAttribute("data-mode") === "dark"

  const elements = [root, ...Array.from(root.querySelectorAll("*"))]

  // value[state]["<elIndex>|<prop>"] = token(+opacity); later classes win, dark
  // variants win over light ones in dark mode (mirrors CSS order in Tailwind v4).
  type Slot = { token: string; opacity?: number; el: number; prop: ColorProp; specificity: number }
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
        const key = `${i}|${p.prop}`
        const prev = colors.get(p.state)!.get(key)
        if (!prev || specificity >= prev.specificity)
          colors.get(p.state)!.set(key, { token: p.token, opacity: p.opacity, el: i, prop: p.prop, specificity })
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
      const uses = [`${labels[slot.el]} ${PROP_LABEL[slot.prop]}`]
      if (slot.prop === "text") for (const icon of inheritsText.get(slot.el) ?? []) uses.push(labels[icon])
      const existing = rows.find((r) => r.token === slot.token && r.opacity === slot.opacity)
      if (existing) existing.uses.push(...uses)
      else rows.push({ token: slot.token, ...(slot.opacity !== undefined ? { opacity: slot.opacity } : {}), uses })
    }

    const fx = Array.from(effects.get(state)!.entries())
      .filter(([key, v]) => state === "rest" || restEffects.get(key)?.effect !== v.effect)
      .map(([, v]) => v.effect)

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

  const slotName = root.getAttribute("data-slot") ?? root.tagName.toLowerCase()
  return {
    component: slotName.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()),
    variant: root.getAttribute("data-variant") ?? undefined,
    size: root.getAttribute("data-size") ?? undefined,
    label: labels[0],
    states,
    type: typeRows,
  }
}
