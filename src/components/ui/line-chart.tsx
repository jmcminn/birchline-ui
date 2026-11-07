import * as React from "react"
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Calendar, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  buildRows,
  clampWeeks,
  formatDateRange,
  formatTick,
  formatTooltipDate,
  gridAndLabelKeys,
  periodText,
  seriesShares,
  sortPoints,
  visibleWindow,
  weeksOfData,
  type ChartRow,
  type LineChartDataPoint,
} from "@/lib/line-chart-data"

export interface LineChartSeries {
  /** Key into each data point's `breakdown`. */
  key: string
  label: string
  /** Line, fill and legend colour. Use a token, e.g. `var(--color-chart-2)`. */
  color: string
  /** Colour on the dark tooltip. Defaults to `color`; pass a -400 hue if `color` is too dark on ink. */
  tooltipColor?: string
  icon?: React.ReactNode
}

export interface LineChartProps {
  data: LineChartDataPoint[]
  title: string
  /** Noun for the summary line and tooltip, e.g. "events". */
  unit?: string
  /** Line colour when no breakdown is shown. */
  color?: string
  /** Series for the breakdown. The breakdown toggle only appears when this is set. */
  series?: LineChartSeries[]
  /** Toggle label, e.g. "By Platform". The tooltip's first column heading drops the "By ". */
  breakdownLabel?: string
  breakdown?: boolean
  defaultBreakdown?: boolean
  onBreakdownChange?: (value: boolean) => void
  defaultCumulative?: boolean
  /** Weeks shown when the chart opens (clamped to the data). */
  defaultWeeks?: number
  height?: number
  className?: string
}

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : inner
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )
  return [current, set] as const
}

function tint(color: string, pct: number) {
  return `color-mix(in oklab, ${color} ${pct}%, transparent)`
}

function SeriesTag({ series }: { series: LineChartSeries }) {
  const color = series.tooltipColor ?? series.color
  return (
    <span
      className="inline-flex h-[26px] items-center gap-1 whitespace-nowrap rounded-md border pl-2 pr-3 text-xs font-semibold"
      style={{ backgroundColor: tint(color, 15), color, borderColor: tint(color, 40) }}
    >
      {series.icon ? (
        <span className="shrink-0 [&>svg]:size-4" aria-hidden="true">
          {series.icon}
        </span>
      ) : null}
      {series.label}
    </span>
  )
}

function formatChange(change: number | null) {
  if (change === null) return "—"
  return `${change >= 0 ? "+" : ""}${change}%`
}

function changeClass(change: number | null) {
  if (change === null) return "text-white/50"
  if (change > 0) return "text-green-400"
  if (change < 0) return "text-red-400"
  return "text-white/70"
}

export interface LineChartTooltipContentProps {
  row: ChartRow
  series?: LineChartSeries[]
  breakdown: boolean
  unit: string
  seriesHeading: string
}

/** The dark hover card. Exported so it can be tested and reused without Recharts. */
export function LineChartTooltipContent({ row, series, breakdown, unit, seriesHeading }: LineChartTooltipContentProps) {
  const hasSeries = !!series?.length
  const th = "px-2 py-1 text-xs font-medium text-white/70"
  return (
    <div data-slot="line-chart-tooltip" className={cn("rounded-xl border border-ink bg-ink p-2 text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)]", hasSeries ? "min-w-60" : "min-w-44")}>
      <div className="mb-2 flex items-center gap-2 px-2 pb-2 pt-1 text-base font-semibold">
        <Calendar className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {formatTooltipDate(row.date)}
      </div>
      <div className="px-2 py-1">
        {hasSeries ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={cn(th, "pl-0 text-left")}>{seriesHeading}</th>
                <th className={cn(th, "text-right")}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</th>
                <th className={cn(th, "pr-0 text-right")}>% Change</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => {
                const cell = row.series[s.key]
                // With the breakdown on, values match the plotted lines (cumulative or
                // daily). With it off, the card shows each series' daily value.
                const value = breakdown ? cell.plotted : cell.daily
                return (
                  <tr key={s.key}>
                    <td className="py-2 pr-2 font-medium">
                      <SeriesTag series={s} />
                    </td>
                    <td className="px-2 py-2 text-right font-semibold">{value.toLocaleString()}</td>
                    <td className={cn("py-2 pl-2 text-right font-semibold", changeClass(cell.change))}>{formatChange(cell.change)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="py-1.5 pr-4 font-medium text-white/90">Daily</td>
                <td className="py-1.5 pl-2 text-right font-semibold">{row.daily.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4 font-medium text-white/90">Total</td>
                <td className="py-1.5 pl-2 text-right font-semibold">{row.cumulative.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function GradientDef({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.2} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  )
}

const dotProps = (color: string) => ({ r: 3, fill: color, strokeWidth: 0 })
const activeDotProps = (color: string) => ({ r: 6, fill: color, stroke: "var(--color-background)", strokeWidth: 2 })

function LineChart({
  data,
  title,
  unit = "events",
  color = "var(--color-chart-1)",
  series,
  breakdownLabel = "By Platform",
  breakdown: breakdownProp,
  defaultBreakdown = false,
  onBreakdownChange,
  defaultCumulative = true,
  defaultWeeks = 4,
  height = 300,
  className,
}: LineChartProps) {
  const uid = React.useId().replace(/:/g, "")
  const hasSeries = !!series?.length
  const [breakdown, setBreakdown] = useControllable(breakdownProp, defaultBreakdown, onBreakdownChange)
  const showBreakdown = hasSeries && breakdown
  const [cumulative, setCumulative] = React.useState(defaultCumulative)
  const [requestedWeeks, setRequestedWeeks] = React.useState(defaultWeeks)
  const [toast, setToast] = React.useState<{ range: string; period: string } | null>(null)
  const [chartWidth, setChartWidth] = React.useState(800)

  const seriesKeys = React.useMemo(() => (series ?? []).map((s) => s.key), [series])
  const sorted = React.useMemo(() => sortPoints(data), [data])
  // The zoom-out ceiling comes from the data, so the chart never claims a wider range than it has.
  const maxWeeks = weeksOfData(sorted)
  const weeks = clampWeeks(requestedWeeks, maxWeeks)
  const windowPoints = React.useMemo(() => visibleWindow(sorted, weeks), [sorted, weeks])
  const rows = React.useMemo(
    () => buildRows(windowPoints, sorted, { cumulative, seriesKeys }),
    [windowPoints, sorted, cumulative, seriesKeys],
  )
  const { gridKeys, labelTicks } = React.useMemo(
    () => gridAndLabelKeys(rows.map((r) => r.key), chartWidth),
    [rows, chartWidth],
  )
  const shares = React.useMemo(() => seriesShares(windowPoints, seriesKeys), [windowPoints, seriesKeys])
  const total = rows.length ? rows[rows.length - 1].cumulative : 0

  const zoomTo = (next: number) => {
    setRequestedWeeks(next)
    const nextWindow = visibleWindow(sorted, next)
    if (nextWindow.length) {
      setToast({
        range: formatDateRange(nextWindow[0].date, nextWindow[nextWindow.length - 1].date),
        period: periodText(nextWindow),
      })
    }
  }

  React.useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // Keep the last message mounted while it fades out.
  const [shownToast, setShownToast] = React.useState(toast)
  if (toast && toast !== shownToast) setShownToast(toast)

  const seriesHeading = breakdownLabel.replace(/^By\s+/i, "")
  const breakdownId = `${uid}-breakdown`
  const cumulativeId = `${uid}-cumulative`
  const gradientId = `${uid}-fill`

  return (
    <Card data-slot="line-chart" className={cn("p-4", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total.toLocaleString()} {unit} over {periodText(windowPoints)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {hasSeries ? (
            <div className="flex items-center gap-2">
              <Label htmlFor={breakdownId} className="cursor-pointer font-normal">
                {breakdownLabel}:
              </Label>
              <Checkbox id={breakdownId} checked={breakdown} onCheckedChange={(v) => setBreakdown(v === true)} />
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Label htmlFor={cumulativeId} className="cursor-pointer font-normal">
              Cumulative:
            </Label>
            <Checkbox id={cumulativeId} checked={cumulative} onCheckedChange={(v) => setCumulative(v === true)} />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="Zoom in"
              disabled={weeks <= 1}
              onClick={() => zoomTo(weeks - 1)}
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="Zoom out"
              disabled={weeks >= maxWeeks}
              onClick={() => zoomTo(weeks + 1)}
            >
              <Minus className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity",
            toast ? "opacity-100 duration-1000 ease-out" : "opacity-0 duration-1500 ease-in",
          )}
        >
          {shownToast ? (
            <div className="rounded-md bg-foreground/90 px-4 py-2 text-center text-background">
              <div className="text-base font-bold">{shownToast.range}</div>
              <div className="text-xs">{shownToast.period}</div>
            </div>
          ) : null}
        </div>

        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">No data available for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" onResize={(w) => setChartWidth(w)}>
            <ComposedChart data={rows} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                verticalCoordinatesGenerator={({ xAxis }) => {
                  const scale = xAxis?.scale
                  if (!scale) return []
                  const half = typeof scale.bandwidth === "function" ? scale.bandwidth() / 2 : 0
                  return gridKeys
                    .map((key) => scale.map(key))
                    .filter((x): x is number => typeof x === "number" && Number.isFinite(x))
                    .map((x) => x + half)
                }}
              />
              <XAxis
                dataKey="key"
                ticks={labelTicks}
                interval={0}
                tickFormatter={formatTick}
                // Room for the last label, which is centred on the newest day.
                padding={{ right: 12 }}
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => value.toLocaleString()}
              />
              <Tooltip
                cursor={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <LineChartTooltipContent
                      row={payload[0].payload as ChartRow}
                      series={series}
                      breakdown={showBreakdown}
                      unit={unit}
                      seriesHeading={seriesHeading}
                    />
                  )
                }}
              />
              {showBreakdown && series
                ? [
                    <defs key="fills">
                      {series.map((s) => (
                        <GradientDef key={s.key} id={`${gradientId}-${s.key}`} color={s.color} />
                      ))}
                    </defs>,
                    ...series.map((s) => (
                      <Area
                        key={`fill-${s.key}`}
                        type="monotone"
                        dataKey={(r: ChartRow) => r.series[s.key].plotted}
                        stroke="none"
                        fill={`url(#${gradientId}-${s.key})`}
                        fillOpacity={1}
                        dot={false}
                        activeDot={false}
                        tooltipType="none"
                        legendType="none"
                      />
                    )),
                    ...series.map((s) => (
                      <Line
                        key={`line-${s.key}`}
                        type="monotone"
                        dataKey={(r: ChartRow) => r.series[s.key].plotted}
                        name={s.label}
                        stroke={s.color}
                        strokeWidth={2}
                        dot={dotProps(s.color)}
                        activeDot={activeDotProps(s.color)}
                      />
                    )),
                  ]
                : [
                    <defs key="fill">
                      <GradientDef id={gradientId} color={color} />
                    </defs>,
                    <Area
                      key="fill-value"
                      type="monotone"
                      dataKey="plotted"
                      stroke="none"
                      fill={`url(#${gradientId})`}
                      fillOpacity={1}
                      dot={false}
                      activeDot={false}
                      tooltipType="none"
                      legendType="none"
                    />,
                    <Line
                      key="line-value"
                      type="monotone"
                      dataKey="plotted"
                      name={title}
                      stroke={color}
                      strokeWidth={2}
                      dot={dotProps(color)}
                      activeDot={activeDotProps(color)}
                    />,
                  ]}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {showBreakdown && series ? (
        <ul data-slot="line-chart-legend" className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-3">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
              <span className="size-3 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
              {s.label} ({shares[s.key]}%)
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  )
}

export { LineChart }
