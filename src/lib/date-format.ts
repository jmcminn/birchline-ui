import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Show the year unless the toggle is off AND the date falls in the current year.
export function formatSelectedDate(date: Date, showCurrentYear: boolean) {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()
  return format(date, showCurrentYear || !isCurrentYear ? "MMM d, yyyy" : "MMM d")
}

// Range label for the "Date picker - range" button. Same month collapses to "Nov 10–24";
// different months read "Nov 25 – Dec 10". The year follows the same rule as formatSelectedDate,
// except a range that crosses years always shows both years. Returns null when nothing is picked.
export function formatSelectedRange(range: DateRange | undefined, showCurrentYear: boolean): string | null {
  if (!range?.from) return null
  let { from, to } = range
  if (!to) {
    // Start only: waiting on an end date.
    return `${formatSelectedDate(from, showCurrentYear)} \u2013`
  }
  if (to < from) [from, to] = [to, from]
  if (from.getTime() === to.getTime()) return formatSelectedDate(from, showCurrentYear)

  const sameYear = from.getFullYear() === to.getFullYear()
  const sameMonth = sameYear && from.getMonth() === to.getMonth()
  const thisYear = new Date().getFullYear()
  if (!sameYear) return `${format(from, "MMM d, yyyy")} \u2013 ${format(to, "MMM d, yyyy")}`
  const showYear = showCurrentYear || from.getFullYear() !== thisYear
  const year = showYear ? `, ${format(to, "yyyy")}` : ""
  if (sameMonth) return `${format(from, "MMM d")}\u2013${format(to, "d")}${year}`
  return `${format(from, "MMM d")} \u2013 ${format(to, "MMM d")}${year}`
}
