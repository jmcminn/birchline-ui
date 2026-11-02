import { addDays, dayKey, parseDay, type LineChartDataPoint } from "@/lib/line-chart-data"

/** Small seeded PRNG (mulberry32): same seed, same numbers, on every load and in tests. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface SampleEventsOptions {
  /** Number of days, ending on `end`. Default 56 (8 weeks, so zoom has room). */
  days?: number
  /** Last day, "YYYY-MM-DD". */
  end?: string
  seed?: number
}

/**
 * Synthetic daily event counts split across web, iOS and Android. A steady
 * climb with a quiet spell every nine days, so the cumulative line has flat
 * stretches. Entirely generated: no real analytics data.
 */
export function createSampleEvents({ days = 56, end = "2026-10-31", seed = 42 }: SampleEventsOptions = {}): LineChartDataPoint[] {
  const rand = seeded(seed)
  const last = parseDay(end)
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(last, -(days - 1 - i))
    const quiet = i % 9 === 4 || i % 9 === 5
    const total = quiet ? 0 : Math.round(820 + i * 7 + rand() * 640)
    const web = Math.round(total * (0.5 + rand() * 0.06))
    const ios = Math.round(total * (0.3 + rand() * 0.04))
    const android = total - web - ios
    return { date: dayKey(date), value: total, breakdown: { web, ios, android } }
  })
}
