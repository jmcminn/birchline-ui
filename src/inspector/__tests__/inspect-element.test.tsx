import { render, screen } from "@testing-library/react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { semantic, aliases } from "../../../tokens/birchline.tokens.mjs"
import { parseClass, splitVariants } from "../parse-classes"
import { inspectElement } from "../inspect-element"

// jsdom doesn't load the Tailwind theme, so feed the real token names.
const TOKENS = new Set<string>([...Object.keys(semantic), ...Object.keys(aliases)])
const isColorToken = (n: string) => TOKENS.has(n)
// …and no computed border widths, so treat the `border` utility as the width.
const hasBorder = (el: Element) => el.classList.contains("border")

describe("parseClass", () => {
  it("splits variants outside brackets", () => {
    expect(splitVariants("dark:hover:bg-[var(--color-a)]")).toEqual({
      variants: ["dark", "hover"],
      utility: "bg-[var(--color-a)]",
    })
  })

  it("reads state, property, token and opacity", () => {
    expect(parseClass("hover:bg-primary-hover", isColorToken)).toMatchObject({
      kind: "color", state: "hover", prop: "bg", token: "primary-hover",
    })
    expect(parseClass("focus-visible:ring-ring/40", isColorToken)).toMatchObject({
      kind: "color", state: "focus", prop: "ring", token: "ring", opacity: 40,
    })
    expect(parseClass("dark:hover:bg-accent", isColorToken)).toMatchObject({ dark: true, state: "hover" })
  })

  it("separates text colour from text size, and ignores non-token values", () => {
    expect(parseClass("text-sm", isColorToken)).toMatchObject({ kind: "type", type: "size", token: "--text-sm" })
    expect(parseClass("font-medium", isColorToken)).toMatchObject({ kind: "type", token: "--font-weight-medium" })
    expect(parseClass("ring-[3px]", isColorToken)).toBeNull()
    expect(parseClass("border", isColorToken)).toBeNull()
    expect(parseClass("md:bg-primary", isColorToken)).toBeNull()
  })

  it("reports effects", () => {
    expect(parseClass("disabled:opacity-50", isColorToken)).toMatchObject({ kind: "effect", state: "disabled", effect: "opacity 50%" })
  })
})

describe("inspectElement · Button", () => {
  it("primary: rest list, hover shows only what changes, disabled has no new colours", () => {
    render(<Button>Create task</Button>)
    const r = inspectElement(screen.getByRole("button"), { isColorToken, hasBorder, dark: false })

    expect(r.component).toBe("Button")
    expect(r.variant).toBe("default")
    const rest = r.states.find((s) => s.state === "rest")!
    expect(rest.colors).toEqual([
      { token: "primary", uses: ['"Create task" bg'] },
      { token: "primary-foreground", uses: ['"Create task" text'] },
    ])
    const hover = r.states.find((s) => s.state === "hover")!
    expect(hover.colors).toEqual([{ token: "primary-hover", uses: ['"Create task" bg'] }])
    expect(hover.effects).toEqual(["brightness 90%"])
    const disabled = r.states.find((s) => s.state === "disabled")!
    expect(disabled.colors).toEqual([])
    expect(disabled.effects).toEqual(["opacity 50%"])
    expect(r.type.map((t) => t.token)).toEqual(["--text-sm", "--font-weight-medium"])
    // Primary has no border width, so focus-visible:border-ring is dropped.
    expect(r.states.find((s) => s.state === "focus")!.colors).toEqual([
      { token: "ring", opacity: 40, uses: ['"Create task" focus ring'] },
    ])
  })

  it("compares by property: a token already used at rest still shows when it moves", () => {
    render(<Button variant="outline">Export</Button>)
    const r = inspectElement(screen.getByRole("button"), { isColorToken, hasBorder, dark: false })
    const focus = r.states.find((s) => s.state === "focus")!
    // --ring is new on the border; also the 40% ring.
    expect(focus.colors).toEqual([
      { token: "ring", uses: ['"Export" border'] },
      { token: "ring", opacity: 40, uses: ['"Export" focus ring'] },
    ])
    const hover = r.states.find((s) => s.state === "hover")!
    expect(hover.colors.map((c) => c.token)).toEqual(["accent", "gray-500"])
  })

  it("lists inheriting icons with the text colour", () => {
    render(<Button><Plus className="mr-2 h-4 w-4" /> New task</Button>)
    const r = inspectElement(screen.getByRole("button"), { isColorToken, hasBorder, dark: false })
    const text = r.states[0].colors.find((c) => c.token === "primary-foreground")!
    expect(text.uses).toEqual(['"New task" text', "plus icon"])
  })

  it("applies dark: variants only in dark mode", () => {
    render(<Button variant="ghost">Skip</Button>)
    const btn = screen.getByRole("button")
    const light = inspectElement(btn, { isColorToken, hasBorder, dark: false })
    const dark = inspectElement(btn, { isColorToken, hasBorder, dark: true })
    expect(light.states.find((s) => s.state === "hover")!.effects).toEqual(["brightness 90%"])
    expect(dark.states.find((s) => s.state === "hover")!.effects).toEqual(["brightness 125%"])
  })
})
