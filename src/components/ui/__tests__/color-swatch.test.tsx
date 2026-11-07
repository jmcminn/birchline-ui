import { render, screen, waitFor, fireEvent } from "@testing-library/react"
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

  it("copies the hex and flashes the Copied bubble when the square is clicked", async () => {
    renderSwatch()
    await waitFor(() => expect(screen.getByText("#FFFFFF")).toBeInTheDocument())
    const [square] = screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })
    fireEvent.click(square)
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("#FFFFFF"))
    expect(await screen.findByRole("status")).toHaveTextContent("Copied to clipboard")
  })

  it("also copies when the hex text is clicked", async () => {
    renderSwatch()
    await waitFor(() => expect(screen.getByText("#FFFFFF")).toBeInTheDocument())
    const targets = screen.getAllByRole("button", { name: "Copy hex #FFFFFF for --white" })
    fireEvent.click(targets[1])
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("#FFFFFF"))
  })
})
