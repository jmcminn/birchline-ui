import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DatePickerRangeDemo } from "@/App"
import { formatSelectedRange } from "@/lib/date-format"

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day)

describe("formatSelectedRange", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 10, 7)) // Nov 7, 2026
  })
  afterEach(() => vi.useRealTimers())

  it("returns null with nothing picked", () => {
    expect(formatSelectedRange(undefined, true)).toBeNull()
    expect(formatSelectedRange({ from: undefined, to: undefined }, true)).toBeNull()
  })

  it("collapses a same-month range", () => {
    const r = { from: d(2026, 11, 10), to: d(2026, 11, 24) }
    expect(formatSelectedRange(r, true)).toBe("Nov 10–24, 2026")
    expect(formatSelectedRange(r, false)).toBe("Nov 10–24")
  })

  it("shows both months for a cross-month range", () => {
    const r = { from: d(2026, 11, 25), to: d(2026, 12, 10) }
    expect(formatSelectedRange(r, true)).toBe("Nov 25 – Dec 10, 2026")
    expect(formatSelectedRange(r, false)).toBe("Nov 25 – Dec 10")
  })

  it("always shows both years when the range crosses years", () => {
    const r = { from: d(2026, 12, 28), to: d(2027, 1, 3) }
    const expected = "Dec 28, 2026 – Jan 3, 2027"
    expect(formatSelectedRange(r, true)).toBe(expected)
    expect(formatSelectedRange(r, false)).toBe(expected)
  })

  it("keeps the year for a range outside the current year", () => {
    const r = { from: d(2027, 11, 10), to: d(2027, 11, 24) }
    expect(formatSelectedRange(r, false)).toBe("Nov 10–24, 2027")
  })

  it("shows a trailing dash while only a start is picked", () => {
    const r = { from: d(2026, 11, 10), to: undefined }
    expect(formatSelectedRange(r, true)).toBe("Nov 10, 2026 –")
    expect(formatSelectedRange(r, false)).toBe("Nov 10 –")
  })

  it("shows a single date for a same-day range", () => {
    const r = { from: d(2026, 11, 10), to: d(2026, 11, 10) }
    expect(formatSelectedRange(r, false)).toBe("Nov 10")
  })

  it("swaps a reversed range", () => {
    const r = { from: d(2026, 11, 24), to: d(2026, 11, 10) }
    expect(formatSelectedRange(r, false)).toBe("Nov 10–24")
  })
})

describe("DatePickerRangeDemo", () => {
  it("picks a start and end, shows the range, and clears it", async () => {
    const user = userEvent.setup()
    render(<DatePickerRangeDemo showCurrentYear={false} />)
    const trigger = screen.getByRole("button", { name: /pick a date range/i })
    await user.click(trigger)

    const grid = await screen.findByRole("grid")
    // The footer link is there from the start, but disabled until a date is picked.
    expect(screen.getByRole("button", { name: "Clear Selected Date" })).toBeDisabled()
    await user.click(within(grid).getByRole("button", { name: /(^|\D)10(\D|$)/ }))
    expect(screen.getByRole("button", { name: /–\s*$/ })).toBeInTheDocument() // "Mon D –"

    expect(screen.getByRole("button", { name: "Clear Selected Date" })).toBeEnabled()

    await user.click(within(grid).getByRole("button", { name: /(^|\D)24(\D|$)/ }))
    expect(screen.getByRole("button", { name: /–24|–/ })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Clear date range" }))
    expect(screen.getByRole("button", { name: /pick a date range/i })).toBeInTheDocument()
  })
})
