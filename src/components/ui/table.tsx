import * as React from "react"
import { cn } from "@/lib/utils"

type TableDensity = "compact" | "default" | "comfortable" | "spacious"

const densityPadding: Record<TableDensity, string> = {
  compact: "py-1 px-4",
  default: "py-2.5 px-4",
  comfortable: "py-4 px-4",
  spacious: "py-6 px-4",
}

const TableDensityContext = React.createContext<TableDensity>("default")

function useTableDensity() {
  return React.useContext(TableDensityContext)
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { density?: TableDensity }
>(({ className, density = "default", children, ...props }, ref) => (
  <TableDensityContext.Provider value={density}>
    <div className="relative w-full overflow-x-auto overflow-y-visible">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  </TableDensityContext.Provider>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const density = useTableDensity()
    return (
      <th
        ref={ref}
        className={cn(
          densityPadding[density],
          "text-left align-middle font-medium text-muted-foreground bg-gray-100/50 [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    )
  }
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const density = useTableDensity()
    return (
      <td
        ref={ref}
        className={cn(
          densityPadding[density],
          "align-middle [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    )
  }
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
export type { TableDensity }
