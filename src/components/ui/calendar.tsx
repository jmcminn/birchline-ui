import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth,
  endMonth,
  formatters,
  ...props
}: CalendarProps) {
  // Bound the month/year dropdowns to a sensible, overridable range.
  const currentYear = new Date().getFullYear()
  const resolvedStartMonth = startMonth ?? new Date(currentYear - 100, 0)
  const resolvedEndMonth = endMonth ?? new Date(currentYear + 10, 11)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      captionLayout={captionLayout}
      startMonth={resolvedStartMonth}
      endMonth={resolvedEndMonth}
      formatters={{
        // Abbreviated month names ("Jul") in the trigger and dropdown list.
        formatMonthDropdown: (month) => month.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "grid grid-cols-[auto_1fr_auto] items-center gap-y-4",
        month_caption: "flex items-center justify-center",
        caption_label: "inline-flex items-center gap-1 text-sm font-medium",
        // Month + year dropdown triggers, styled to read as plain text with a caret.
        dropdowns: "inline-flex items-center gap-1.5",
        dropdown_root: "relative inline-flex items-center rounded-sm px-1.5 py-1 transition-colors cursor-pointer hover:bg-warm-100",
        dropdown: "absolute inset-0 z-10 w-full cursor-pointer opacity-0",
        nav: "hidden",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "col-span-3 w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-sm w-9 font-medium text-[0.8rem]",
        week: "flex w-full mt-1",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-sm",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-sm [&:has(>.day-range-start)]:rounded-l-sm first:[&:has([aria-selected])]:rounded-l-sm last:[&:has([aria-selected])]:rounded-r-sm"
            : "[&:has([aria-selected])]:rounded-sm"
        ),
        day_button:
          "inline-flex items-center justify-center rounded-sm h-9 w-9 p-0 text-sm font-normal cursor-pointer hover:bg-accent",
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:rounded-sm",
        today: "bg-accent text-foreground rounded-sm",
        outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) => {
          if (orientation === "left") return <ChevronLeft className="h-4 w-4" />
          if (orientation === "right") return <ChevronRight className="h-4 w-4" />
          // Down caret for the month/year dropdown triggers.
          return <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground", chevronClassName)} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
