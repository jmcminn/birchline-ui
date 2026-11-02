import {
  addDays,
  anchoredIndices,
  buildRows,
  clampWeeks,
  dayKey,
  formatDateRange,
  formatTick,
  gridAndLabelKeys,
  parseDay,
  periodText,
  seriesShares,
  sortPoints,
  visibleWindow,
  weeksOfData,
} from "@/lib/line-chart-data"
import { createSampleEvents } from "@/lib/line-chart-sample-data"

const sample = () => sortPoints(createSampleEvents())

describe("dates", () => {
  it("reads YYYY-MM-DD as that local calendar day, not UTC midnight", () => {
    const d = parseDay("2026-10-31")
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 9, 31, 0])
    expect(dayKey(d)).toBe("2026-10-31")
  })

  it("formats labels from the calendar day", () => {
    expect(formatTick("2026-10-31")).toBe("Oct 31")
    expect(formatDateRange(parseDay("2026-10-03"), parseDay("2026-10-31"))).toBe("Oct 3 - Oct 31")
  })

  it("addDays moves by calendar days", () => {
    expect(dayKey(addDays(parseDay("2026-11-01"), -1))).toBe("2026-10-31")
  })

  it("sorts oldest first and drops invalid dates", () => {
    const out = sortPoints([
      { date: "2026-10-02", value: 2 },
      { date: "not a date", value: 9 },
      { date: new Date(2026, 9, 1), value: 1 },
    ])
    expect(out.map((p) => p.key)).toEqual(["2026-10-01", "2026-10-02"])
  })
})

describe("zoom window", () => {
  it("counts whole weeks of data, at least one", () => {
    expect(weeksOfData(sample())).toBe(8)
    expect(weeksOfData([])).toBe(1)
    expect(weeksOfData(sample().slice(0, 1))).toBe(1)
  })

  it("shows the last N weeks ending on the newest day", () => {
    const win = visibleWindow(sample(), 4)
    expect(win).toHaveLength(29)
    expect(win[win.length - 1].key).toBe("2026-10-31")
    expect(win[0].key).toBe("2026-10-03")
    expect(periodText(win)).toBe("29 days / 4 weeks")
    expect(visibleWindow(sample(), 8)).toHaveLength(56)
    expect(visibleWindow(sample(), 1)).toHaveLength(8)
  })

  it("clamps zoom to what the data supports", () => {
    expect(clampWeeks(12, 8)).toBe(8)
    expect(clampWeeks(0, 8)).toBe(1)
    expect(clampWeeks(4, 8)).toBe(4)
  })

  it("reports an empty window", () => {
    expect(visibleWindow([], 4)).toEqual([])
    expect(periodText([])).toBe("0 days / 0 weeks")
  })
})

describe("buildRows", () => {
  const all = sortPoints([
    { date: "2026-10-01", value: 100, breakdown: { web: 60, ios: 40 } },
    { date: "2026-10-02", value: 0, breakdown: { web: 0, ios: 0 } },
    { date: "2026-10-03", value: 150, breakdown: { web: 90, ios: 60 } },
    { date: "2026-10-04", value: 200, breakdown: { web: 120, ios: 80 } },
  ])
  const keys = ["web", "ios"]

  it("accumulates from the left edge of the visible window", () => {
    const rows = buildRows(all.slice(2), all, { cumulative: true, seriesKeys: keys })
    expect(rows.map((r) => r.cumulative)).toEqual([150, 350])
    expect(rows.map((r) => r.plotted)).toEqual([150, 350])
    expect(rows[1].series.web.cumulative).toBe(210)
  })

  it("plots daily values when cumulative is off", () => {
    const rows = buildRows(all, all, { cumulative: false, seriesKeys: keys })
    expect(rows.map((r) => r.plotted)).toEqual([100, 0, 150, 200])
    expect(rows.map((r) => r.cumulative)).toEqual([100, 100, 250, 450])
    expect(rows[3].series.ios.plotted).toBe(80)
  })

  it("computes day-over-day change from the full data, not just the window", () => {
    const rows = buildRows(all.slice(3), all, { cumulative: true, seriesKeys: keys })
    // 2026-10-04 vs 2026-10-03: web 90 -> 120 (+33%), ios 60 -> 80 (+33%)
    expect(rows[0].series.web.change).toBe(33)
    expect(rows[0].series.ios.change).toBe(33)
  })

  it("has no change for the first day or when the previous day was zero", () => {
    const rows = buildRows(all, all, { cumulative: true, seriesKeys: keys })
    expect(rows[0].series.web.change).toBeNull() // no previous day
    expect(rows[2].series.web.change).toBeNull() // previous day was 0, can't divide
  })

  it("reports a drop as a negative percent", () => {
    const rows = buildRows(all, all, { cumulative: true, seriesKeys: keys })
    expect(rows[1].series.web.change).toBe(-100) // 60 -> 0
    const down = sortPoints([
      { date: "2026-10-01", value: 200, breakdown: { web: 200 } },
      { date: "2026-10-02", value: 150, breakdown: { web: 150 } },
    ])
    expect(buildRows(down, down, { cumulative: false, seriesKeys: ["web"] })[1].series.web.change).toBe(-25)
  })

  it("works with no series", () => {
    const rows = buildRows(all, all, { cumulative: true, seriesKeys: [] })
    expect(rows[3].cumulative).toBe(450)
    expect(rows[3].series).toEqual({})
  })
})

describe("gridlines and labels", () => {
  it("anchors indices on the last item", () => {
    expect(anchoredIndices(10, 3)).toEqual([0, 3, 6, 9])
    expect(anchoredIndices(5, 1)).toEqual([0, 1, 2, 3, 4])
    expect(anchoredIndices(0, 1)).toEqual([])
  })

  it("draws a gridline per day up to eight weeks, then per week", () => {
    const daily = visibleWindow(sample(), 8).map((p) => p.key)
    expect(gridAndLabelKeys(daily, 1400).gridKeys).toHaveLength(56)
    const long = sortPoints(createSampleEvents({ days: 120 })).map((p) => p.key)
    const { gridKeys } = gridAndLabelKeys(long, 1400)
    expect(gridKeys).toHaveLength(Math.ceil(120 / 7))
    expect(gridKeys[gridKeys.length - 1]).toBe(long[long.length - 1])
  })

  it("keeps labels on the grid, anchored on the newest day, and never closer than the spacing", () => {
    const keys = visibleWindow(sample(), 8).map((p) => p.key)
    const width = 800
    const { gridKeys, labelTicks } = gridAndLabelKeys(keys, width)
    expect(labelTicks[labelTicks.length - 1]).toBe(keys[keys.length - 1])
    for (const t of labelTicks) expect(gridKeys).toContain(t)
    const pxPerPoint = (width - 70) / (keys.length - 1)
    const gaps = labelTicks.slice(1).map((t, i) => keys.indexOf(t) - keys.indexOf(labelTicks[i]))
    for (const g of gaps) expect(g * pxPerPoint).toBeGreaterThanOrEqual(64)
  })

  it("labels every day when there is room", () => {
    const keys = visibleWindow(sample(), 1).map((p) => p.key)
    expect(gridAndLabelKeys(keys, 1400).labelTicks).toEqual(keys)
  })
})

describe("series shares", () => {
  it("returns each series' share of the visible total", () => {
    const pts = sortPoints([{ date: "2026-10-01", value: 100, breakdown: { a: 50, b: 30, c: 20 } }])
    expect(seriesShares(pts, ["a", "b", "c"])).toEqual({ a: 50, b: 30, c: 20 })
  })

  it("is zero when there is nothing to share", () => {
    expect(seriesShares([], ["a", "b"])).toEqual({ a: 0, b: 0 })
  })
})

describe("sample data", () => {
  it("is deterministic", () => {
    expect(createSampleEvents()).toEqual(createSampleEvents())
    expect(createSampleEvents({ seed: 1 })).not.toEqual(createSampleEvents({ seed: 2 }))
  })

  it("covers eight weeks ending 2026-10-31, split across three platforms", () => {
    const data = createSampleEvents()
    expect(data).toHaveLength(56)
    expect(data[0].date).toBe("2026-09-06")
    expect(data[55].date).toBe("2026-10-31")
    for (const p of data) {
      const b = p.breakdown!
      expect(b.web + b.ios + b.android).toBe(p.value)
      expect(Math.min(b.web, b.ios, b.android)).toBeGreaterThanOrEqual(0)
    }
  })

  it("includes quiet days so the cumulative line has flat stretches", () => {
    expect(createSampleEvents().filter((p) => p.value === 0).length).toBeGreaterThan(8)
  })
})
