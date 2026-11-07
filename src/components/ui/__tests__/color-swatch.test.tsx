import { render, screen, waitFor, fireEvent, act } from "@testing-library/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ColorSwatch } from "@/App"

/**
 * ColorSwatch reads its hex from `getComputedStyle(documentElement)`. jsdom only
 * resolves custom properties set inline on the element, so we seed --color-white
 * there before rendering.
 */
function renderSwatch() {
  document.documentElement.style.setProperty("--color-white", "#FFFFFF")
  return render(
    <TooltipProvider>
      <ColorSwatch token="--white" semantic="card, popover" />
    </TooltipProvider>,
  )
}

describe("ColorSwatch copy-to-clipboard", () => {
  let writeText: ReturnType<typeof vi.fn>
  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined)
    // navigator.clipboard is a getter-only property in jsdom, so redefine it.
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  })

  it("shows the live hex and both copy targets carry it", async () => {
    renderSwatch()
    await waitFor(() => expect(screen.getByText("#FFFFFF")).toBeInTheDocument())
    const targets = screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })
    // The color square and the hex text are each a copy target (token/uses are not).
    expect(targets).toHaveLength(2)
  })

  it("copies the hex and morphs the tooltip to Copied when the square is clicked", async () => {
    renderSwatch()
    await waitFor(() => expect(screen.getByText("#FFFFFF")).toBeInTheDocument())
    const [square] = screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })
    fireEvent.click(square)
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("#FFFFFF"))
    // Tooltip label becomes "Copied to clipboard" (rendered in the open tooltip).
    expect((await screen.findAllByText("Copied to clipboard")).length).toBeGreaterThan(0)
    // Screen-reader announcement.
    expect(screen.getByText("Copied #FFFFFF to clipboard")).toBeInTheDocument()
  })

  it("also copies when the hex text is clicked", async () => {
    renderSwatch()
    await waitFor(() => expect(screen.getByText("#FFFFFF")).toBeInTheDocument())
    const targets = screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })
    fireEvent.click(targets[1])
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("#FFFFFF"))
  })
})

describe("ColorSwatch copy tooltip sequence", () => {
  let writeText: ReturnType<typeof vi.fn>
  beforeEach(() => {
    vi.useFakeTimers()
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms) })
  const square = () => screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })[0]
  const clickCopy = async () => {
    await act(async () => { fireEvent.click(square()) })
    await advance(50)
  }

  it("shows Copied, then fades out and closes, and never returns to Copy hex code", async () => {
    renderSwatch()
    await clickCopy()
    expect(screen.getAllByText("Copied to clipboard").length).toBeGreaterThan(0)
    expect(square()).not.toHaveAttribute("data-spent") // still animating

    await advance(500)
    expect(square()).toHaveAttribute("data-spent") // animation done: cursor reverts

    await advance(1000) // rest over: fading begins
    const tip = document.querySelector("[data-slot=tooltip-content]") as HTMLElement
    expect(tip.style.opacity).toBe("0")
    expect(tip.style.transition).toContain("300ms")

    await advance(400) // fade done: closed for good
    expect(document.querySelector("[data-slot=tooltip-content]")).toBeNull()
    expect(screen.queryByText("Copy hex code")).toBeNull()
    expect(square()).toHaveAttribute("data-spent")
  })

  it("ignores clicks and stays closed while the pointer remains after copying", async () => {
    renderSwatch()
    await clickCopy()
    await advance(2000)
    expect(writeText).toHaveBeenCalledTimes(1)

    fireEvent.click(square()) // spent: ignored
    fireEvent.pointerEnter(square()) // still hovering: does not reopen
    await advance(1000)
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(document.querySelector("[data-slot=tooltip-content]")).toBeNull()
  })

  it("re-arms after the pointer leaves and comes back", async () => {
    renderSwatch()
    await clickCopy()
    await advance(2000)

    fireEvent.pointerLeave(square())
    expect(square()).not.toHaveAttribute("data-spent")
    fireEvent.pointerEnter(square())
    await advance(800)
    expect(screen.getAllByText("Copy hex code").length).toBeGreaterThan(0)

    fireEvent.click(square())
    await advance(50)
    expect(writeText).toHaveBeenCalledTimes(2)
  })
})
