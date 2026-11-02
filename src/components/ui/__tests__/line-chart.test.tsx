import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LineChart, LineChartTooltipContent, type LineChartSeries } from "@/components/ui/line-chart"
import { buildRows, sortPoints } from "@/lib/line-chart-data"
import { createSampleEvents } from "@/lib/line-chart-sample-data"

// jsdom has no layout, so Recharts draws nothing here (the container is 0 wide).
// These tests cover everything around the plot: summary, toggles, zoom, legend,
// toast and the tooltip card. Hover and the drawn lines are checked in a browser.

const series: LineChartSeries[] = [
  { key: "web", label: "Web", color: "var(--color-chart-2)" },
  { key: "ios", label: "iOS", color: "var(--color-chart-3)" },
  { key: "android", label: "Android", color: "var(--color-chart-4)" },
]

const data = createSampleEvents()
const zoomIn = () => screen.getByRole("button", { name: "Zoom in" })
const zoomOut = () => screen.getByRole("button", { name: "Zoom out" })

describe("LineChart summary and zoom", () => {
  it("opens at four weeks with a title and summary", () => {
    render(<LineChart data={data} title="Events Over Time" />)
    expect(screen.getByRole("heading", { name: "Events Over Time" })).toBeInTheDocument()
    expect(screen.getByText(/^[\d,]+ events over 29 days \/ 4 weeks$/)).toBeInTheDocument()
  })

  it("uses the unit in the summary", () => {
    render(<LineChart data={data} title="Sessions" unit="sessions" />)
    expect(screen.getByText(/sessions over 29 days/)).toBeInTheDocument()
  })

  it("zooms from one week to the full eight weeks, then stops", async () => {
    render(<LineChart data={data} title="Events" />)
    for (let i = 0; i < 3; i++) await userEvent.click(zoomIn())
    expect(screen.getByText(/over 8 days \/ 1 week$/)).toBeInTheDocument()
    expect(zoomIn()).toBeDisabled()
    expect(zoomOut()).toBeEnabled()

    for (let i = 0; i < 7; i++) await userEvent.click(zoomOut())
    expect(screen.getByText(/over 56 days \/ 8 weeks$/)).toBeInTheDocument()
    expect(zoomOut()).toBeDisabled()
    expect(zoomIn()).toBeEnabled()
  })

  it("never offers more zoom than the data supports", () => {
    render(<LineChart data={data.slice(-14)} title="Events" defaultWeeks={8} />)
    expect(screen.getByText(/over 14 days \/ 2 weeks$/)).toBeInTheDocument()
    expect(zoomOut()).toBeDisabled()
  })

  it("announces the new range after a zoom", async () => {
    render(<LineChart data={data} title="Events" />)
    await userEvent.click(zoomOut())
    const toast = screen.getByRole("status")
    expect(within(toast).getByText("Sep 26 - Oct 31")).toBeInTheDocument()
    expect(within(toast).getByText("36 days / 5 weeks")).toBeInTheDocument()
  })

  it("shows an empty state", () => {
    render(<LineChart data={[]} title="Events" />)
    expect(screen.getByText("No data available for this period")).toBeInTheDocument()
    expect(screen.getByText(/^0 events over 0 days \/ 0 weeks$/)).toBeInTheDocument()
  })
})

describe("LineChart toggles", () => {
  it("starts cumulative and can switch to daily", async () => {
    render(<LineChart data={data} title="Events" />)
    const box = screen.getByRole("checkbox", { name: /cumulative/i })
    expect(box).toBeChecked()
    await userEvent.click(box)
    expect(box).not.toBeChecked()
  })

  it("can start in daily mode", () => {
    render(<LineChart data={data} title="Events" defaultCumulative={false} />)
    expect(screen.getByRole("checkbox", { name: /cumulative/i })).not.toBeChecked()
  })

  it("hides the breakdown toggle when there are no series", () => {
    render(<LineChart data={data} title="Events" />)
    expect(screen.queryByRole("checkbox", { name: /by platform/i })).not.toBeInTheDocument()
  })

  it("shows a legend with each series' share when the breakdown is on", async () => {
    render(<LineChart data={data} title="Events" series={series} />)
    const box = screen.getByRole("checkbox", { name: /by platform/i })
    expect(box).not.toBeChecked()
    expect(screen.queryByText(/^Web \(/)).not.toBeInTheDocument()

    await userEvent.click(box)
    expect(box).toBeChecked()
    const shares = ["Web", "iOS", "Android"].map((label) => {
      const m = screen.getByText(new RegExp(`^${label} \\((\\d+)%\\)$`)).textContent!.match(/\((\d+)%\)/)!
      return Number(m[1])
    })
    // Rounded shares add to roughly 100.
    expect(shares.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(99)
    expect(shares.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(101)
    expect(shares[0]).toBeGreaterThan(shares[2])
  })

  it("uses a custom breakdown label", () => {
    render(<LineChart data={data} title="Events" series={series} breakdownLabel="By Region" />)
    expect(screen.getByRole("checkbox", { name: /by region/i })).toBeInTheDocument()
  })

  it("can be controlled", async () => {
    const onChange = vi.fn()
    render(<LineChart data={data} title="Events" series={series} breakdown onBreakdownChange={onChange} />)
    const box = screen.getByRole("checkbox", { name: /by platform/i })
    expect(box).toBeChecked()
    await userEvent.click(box)
    expect(onChange).toHaveBeenCalledWith(false)
    expect(box).toBeChecked() // the parent owns the value, so it stays on
  })

  it("can start with the breakdown on", () => {
    render(<LineChart data={data} title="Events" series={series} defaultBreakdown />)
    expect(screen.getByText(/^Web \(\d+%\)$/)).toBeInTheDocument()
  })
})

describe("LineChartTooltipContent", () => {
  const pts = sortPoints([
    { date: "2026-10-29", value: 100, breakdown: { web: 50, ios: 30, android: 20 } },
    { date: "2026-10-30", value: 130, breakdown: { web: 70, ios: 30, android: 30 } },
  ])
  const keys = ["web", "ios", "android"]
  const rowsCumulative = buildRows(pts, pts, { cumulative: true, seriesKeys: keys })
  const row = rowsCumulative[1]

  it("shows the day, each series' daily value and its change when the breakdown is off", () => {
    render(<LineChartTooltipContent row={row} series={series} breakdown={false} unit="events" seriesHeading="Platform" />)
    expect(screen.getByText("Fri, Oct 30")).toBeInTheDocument()
    expect(screen.getByText("Platform")).toBeInTheDocument()
    expect(screen.getByText("Events")).toBeInTheDocument()
    const rows = screen.getAllByRole("row").slice(1)
    expect(rows).toHaveLength(3)
    expect(within(rows[0]).getByText("Web")).toBeInTheDocument()
    expect(within(rows[0]).getByText("70")).toBeInTheDocument()
    expect(within(rows[0]).getByText("+40%")).toBeInTheDocument()
    expect(within(rows[1]).getByText("30")).toBeInTheDocument()
    expect(within(rows[1]).getByText("+0%")).toBeInTheDocument()
    expect(within(rows[2]).getByText("+50%")).toBeInTheDocument()
  })

  it("shows the plotted (cumulative) values when the breakdown is on", () => {
    render(<LineChartTooltipContent row={row} series={series} breakdown unit="events" seriesHeading="Platform" />)
    const rows = screen.getAllByRole("row").slice(1)
    expect(within(rows[0]).getByText("120")).toBeInTheDocument() // 50 + 70
    expect(within(rows[1]).getByText("60")).toBeInTheDocument() // 30 + 30
  })

  it("shows a dash when there is no previous day", () => {
    const first = rowsCumulative[0]
    render(<LineChartTooltipContent row={first} series={series} breakdown={false} unit="events" seriesHeading="Platform" />)
    expect(screen.getAllByText("—")).toHaveLength(3)
  })

  it("shows negative changes", () => {
    const down = sortPoints([
      { date: "2026-10-29", value: 100, breakdown: { web: 100 } },
      { date: "2026-10-30", value: 75, breakdown: { web: 75 } },
    ])
    const r = buildRows(down, down, { cumulative: false, seriesKeys: ["web"] })[1]
    render(<LineChartTooltipContent row={r} series={[series[0]]} breakdown={false} unit="events" seriesHeading="Platform" />)
    expect(screen.getByText("-25%")).toBeInTheDocument()
  })

  it("shows daily and total without series", () => {
    render(<LineChartTooltipContent row={row} breakdown={false} unit="events" seriesHeading="Platform" />)
    expect(screen.getByText("Daily")).toBeInTheDocument()
    expect(screen.getByText("130")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
    expect(screen.getByText("230")).toBeInTheDocument()
  })
})
