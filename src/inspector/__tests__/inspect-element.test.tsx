import { render, screen } from "@testing-library/react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { semantic, aliases } from "../../../tokens/birchline.tokens.mjs"
import { parseClass, splitVariants } from "../parse-classes"
import { inspectElement, slotOf } from "../inspect-element"

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

  it("reads Sonner's group scoping variants as resting colours", () => {
    expect(parseClass("group-[.toaster]:bg-popover", isColorToken)).toMatchObject({
      kind: "color", state: "rest", prop: "bg", token: "popover",
    })
    expect(parseClass("group-[.toast]:text-muted-foreground", isColorToken)).toMatchObject({
      kind: "color", state: "rest", prop: "text", token: "muted-foreground",
    })
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

describe("parseClass · extra states", () => {
  it("maps menu highlight, validation, placeholder and off states", () => {
    expect(parseClass("data-[highlighted]:bg-accent", isColorToken)).toMatchObject({ state: "hover", token: "accent" })
    expect(parseClass("aria-invalid:border-danger", isColorToken)).toMatchObject({ state: "invalid", prop: "border", token: "danger" })
    expect(parseClass("peer-disabled:opacity-70", isColorToken)).toMatchObject({ kind: "effect", state: "disabled" })
    expect(parseClass("data-[active=true]:bg-accent", isColorToken)).toMatchObject({ state: "selected" })
    expect(parseClass("data-[state=unchecked]:bg-input", isColorToken)).toMatchObject({ state: "rest" })
    expect(parseClass("placeholder:text-muted-foreground", isColorToken)).toMatchObject({
      state: "rest", prop: "text", token: "muted-foreground", pseudo: "placeholder",
    })
    expect(parseClass("placeholder:text-sm", isColorToken)).toBeNull()
  })
})

describe("inspectElement · parts, nesting, inline colours", () => {
  it("names the parent of a part", () => {
    const { container } = render(<div data-slot="select-item" className="text-foreground">One</div>)
    const r = inspectElement(container.firstElementChild!, { isColorToken, hasBorder, dark: false })
    expect(r.component).toBe("SelectItem")
    expect(r.parent).toBe("Select")
    const { container: c2 } = render(<div data-slot="alert-dialog-content" />)
    expect(inspectElement(c2.firstElementChild!, { isColorToken, hasBorder, dark: false }).parent).toBe("AlertDialog")
    const { container: c3 } = render(<div data-slot="card" />)
    expect(inspectElement(c3.firstElementChild!, { isColorToken, hasBorder, dark: false }).parent).toBeUndefined()
  })

  it("stops at nested components and lists them under contains", () => {
    const { container } = render(
      <div data-slot="card" className="bg-card text-card-foreground">
        <p className="text-muted-foreground">Body</p>
        <Button>Go</Button>
      </div>,
    )
    const r = inspectElement(container.firstElementChild!, { isColorToken, hasBorder, dark: false })
    expect(r.contains).toEqual(["Button"])
    const tokens = r.states.flatMap((s) => s.colors.map((c) => c.token))
    expect(tokens).toContain("card")
    expect(tokens).toContain("muted-foreground")
    expect(tokens).not.toContain("primary") // the Button's own colours are not mixed in
  })

  it("reads placeholder colours, inline var() colours and flags raw values", () => {
    const { container } = render(
      <div data-slot="line-chart">
        <input className="placeholder:text-muted-foreground" placeholder="Search" />
        <svg>
          <line stroke="var(--color-border)" />
          <rect fill="#ff0000" />
          <path fill="none" stroke="currentColor" />
        </svg>
        <span style={{ backgroundColor: "rgba(208, 94, 56, 0.15)" }}>tint</span>
      </div>,
    )
    const r = inspectElement(container.firstElementChild!, { isColorToken, hasBorder, dark: false })
    const rest = r.states.find((s) => s.state === "rest")!.colors
    expect(rest).toContainEqual({ token: "muted-foreground", uses: ["placeholder text"] })
    expect(rest).toContainEqual({ token: "border", uses: ["line stroke"] })
    expect(rest).toContainEqual({ token: "#ff0000", raw: true, uses: ["rect fill"] })
    expect(rest.some((c) => c.raw && c.token.startsWith("rgba(208, 94, 56"))).toBe(true)
    expect(rest.some((c) => c.token === "none" || c.token === "currentColor")).toBe(false)
  })

  it("reports an Invalid state", () => {
    const { container } = render(
      <input data-slot="input" className="border border-input aria-invalid:border-danger" />,
    )
    const r = inspectElement(container.firstElementChild!, { isColorToken, hasBorder, dark: false })
    expect(r.states.find((s) => s.state === "invalid")?.colors).toEqual([{ token: "danger", uses: ["input border"] }])
  })

  it("names a part's parent component", () => {
    const { container } = render(<div data-slot="select-item" className="text-foreground" />)
    const r = inspectElement(container.firstElementChild!, { isColorToken, hasBorder, dark: false })
    expect(r.component).toBe("SelectItem")
    expect(r.parent).toBe("Select")
  })
})

describe("inspectElement · adopted third-party roots", () => {
  it("adopts a Sonner toast (no data-slot) and reads its scoped tokens", () => {
    const { container } = render(
      <div data-sonner-toast="" className="group toast group-[.toaster]:bg-popover group-[.toaster]:text-foreground group-[.toaster]:border-border border">
        <div className="group-[.toast]:text-muted-foreground">Description</div>
      </div>,
    )
    const root = container.firstElementChild!
    expect(slotOf(root)).toBe("toast")
    const r = inspectElement(root, { isColorToken, hasBorder, dark: false })
    expect(r.component).toBe("Toast")
    expect(r.parent).toBeUndefined()
    const rest = r.states.find((s) => s.state === "rest")!.colors.map((c) => c.token)
    expect(rest).toContain("popover")
    expect(rest).toContain("foreground")
    expect(rest).toContain("border")
    expect(rest).toContain("muted-foreground")
  })

  it("returns undefined for an element with no slot and no adoption", () => {
    const { container } = render(<div className="bg-primary" />)
    expect(slotOf(container.firstElementChild!)).toBeUndefined()
  })
})
