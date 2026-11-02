/**
 * Pure data helpers for the LineChart component: windowing (zoom), cumulative
 * totals, per-series breakdown, day-over-day change and gridline anchoring.
 * No React or Recharts in here, so all of it is unit-testable without layout.
 */

const DAY_MS = 86_400_000

export interface LineChartDataPoint {
  /** A Date, or a "YYYY-MM-DD" string (read as that local calendar day). */
  date: Date | string
  /** The value for that day. */
  value: number
  /** That day's value per series key, e.g. `{ web: 120, ios: 80 }`. */
  breakdown?: Record<string, number>
}

export interface DayPoint {
  date: Date
  /** Local calendar day, "YYYY-MM-DD". Stable across time zones. */
  key: string
  value: number
  breakdown: Record<string, number>
}

export interface SeriesCell {
  /** That day's own value. */
  daily: number
  /** Running total across the visible window. */
  cumulative: number
  /** What the line plots: cumulative or daily, depending on the toggle. */
  plotted: number
  /** Day-over-day change in percent, or null when there is no usable previous day. */
  change: number | null
}

export interface ChartRow {
  key: string
  date: Date
  daily: number
  cumulative: number
  /** What the single line plots: cumulative or daily, depending on the toggle. */
  plotted: number
  series: Record<string, SeriesCell>
}

/**
 * "YYYY-MM-DD" strings are calendar days, so read them as local midnight.
 * `new Date("2026-10-31")` would be UTC midnight, which shows as the previous
 * evening in any time zone west of UTC and shifts every label by one day.
 */
export function parseDay(input: Date | string): Date {
  if (input instanceof Date) return new Date(input.getTime())
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(input)
}

export function dayKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function addDays(date: Date, days: number): Date {
  const out = new Date(date.getTime())
  out.setDate(out.getDate() + days)
  return out
}

/** Normalise, drop invalid dates, sort oldest to newest. */
export function sortPoints(data: LineChartDataPoint[]): DayPoint[] {
  return data
    .map((p) => {
      const date = parseDay(p.date)
      return { date, key: dayKey(date), value: p.value, breakdown: p.breakdown ?? {} }
    })
    .filter((p) => !Number.isNaN(p.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

/** Whole weeks of history in the data (at least 1). This is the zoom-out ceiling. */
export function weeksOfData(sorted: DayPoint[]): number {
  if (sorted.length < 2) return 1
  const spanDays = (sorted[sorted.length - 1].date.getTime() - sorted[0].date.getTime()) / DAY_MS
  return Math.max(1, Math.ceil(spanDays / 7))
}

/** Points inside the last `weeks` weeks, ending on the newest day (inclusive on both ends). */
export function visibleWindow(sorted: DayPoint[], weeks: number): DayPoint[] {
  if (sorted.length === 0) return []
  const end = sorted[sorted.length - 1].date
  const start = addDays(end, -weeks * 7)
  return sorted.filter((p) => p.date >= start && p.date <= end)
}

export function clampWeeks(weeks: number, maxWeeks: number): number {
  return Math.min(Math.max(1, Math.round(weeks)), Math.max(1, maxWeeks))
}

/**
 * Rows for the chart. Cumulative totals restart at the left edge of the visible
 * window, so zooming changes the totals as well as the span. Day-over-day change
 * looks at the previous day in the FULL data, so the first visible day still has
 * a change when it has history.
 */
export function buildRows(
  windowPoints: DayPoint[],
  allPoints: DayPoint[],
  options: { cumulative: boolean; seriesKeys: string[] },
): ChartRow[] {
  const { cumulative, seriesKeys } = options
  const indexByKey = new Map(allPoints.map((p, i) => [p.key, i]))
  let running = 0
  const seriesRunning: Record<string, number> = Object.fromEntries(seriesKeys.map((k) => [k, 0]))

  return windowPoints.map((point) => {
    running += point.value
    const idx = indexByKey.get(point.key) ?? -1
    const prev = idx > 0 ? allPoints[idx - 1] : undefined

    const series: Record<string, SeriesCell> = {}
    for (const k of seriesKeys) {
      const daily = point.breakdown[k] ?? 0
      seriesRunning[k] += daily
      const before = prev ? (prev.breakdown[k] ?? 0) : undefined
      series[k] = {
        daily,
        cumulative: seriesRunning[k],
        plotted: cumulative ? seriesRunning[k] : daily,
        change: before && before > 0 ? Math.round(((daily - before) / before) * 100) : null,
      }
    }

    return {
      key: point.key,
      date: point.date,
      daily: point.value,
      cumulative: running,
      plotted: cumulative ? running : point.value,
      series,
    }
  })
}

// Gridlines are drawn from the data (not from the x-axis labels) so they stay
// evenly spaced: one per day up to 8 weeks, one per week beyond that. Both are
// anchored on the newest day.
export const DAILY_GRID_MAX_POINTS = 56
export const MIN_LABEL_SPACING_PX = 64
export const Y_AXIS_AND_MARGIN_PX = 70

/** Indices counted back from the last item, returned oldest first. */
export function anchoredIndices(count: number, step: number): number[] {
  const out: number[] = []
  for (let i = count - 1; i >= 0; i -= step) out.push(i)
  return out.reverse()
}

export function gridAndLabelKeys(keys: string[], chartWidth: number): { gridKeys: string[]; labelTicks: string[] } {
  const n = keys.length
  const gridStep = n <= DAILY_GRID_MAX_POINTS ? 1 : 7
  const plotWidth = Math.max(chartWidth - Y_AXIS_AND_MARGIN_PX, 1)
  const pxPerPoint = n > 1 ? plotWidth / (n - 1) : plotWidth
  // Labels sit on the same anchored grid, spaced so they never overlap.
  const labelStep = gridStep * Math.max(1, Math.ceil(MIN_LABEL_SPACING_PX / (pxPerPoint * gridStep)))
  return {
    gridKeys: anchoredIndices(n, gridStep).map((i) => keys[i]),
    labelTicks: anchoredIndices(n, labelStep).map((i) => keys[i]),
  }
}

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }

export function formatTick(key: string): string {
  return parseDay(key).toLocaleDateString("en-US", SHORT_DATE)
}

export function formatDateRange(start: Date, end: Date): string {
  return `${start.toLocaleDateString("en-US", SHORT_DATE)} - ${end.toLocaleDateString("en-US", SHORT_DATE)}`
}

export function formatTooltipDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

/** "29 days / 4 weeks" for the points on screen. */
export function periodText(windowPoints: DayPoint[]): string {
  const n = windowPoints.length
  if (n === 0) return "0 days / 0 weeks"
  const span = windowPoints[n - 1].date.getTime() - windowPoints[0].date.getTime()
  const days = Math.round(span / DAY_MS) + 1
  const weeks = Math.round(days / 7)
  return `${days} days / ${weeks} week${weeks !== 1 ? "s" : ""}`
}

/** Each series' share of the visible window's total, as whole percents. */
export function seriesShares(windowPoints: DayPoint[], seriesKeys: string[]): Record<string, number> {
  const totals = Object.fromEntries(
    seriesKeys.map((k) => [k, windowPoints.reduce((sum, p) => sum + (p.breakdown[k] ?? 0), 0)]),
  )
  const grand = seriesKeys.reduce((sum, k) => sum + totals[k], 0)
  return Object.fromEntries(seriesKeys.map((k) => [k, grand > 0 ? Math.round((totals[k] / grand) * 100) : 0]))
}
