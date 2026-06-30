import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableDensity } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarItem, SidebarFooter } from "@/components/ui/sidebar"
import { UserSelector, type User } from "@/components/ui/user-selector"
import { MoreHorizontal, Plus, Search, Trash2, Copy, Pencil, ArrowRight, Info, PanelRight, Bell, CalendarDays, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, LayoutGrid, List, Home, Settings, FolderOpen, Inbox, FileText, BarChart3, AlertCircle, CheckCircle, AlertTriangle, InfoIcon, Terminal, ChevronRight, Check, Palette, ArrowUpDown, ArrowUp, ArrowDown, X, GripVertical } from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type ColumnOrderState,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16">
      <h2 className="font-serif text-[26px] font-medium tracking-tight mb-2">{title}</h2>
      <Separator className="mb-7" />
      {children}
    </section>
  )
}

function ComponentBlock({ name, children, align, headerRight, gap }: { name: string; children: React.ReactNode; align?: string; headerRight?: React.ReactNode; gap?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-base text-gray-500">&lt;{name} /&gt;</div>
        {headerRight}
      </div>
      <div className={`flex flex-wrap ${align === "start" ? "items-start" : align === "end" ? "items-end" : "items-center"} ${gap ?? "gap-4"} p-6 bg-white border border-gray-300 rounded-md`}>
        {children}
      </div>
    </div>
  )
}

function LabeledItem({ label, subtitle, children }: { label: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      {children}
      <div className="flex flex-col items-center">
        <span className="font-mono text-[11px] text-gray-500">{label}</span>
        {subtitle && <span className="font-mono text-[11px] text-gray-500">{subtitle}</span>}
      </div>
    </div>
  )
}

function ColorSwatch({ color, hex, token, semantic, noBorder }: { color: string; hex: string; token: string; semantic?: string; noBorder?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-sm shrink-0"
        style={{
          backgroundColor: color,
          border: noBorder ? "1.5px solid transparent" : "1.5px solid var(--color-gray-300)",
        }}
      />
      <div>
        <span className="font-mono text-xs text-gray-700 block">{hex}</span>
        <span className="font-mono text-[11px] text-gray-500 block">{token}</span>
        {semantic && <span className="font-mono text-[11px] text-gray-500 block">{semantic}</span>}
      </div>
    </div>
  )
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (query.length < 2) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-highlight text-ink rounded-xs px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function DraggableTableHeader({
  header,
  draggingColumnId,
  tableRef,
}: {
  header: import("@tanstack/react-table").Header<Task, unknown>
  draggingColumnId: string | null
  tableRef: React.RefObject<HTMLTableElement | null>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
  })

  const isBeingDragged = draggingColumnId === header.column.id

  const style: React.CSSProperties = {
    width: header.getSize(),
    transform: CSS.Translate?.toString(transform) ?? undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
  }

  const overlayHeight = tableRef.current ? `${tableRef.current.offsetHeight}px` : "999px"

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        "group",
        header.column.getCanSort() && "select-none",
        (isDragging || isBeingDragged) && "z-10",
      )}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "flex items-center gap-1.5 flex-1",
            header.column.getCanSort() && "cursor-pointer",
            (isBeingDragged || header.column.getIsResizing()) && "text-clay",
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getCanSort() && !draggingColumnId && (
            header.column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-clay" />
            ) : header.column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5 text-clay" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500/50" />
            )
          )}
        </div>
        <button
          className={cn(
            "cursor-grab active:cursor-grabbing absolute right-4 top-1/2 -translate-y-1/2",
            isBeingDragged ? "text-clay opacity-100" : "text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100",
            "transition-opacity",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
              "group-hover:bg-gray-300 hover:!bg-clay/30",
              header.column.getIsResizing() && "!bg-clay/50",
            )}
          />
        )}
      </div>
      {(isBeingDragged || header.column.getIsResizing()) && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-clay/10" style={{ height: overlayHeight }} />
          <div className="pointer-events-none absolute left-0 top-0 w-0.5 border-l-2 border-dashed" style={{ borderColor: "var(--color-clay)", height: overlayHeight }} />
          <div className="pointer-events-none absolute right-0 top-0 w-0.5 border-r-2 border-dashed" style={{ borderColor: "var(--color-clay)", height: overlayHeight }} />
        </>
      )}
    </TableHead>
  )
}

// Show the year unless the toggle is off AND the date falls in the current year.
function formatSelectedDate(date: Date, showCurrentYear: boolean) {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()
  return format(date, showCurrentYear || !isCurrentYear ? "MMM d, yyyy" : "MMM d")
}

function DatePickerDemo({ showCurrentYear }: { showCurrentYear: boolean }) {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)
  const [hadDateOnOpen, setHadDateOnOpen] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setHadDateOnOpen(!!date)
        setOpen(o)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-auto justify-start text-left font-normal px-2", !date && "text-gray-500")}>
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? formatSelectedDate(date, showCurrentYear) : "Pick a date"}
          {date && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setDate(undefined) }}
              className="ml-2 text-gray-500 hover:text-ink transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          footer={
            hadDateOnOpen ? (
              <div className="flex flex-col items-center mt-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setDate(undefined)
                    setOpen(false)
                  }}
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Clear Selected Date
                </button>
              </div>
            ) : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}

function DatePickerTasksDemo({ showCurrentYear }: { showCurrentYear: boolean }) {
  const [date, setDate] = useState<Date>()
  const [month, setMonth] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const [hadDateOnOpen, setHadDateOnOpen] = useState(false)
  const pickRelative = (days: number) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + days)
    setDate(d)
    setMonth(d)
  }
  const quickBtn = "h-7 px-2.5 text-xs bg-transparent"
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setHadDateOnOpen(!!date)
        setOpen(o)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-auto justify-start text-left font-normal px-2", !date && "text-gray-500")}>
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? formatSelectedDate(date, showCurrentYear) : "Pick a date"}
          {date && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setDate(undefined) }}
              className="ml-2 text-gray-500 hover:text-ink transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
          footer={
            <div className="flex flex-col items-center gap-2 mt-2 pt-3 border-t border-gray-200">
              <div className="flex justify-center gap-2">
                <Button variant="outline" className={quickBtn} onClick={() => pickRelative(0)}>Today</Button>
                <Button variant="outline" className={quickBtn} onClick={() => pickRelative(1)}>Tomorrow</Button>
                <Button variant="outline" className={quickBtn} onClick={() => pickRelative(3)}>In 3 Days</Button>
              </div>
              {hadDateOnOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setDate(undefined)
                    setOpen(false)
                  }}
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Clear Selected Date
                </button>
              )}
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  )
}

const birchlineColors = [
  { name: "Ivory", hex: "#FAF9F5" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Clay", hex: "#D97757" },
  { name: "Ink", hex: "#141413" },
  { name: "Oat", hex: "#E3DACC" },
  { name: "Gray 100", hex: "#F0EEE6" },
  { name: "Gray 300", hex: "#D1CFC5" },
  { name: "Gray 500", hex: "#87867F" },
  { name: "Gray 700", hex: "#3D3D3A" },
  { name: "Green", hex: "#788C5D" },
  { name: "Orange", hex: "#C78E3F" },
  { name: "Red", hex: "#B04A4A" },
  { name: "Blue", hex: "#5C7CA3" },
  { name: "Plum", hex: "#7B6B8A" },
  { name: "Teal", hex: "#5B8E8A" },
  { name: "Light Yellow", hex: "#F5E6B8" },
]

// Per-menu default background/color selections
const COLOR_SECTION_DEFAULT = "#FAF9F5" // Ivory
const TYPE_SECTION_DEFAULT = "#FFFFFF" // White
const TYPE_COLOR_DEFAULT = "#141413" // Ink

// Typography token specs applied to the "Filled" Textarea sample
const TEXTAREA_TYPE_SPECS: Record<string, string> = {
  body: "text-base leading-[1.55]",
  small: "text-sm leading-[1.5]",
  fine: "text-[13px] leading-[1.45]",
}
const SEPARATOR_COLOR_DEFAULT = "#D1CFC5" // Gray 300
const SEPARATOR_BG_DEFAULT = "#FFFFFF" // White

function ColorMenuItems({
  value,
  defaultHex,
  onSelect,
}: {
  value: string
  defaultHex: string
  onSelect: (hex: string) => void
}) {
  return (
    <>
      {birchlineColors.map((c) => (
        <DropdownMenuItem key={c.hex} onClick={() => onSelect(c.hex)} className="gap-3">
          <span className="w-4 shrink-0 flex items-center justify-center">
            {value === c.hex && <Check className="h-3.5 w-3.5 text-clay" />}
          </span>
          <div
            className="w-6 h-6 rounded-xs border border-black/10 shrink-0"
            style={{ backgroundColor: c.hex }}
          />
          <span className="flex-1 text-sm">
            {c.name}
            {c.hex === defaultHex && <span className="text-gray-500"> (default)</span>}
          </span>
          <span className="font-mono text-[11px] text-gray-500">{c.hex}</span>
        </DropdownMenuItem>
      ))}
    </>
  )
}

type Task = {
  id: string
  title: string
  status: "In Progress" | "Done" | "Todo" | "Backlog"
  priority: "High" | "Medium" | "Low"
  assignee: string
}

const tasks: Task[] = [
  { id: "TASK-001", title: "Design onboarding flow", status: "In Progress", priority: "High", assignee: "JM" },
  { id: "TASK-002", title: "Set up CI/CD pipeline", status: "Done", priority: "Medium", assignee: "AK" },
  { id: "TASK-003", title: "Write API documentation", status: "Todo", priority: "Low", assignee: "SR" },
  { id: "TASK-004", title: "Fix login redirect bug", status: "In Progress", priority: "High", assignee: "JM" },
  { id: "TASK-005", title: "Add dark mode support", status: "Backlog", priority: "Medium", assignee: "LP" },
  { id: "TASK-006", title: "Migrate to PostgreSQL 16", status: "Todo", priority: "High", assignee: "AK" },
  { id: "TASK-007", title: "Implement SSO integration", status: "In Progress", priority: "High", assignee: "SR" },
  { id: "TASK-008", title: "Refactor notification service", status: "Backlog", priority: "Low", assignee: "LP" },
  { id: "TASK-009", title: "Add export to CSV", status: "Done", priority: "Medium", assignee: "JM" },
  { id: "TASK-010", title: "Performance audit homepage", status: "Todo", priority: "Medium", assignee: "AK" },
]

const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 }
const statusOrder: Record<string, number> = { "In Progress": 0, Todo: 1, Backlog: 2, Done: 3 }

const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
    size: 100,
    minSize: 70,
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 280,
    minSize: 120,
  },
  {
    accessorKey: "status",
    header: "Status",
    sortingFn: (a, b) => (statusOrder[a.getValue("status") as string] ?? 99) - (statusOrder[b.getValue("status") as string] ?? 99),
    size: 140,
    minSize: 90,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    sortingFn: (a, b) => (priorityOrder[a.getValue("priority") as string] ?? 99) - (priorityOrder[b.getValue("priority") as string] ?? 99),
    size: 120,
    minSize: 80,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    enableSorting: false,
    enableColumnFilter: false,
    size: 90,
    minSize: 60,
  },
]

const sampleUsers: User[] = [
  { id: "u1", name: "Bob Jones", email: "bob@company.com", initials: "BJ", role: "Admin" },
  { id: "u2", name: "Karen Davis", email: "karen@company.com", initials: "KD", role: "Collaborator" },
  { id: "u3", name: "Grace Martinez", email: "grace@company.com", initials: "GM", role: "Collaborator" },
  { id: "u4", name: "Eva Chen", email: "eva@vendor.com", initials: "EC", role: "Guest" },
  { id: "u5", name: "Paul Lee", email: "paul@vendor.com", initials: "PL", role: "Guest" },
  { id: "u6", name: "Alice Smith", email: "alice@company.com", initials: "AS", role: "Admin" },
  { id: "u7", name: "Carol Hernandez-White", email: "carol@company.com", initials: "CH", role: "Collaborator" },
  { id: "u8", name: "David Park", email: "david@company.com", initials: "DP", role: "Collaborator" },
  { id: "u9", name: "Nina Patel", email: "nina@company.com", initials: "NP", role: "Admin" },
  { id: "u10", name: "Marcus Rivera", email: "marcus@vendor.com", initials: "MR", role: "Guest" },
  { id: "u11", name: "Sasha Kowalski", email: "sasha@company.com", initials: "SK", role: "Collaborator" },
  { id: "u12", name: "Tomas Nguyen", email: "tomas@vendor.com", initials: "TN", role: "Guest" },
  { id: "u13", name: "Lily Okafor", email: "lily@company.com", initials: "LO", role: "Collaborator" },
  { id: "u14", name: "James Whitfield", email: "james@company.com", initials: "JW", role: "Admin" },
  { id: "u15", name: "Rachel Tanaka", email: "rachel@vendor.com", initials: "RT", role: "Guest" },
  { id: "u16", name: "Omar Fitzgerald", email: "omar@company.com", initials: "OF", role: "Collaborator" },
  { id: "u17", name: "Hannah Berg", email: "hannah@company.com", initials: "HB", role: "Collaborator" },
  { id: "u18", name: "Victor Chang", email: "victor@vendor.com", initials: "VC", role: "Guest" },
  { id: "u19", name: "Priya Sharma", email: "priya@company.com", initials: "PS", role: "Admin" },
]

const recentUserIds = ["u1", "u2", "u3", "u4", "u5"]

/* ── Border Chase Animation (web port) ──────────────────────────────── */

const CHASE_DEFAULTS = {
  strokeWidth: 3,
  segmentPercent: 39,
  laps: 1.5,
  duration: 2000,
  fadeSteps: 8,
  fadePx: 64,
  glowDepth: 24,
  glowRings: 10,
  borderRadius: 12,
  glowOpacity: 0.18,
  colors: ["#4285F4", "#EA4335", "#FBBC04", "#34A853", "#4285F4"],
};

function BorderChaseCard({
  strokeWidth = CHASE_DEFAULTS.strokeWidth,
  segmentPercent = CHASE_DEFAULTS.segmentPercent,
  laps = CHASE_DEFAULTS.laps,
  duration = CHASE_DEFAULTS.duration,
  fadeSteps = CHASE_DEFAULTS.fadeSteps,
  fadePx = CHASE_DEFAULTS.fadePx,
  glowDepth = CHASE_DEFAULTS.glowDepth,
  glowRings = CHASE_DEFAULTS.glowRings,
  borderRadius = CHASE_DEFAULTS.borderRadius,
  glowOpacity = CHASE_DEFAULTS.glowOpacity,
  colors = CHASE_DEFAULTS.colors,
  playing,
  onAnimationEnd,
}: {
  strokeWidth?: number;
  segmentPercent?: number;
  laps?: number;
  duration?: number;
  fadeSteps?: number;
  fadePx?: number;
  glowDepth?: number;
  glowRings?: number;
  borderRadius?: number;
  glowOpacity?: number;
  colors?: string[];
  playing: boolean;
  onAnimationEnd?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const sw = strokeWidth;
  const r = Math.max(0, borderRadius - sw / 2);
  const half = sw / 2;
  const pw = Math.max(0, w - sw);
  const ph = Math.max(0, h - sw);

  const straightH = Math.max(0, pw - 2 * r);
  const straightV = Math.max(0, ph - 2 * r);
  const perimeter = 2 * straightH + 2 * straightV + 2 * Math.PI * r;
  const segmentLength = perimeter * (segmentPercent / 100);

  const path = useMemo(() => {
    if (w <= 0 || h <= 0) return "";
    return [
      `M ${half + r} ${half}`,
      `L ${half + pw - r} ${half}`,
      `A ${r} ${r} 0 0 1 ${half + pw} ${half + r}`,
      `L ${half + pw} ${half + ph - r}`,
      `A ${r} ${r} 0 0 1 ${half + pw - r} ${half + ph}`,
      `L ${half + r} ${half + ph}`,
      `A ${r} ${r} 0 0 1 ${half} ${half + ph - r}`,
      `L ${half} ${half + r}`,
      `A ${r} ${r} 0 0 1 ${half + r} ${half}`,
    ].join(" ");
  }, [w, h, r, half, pw, ph]);

  // Build gradient stops from colors
  const gradientStops = colors.map((c, i) => ({
    offset: `${(i / (colors.length - 1)) * 100}%`,
    color: c,
  }));

  // Build glow ring specs
  const rings = useMemo(() => {
    const result: { strokeWidth: number; opacity: number }[] = [];
    for (let i = 0; i < glowRings; i++) {
      const t = i / (glowRings - 1); // 0 = nearest, 1 = deepest
      const ringSw = sw + 2 + (glowDepth - sw - 2) * (1 - t);
      const opacity = (0.01 + 0.19 * Math.pow(1 - t, 2)) * glowOpacity;
      result.push({ strokeWidth: ringSw, opacity: Math.min(1, opacity) });
    }
    return result.reverse(); // widest/faintest first
  }, [sw, glowDepth, glowRings, glowOpacity]);

  // Build fade mask layers
  const stepPx = fadeSteps > 0 ? fadePx / fadeSteps : 0;
  const fadeLayers = useMemo(() => {
    const layers: { len: number; offset: number }[] = [];
    for (let i = 0; i < fadeSteps; i++) {
      layers.push({
        len: Math.max(1, segmentLength - stepPx * 2 * i),
        offset: stepPx * i,
      });
    }
    return layers;
  }, [segmentLength, fadeSteps, stepPx]);

  // CSS animation via keyframes
  const animId = useRef(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (playing && perimeter > 0) {
      animId.current += 1;
      setAnimKey(animId.current);
      const timer = setTimeout(() => {
        onAnimationEnd?.();
      }, duration + 300);
      return () => clearTimeout(timer);
    }
  }, [playing, perimeter, duration, onAnimationEnd]);

  const totalTravel = perimeter * laps;

  // CSS keyframes — one per fade layer (each starts at a different offset)
  const keyframesCSS = useMemo(() => {
    if (!playing || animKey === 0 || perimeter === 0) return "";
    let css = `
      @keyframes chase-dash-${animKey} {
        from { stroke-dashoffset: 0; }
        to { stroke-dashoffset: ${-totalTravel}; }
      }
      @keyframes chase-fade-in-${animKey} {
        0% { opacity: 0; }
        5% { opacity: 1; }
        85% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    fadeLayers.forEach((layer, i) => {
      css += `
        @keyframes chase-fade-layer-${animKey}-${i} {
          from { stroke-dashoffset: ${-layer.offset}; }
          to { stroke-dashoffset: ${-totalTravel - layer.offset}; }
        }
      `;
    });
    return css;
  }, [playing, animKey, totalTravel, perimeter, fadeLayers]);

  const containerAnimStyle: React.CSSProperties = playing && animKey > 0
    ? { animation: `chase-fade-in-${animKey} ${duration + 300}ms ease forwards` }
    : { opacity: 0 };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {playing && animKey > 0 && <style>{keyframesCSS}</style>}
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Border Chase</CardTitle>
          <CardDescription>Multi-color animated border with inner glow diffusion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20 text-sm text-gray-500">
            Tap Play to preview
          </div>
        </CardContent>
      </Card>
      {w > 0 && h > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={containerAnimStyle}
        >
          <svg width={w} height={h} className="absolute inset-0">
            <defs>
              <linearGradient id={`chase-grad-${animKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
                {gradientStops.map((s, i) => (
                  <stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </linearGradient>
              <clipPath id={`pill-clip-${animKey}`}>
                <rect x={0} y={0} width={w} height={h} rx={borderRadius} ry={borderRadius} />
              </clipPath>
              <mask id={`fade-mask-${animKey}`} maskUnits="userSpaceOnUse" x={-2} y={-2} width={w + 4} height={h + 4}>
                {fadeLayers.map((layer, i) => (
                  <path
                    key={i}
                    d={path}
                    stroke="white"
                    strokeWidth={40}
                    fill="none"
                    strokeLinecap="butt"
                    opacity={1 / fadeSteps}
                    strokeDasharray={`${layer.len} ${Math.max(1, perimeter - layer.len)}`}
                    style={
                      playing && animKey > 0
                        ? { animation: `chase-fade-layer-${animKey}-${i} ${duration}ms linear forwards` }
                        : { strokeDashoffset: -layer.offset }
                    }
                  />
                ))}
              </mask>
            </defs>
            <g mask={`url(#fade-mask-${animKey})`}>
              <g clipPath={`url(#pill-clip-${animKey})`}>
                {rings.map((ring, i) => (
                  <path
                    key={i}
                    d={path}
                    stroke={`url(#chase-grad-${animKey})`}
                    strokeWidth={ring.strokeWidth}
                    fill="none"
                    opacity={ring.opacity}
                  />
                ))}
              </g>
              <path
                d={path}
                stroke={`url(#chase-grad-${animKey})`}
                strokeWidth={sw}
                fill="none"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── Chase palette definitions ──────────────────────────────────────── */

const CHASE_PALETTES = {
  default: {
    label: "Default",
    colors: ["#4285F4", "#EA4335", "#FBBC04", "#34A853", "#4285F4"],
    swatches: [
      { name: "Blue", hex: "#4285F4" },
      { name: "Red", hex: "#EA4335" },
      { name: "Yellow", hex: "#FBBC04" },
      { name: "Green", hex: "#34A853" },
    ],
  },
  birchline: {
    label: "Birchline UI",
    colors: ["#D97757", "#788C5D", "#5B8E8A", "#7B6B8A", "#D97757"],
    swatches: [
      { name: "Clay", hex: "#D97757" },
      { name: "Green", hex: "#788C5D" },
      { name: "Teal", hex: "#5B8E8A" },
      { name: "Plum", hex: "#7B6B8A" },
    ],
  },
} as const;

type ChasePaletteKey = keyof typeof CHASE_PALETTES;

function BorderChaseDemo() {
  const [strokeWidth, setStrokeWidth] = useState(CHASE_DEFAULTS.strokeWidth);
  const [segmentPercent, setSegmentPercent] = useState(CHASE_DEFAULTS.segmentPercent);
  const [laps, setLaps] = useState(CHASE_DEFAULTS.laps);
  const [speed, setSpeed] = useState(CHASE_DEFAULTS.duration / 1000);
  const duration = speed * 1000;
  const [fadeSteps, setFadeSteps] = useState(CHASE_DEFAULTS.fadeSteps);
  const [fadePx, setFadePx] = useState(CHASE_DEFAULTS.fadePx);
  const [glowDepth, setGlowDepth] = useState(CHASE_DEFAULTS.glowDepth);
  const [glowRings, setGlowRings] = useState(CHASE_DEFAULTS.glowRings);
  const [borderRadius, setBorderRadius] = useState(CHASE_DEFAULTS.borderRadius);
  const [glowOpacity, setGlowOpacity] = useState(CHASE_DEFAULTS.glowOpacity);
  const [paletteKey, setPaletteKey] = useState<ChasePaletteKey>("default");
  const [playing, setPlaying] = useState(false);
  const activePalette = CHASE_PALETTES[paletteKey];

  const handlePlay = useCallback(() => setPlaying(true), []);
  const handleEnd = useCallback(() => setPlaying(false), []);

  const controls: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; unit?: string }[] = [
    { label: "Stroke Width", value: strokeWidth, set: setStrokeWidth, min: 1, max: 8, step: 0.5, unit: "px" },
    { label: "Chase Line Length", value: segmentPercent, set: setSegmentPercent, min: 10, max: 80, step: 1, unit: "%" },
    { label: "Chase Laps", value: laps, set: setLaps, min: 0.5, max: 4, step: 0.25 },
    { label: "Chase Line Speed", value: speed, set: setSpeed, min: 1, max: 5, step: 0.25, unit: "s" },
    { label: "Start / End Fade Steps", value: fadeSteps, set: setFadeSteps, min: 2, max: 30, step: 1 },
    { label: "Start / End Line Fade Distance", value: fadePx, set: setFadePx, min: 8, max: 120, step: 4, unit: "px" },
    { label: "Inner Glow Depth", value: glowDepth, set: setGlowDepth, min: 4, max: 48, step: 2, unit: "px" },
    { label: "Inner Glow Rings", value: glowRings, set: setGlowRings, min: 2, max: 16, step: 1 },
    { label: "Border Radius", value: borderRadius, set: setBorderRadius, min: 0, max: 32, step: 1, unit: "px" },
    { label: "Glow Opacity", value: glowOpacity, set: setGlowOpacity, min: 0.02, max: 0.34, step: 0.02, unit: "×" },
  ];

  const paletteDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="flex -space-x-1">
            {activePalette.swatches.slice(0, 4).map((s) => (
              <div
                key={s.hex}
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: s.hex }}
              />
            ))}
          </div>
          <Palette className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Color palette</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(CHASE_PALETTES) as ChasePaletteKey[]).map((key) => {
          const palette = CHASE_PALETTES[key];
          const isActive = paletteKey === key;
          return (
            <DropdownMenuSub key={key}>
              <DropdownMenuSubTrigger
                className="gap-3"
                onClick={() => setPaletteKey(key)}
              >
                <span className="w-4 shrink-0 flex items-center justify-center">
                  {isActive && <Check className="h-3.5 w-3.5 text-clay" />}
                </span>
                <div className="flex -space-x-1 shrink-0">
                  {palette.swatches.slice(0, 4).map((s) => (
                    <div
                      key={s.hex}
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
                <span className="flex-1 text-sm">{palette.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[200px]">
                <DropdownMenuLabel className="text-[11px] text-gray-500">Colors</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {palette.swatches.map((s) => (
                  <DropdownMenuItem key={s.hex} className="gap-3 pointer-events-none opacity-100">
                    <div
                      className="w-5 h-5 rounded-xs border border-black/10 shrink-0"
                      style={{ backgroundColor: s.hex }}
                    />
                    <span className="flex-1 text-sm">{s.name}</span>
                    <span className="font-mono text-[11px] text-gray-500">{s.hex}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ComponentBlock name="BorderChase" align="start" headerRight={paletteDropdown}>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex gap-6 items-start">
          {/* Preview card */}
          <div className="w-[350px] h-[220px] shrink-0">
            <BorderChaseCard
              strokeWidth={strokeWidth}
              segmentPercent={segmentPercent}
              laps={laps}
              duration={duration}
              fadeSteps={fadeSteps}
              fadePx={fadePx}
              glowDepth={glowDepth}
              glowRings={glowRings}
              borderRadius={borderRadius}
              glowOpacity={glowOpacity}
              colors={[...activePalette.colors]}
              playing={playing}
              onAnimationEnd={handleEnd}
            />
          </div>

          {/* Controls */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4 min-w-[400px]">
            {controls.map((c) => (
              <div key={c.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-[11px] text-gray-500">
                    {c.value}{c.unit ?? ""}
                  </span>
                </div>
                <input
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={c.value}
                  onChange={(e) => c.set(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-clay"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="sm" onClick={handlePlay} disabled={playing}>
            {playing ? "Playing…" : "Play"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStrokeWidth(CHASE_DEFAULTS.strokeWidth);
              setSegmentPercent(CHASE_DEFAULTS.segmentPercent);
              setLaps(CHASE_DEFAULTS.laps);
              setSpeed(CHASE_DEFAULTS.duration / 1000);
              setFadeSteps(CHASE_DEFAULTS.fadeSteps);
              setFadePx(CHASE_DEFAULTS.fadePx);
              setGlowDepth(CHASE_DEFAULTS.glowDepth);
              setGlowRings(CHASE_DEFAULTS.glowRings);
              setBorderRadius(CHASE_DEFAULTS.borderRadius);
              setGlowOpacity(CHASE_DEFAULTS.glowOpacity);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </ComponentBlock>
  );
}

/* ── Main App ──────────────────────────────────────────────────────── */

type Scheme = "default" | "bright"

function App() {
  const [scheme, setScheme] = useState<Scheme>(
    () => (localStorage.getItem("birchline-scheme") as Scheme) || "default"
  )
  useEffect(() => {
    const root = document.documentElement
    if (scheme === "default") root.removeAttribute("data-theme")
    else root.setAttribute("data-theme", scheme)
    localStorage.setItem("birchline-scheme", scheme)
  }, [scheme])

  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [switchOn, setSwitchOn] = useState(true)
  const [tableDensity, setTableDensity] = useState<TableDensity>("default")
  const [colorSectionBg, setColorSectionBg] = useState(COLOR_SECTION_DEFAULT)
  const [typeSectionBg, setTypeSectionBg] = useState(TYPE_SECTION_DEFAULT)
  const [typeColor, setTypeColor] = useState(TYPE_COLOR_DEFAULT)
  const [showCurrentYear, setShowCurrentYear] = useState(true)
  const [textareaToken, setTextareaToken] = useState("body")
  const [showMenuName, setShowMenuName] = useState(true)
  const [separatorColor, setSeparatorColor] = useState(SEPARATOR_COLOR_DEFAULT)
  const [separatorBg, setSeparatorBg] = useState(SEPARATOR_BG_DEFAULT)
  const [selectedUserId, setSelectedUserId] = useState<string | null>("u7")
  const [multiSelectedUserIds, setMultiSelectedUserIds] = useState<string[]>(["u7", "u3"])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    taskColumns.map((c) => (c as { accessorKey: string }).accessorKey)
  )
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null)
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>(["floor-1", "floor-2"])
  const [multiSelectOpen, setMultiSelectOpen] = useState(false)
  const [multiSearchValues, setMultiSearchValues] = useState<string[]>(["floor-1", "floor-2"])
  const [multiSearchOpen, setMultiSearchOpen] = useState(false)
  const [multiSearchQuery, setMultiSearchQuery] = useState("")
  const tableRef = useRef<HTMLTableElement>(null)

  const columns = useMemo(() => taskColumns, [])

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, columnFilters, globalFilter, columnOrder },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragEndEvent) {
    setDraggingColumnId(event.active.id as string)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function handleDragEnd() {
    setDraggingColumnId(null)
  }

  return (
    <TooltipProvider>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <Toaster />

        <header className="mb-12">
          <div className="flex items-start justify-between gap-4 mb-1.5">
            <h1 className="font-serif text-[40px] font-medium tracking-tight">
              Birchline UI
            </h1>
            <Tabs
              value={scheme}
              onValueChange={(v) => setScheme(v as Scheme)}
              className="shrink-0"
            >
              <TabsList>
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="bright">Bright</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <p className="text-gray-500 text-sm">
            Birchline UI design system is a reskin of shadcn/ui components by{" "}
            <a href="https://x.com/jasonmcminn" target="_blank" rel="noreferrer" className="text-clay hover:underline">Jason McMinn</a>. It is a fork of{" "}
            <a href="https://x.com/trq212" target="_blank" rel="noreferrer" className="text-clay hover:underline">Thariq’s</a> original{" "}
            <a href="https://thariqs.github.io/html-effectiveness/05-design-system.html" target="_blank" rel="noreferrer" className="text-clay hover:underline">Birchline design system</a>, expanded with additional capabilities and components.
          </p>
        </header>

        {/* ── COLOR ── */}
        <section id="color" className="mb-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-[26px] font-medium tracking-tight">Color</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <div className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: colorSectionBg }} />
                  <span className="text-xs text-gray-500">Background</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>Background color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ColorMenuItems
                  value={colorSectionBg}
                  defaultHex={COLOR_SECTION_DEFAULT}
                  onSelect={setColorSectionBg}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator className="mb-7" />
          <div className="rounded-md p-6 -mx-6 transition-colors" style={{ backgroundColor: colorSectionBg }}>
            <div className="max-w-[1280px] mx-auto grid grid-cols-3 gap-10">
              <div>
                <div className="font-mono text-sm uppercase tracking-wider text-gray-500 mb-4">Primary</div>
                <div className="flex flex-col gap-5">
                  <ColorSwatch color="#D97757" hex="#D97757" token="--clay" semantic="primary, ring" noBorder />
                  <ColorSwatch color="#141413" hex="#141413" token="--ink" semantic="foreground" noBorder />
                  <ColorSwatch color="#FAF9F5" hex="#FAF9F5" token="--ivory" semantic="background" />
                  <ColorSwatch color="#E3DACC" hex="#E3DACC" token="--oat" noBorder />
                </div>
              </div>
              <div>
                <div className="font-mono text-sm uppercase tracking-wider text-gray-500 mb-4">Neutral</div>
                <div className="flex flex-col gap-5">
                  <ColorSwatch color="#FFFFFF" hex="#FFFFFF" token="--white" semantic="card, popover" />
                  <ColorSwatch color="#F0EEE6" hex="#F0EEE6" token="--gray-100" semantic="secondary, muted, accent" />
                  <ColorSwatch color="#D1CFC5" hex="#D1CFC5" token="--gray-300" semantic="border, input" noBorder />
                  <ColorSwatch color="#87867F" hex="#87867F" token="--gray-500" semantic="muted-foreground" noBorder />
                  <ColorSwatch color="#3D3D3A" hex="#3D3D3A" token="--gray-700" semantic="secondary-fg, accent-fg" noBorder />
                </div>
              </div>
              <div>
                <div className="font-mono text-sm uppercase tracking-wider text-gray-500 mb-4">Semantic</div>
                <div className="flex flex-col gap-5">
                  <ColorSwatch color="#788C5D" hex="#788C5D" token="--green" semantic="success" noBorder />
                  <ColorSwatch color="#C78E3F" hex="#C78E3F" token="--orange" semantic="warning" noBorder />
                  <ColorSwatch color="#B04A4A" hex="#B04A4A" token="--red" semantic="danger, destructive" noBorder />
                  <ColorSwatch color="#5C7CA3" hex="#5C7CA3" token="--blue" semantic="info" noBorder />
                  <ColorSwatch color="#F5E6B8" hex="#F5E6B8" token="--light-yellow" semantic="highlight" />
                  <ColorSwatch color="#7B6B8A" hex="#7B6B8A" token="--plum" noBorder />
                  <ColorSwatch color="#5B8E8A" hex="#5B8E8A" token="--teal" noBorder />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TYPOGRAPHY ── */}
        <section id="typography" className="mb-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-[26px] font-medium tracking-tight">Typography</h2>
            <div className="flex items-center gap-2">
              {/* Text color menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <div className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: typeColor }} />
                    <span className="text-xs text-gray-500">Text</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <DropdownMenuLabel>Text color</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ColorMenuItems
                    value={typeColor}
                    defaultHex={TYPE_COLOR_DEFAULT}
                    onSelect={setTypeColor}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Background color menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <div className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: typeSectionBg }} />
                    <span className="text-xs text-gray-500">Background</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <DropdownMenuLabel>Background color</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ColorMenuItems
                    value={typeSectionBg}
                    defaultHex={TYPE_SECTION_DEFAULT}
                    onSelect={setTypeSectionBg}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator className="mb-7" />
          <div className="rounded-md p-6 -mx-6 transition-colors">
          <div className="border border-gray-300 rounded-md overflow-hidden transition-colors" style={{ backgroundColor: typeSectionBg, color: typeColor }}>
            {[
              { cls: "font-serif text-5xl leading-[1.1] font-medium tracking-tight", name: "Display", face: "Georgia", weight: "500 (Medium)", size: "48", lineSpacing: "1.1" },
              { cls: "font-serif text-[32px] leading-[1.2] font-medium tracking-tight", name: "Heading 1", face: "Georgia", weight: "500 (Medium)", size: "32", lineSpacing: "1.2" },
              { cls: "font-serif text-2xl leading-[1.3] font-medium", name: "Heading 2", face: "Georgia", weight: "500 (Medium)", size: "24", lineSpacing: "1.3" },
              { cls: "font-serif text-[20px] leading-[1.3] font-normal", name: "Heading 3", face: "Georgia", weight: "400 (Regular)", size: "20", lineSpacing: "1.3" },
              { cls: "font-sans text-base leading-[1.55]", name: "Body", face: "Inter", weight: "430 (Regular)", size: "16", lineSpacing: "1.55", text: "Review milestones, assign owners, and surface blockers before they cascade." },
              { cls: "font-sans text-sm leading-[1.5]", name: "Small", face: "Inter", weight: "430 (Regular)", size: "14", lineSpacing: "1.5", text: "Review milestones, assign owners, and surface blockers before they cascade." },
              { cls: "font-sans text-[13px] leading-[1.45]", name: "Fine", face: "Inter", weight: "430 (Regular)", size: "13", lineSpacing: "1.45", text: "Review milestones, assign owners, and surface blockers before they cascade." },
              { cls: "font-sans text-xs leading-[1.4] font-medium text-gray-500", name: "Caption", face: "Inter", weight: "500 (Medium)", size: "12", lineSpacing: "1.4", text: "UPDATED 2 HOURS AGO" },
              { cls: "font-mono text-xs leading-[1.4] text-ink", name: "Code", face: "JetBrains Mono", weight: "400 (Regular)", size: "12", lineSpacing: "1.4", text: "Small type monospaced label" },
            ].map((row, i, arr) => (
              <div key={row.name} className={`flex items-start justify-between gap-6 px-6 py-5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`flex-1 min-w-0 truncate ${row.cls}`}>
                  {row.text ?? "Plan the week ahead"}
                </div>
                <div className="font-mono text-xs text-gray-500 text-left shrink-0 w-[240px]">
                  <span className="text-gray-700 block mb-1.5">{row.name}</span>
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                    <span>Font Face</span><span className="text-gray-700">{row.face}</span>
                    <span>Font Weight</span><span className="text-gray-700">{row.weight}</span>
                    <span>Font Size</span><span className="text-gray-700">{row.size}</span>
                    <span>Line Spacing</span><span className="text-gray-700">{row.lineSpacing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ── SPACING ── */}
        <Section id="spacing" title="Spacing">
          <div className="flex items-end gap-7 p-7 bg-white border border-gray-300 rounded-md overflow-x-auto">
            {[
              { px: 4, token: "--sp-1" },
              { px: 8, token: "--sp-2" },
              { px: 12, token: "--sp-3" },
              { px: 16, token: "--sp-4" },
              { px: 24, token: "--sp-5" },
              { px: 32, token: "--sp-6" },
              { px: 48, token: "--sp-7" },
              { px: 64, token: "--sp-8" },
            ].map((s) => (
              <div key={s.token} className="flex flex-col items-center gap-2.5 shrink-0">
                <div className="bg-clay rounded-[3px] h-3.5" style={{ width: s.px }} />
                <div className="font-mono text-[11px] text-gray-700 text-center">
                  {s.px}<span className="block text-gray-500">{s.token}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── RADIUS & ELEVATION ── */}
        <Section id="shape" title="Radius & Elevation">
          <div className="flex flex-wrap gap-5 mb-7">
            {[
              { r: "4px", token: "--r-xs" },
              { r: "8px", token: "--r-sm" },
              { r: "12px", token: "--r-md" },
              { r: "20px", token: "--r-lg" },
            ].map((item) => (
              <div
                key={item.token}
                className="w-[120px] h-[88px] bg-oat border border-gray-300 flex items-end p-3"
                style={{ borderRadius: item.r }}
              >
                <div className="font-mono text-[11px] text-gray-700">
                  {item.r}<span className="block text-gray-500">{item.token}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-5">
            {[
              { shadow: "0 1px 2px rgba(20,20,19,0.06)", token: "--shadow-sm", meta: "0 1px 2px / 6%" },
              { shadow: "0 4px 10px rgba(20,20,19,0.08)", token: "--shadow-md", meta: "0 4px 10px / 8%" },
              { shadow: "0 12px 28px rgba(20,20,19,0.12)", token: "--shadow-lg", meta: "0 12px 28px / 12%" },
            ].map((item) => (
              <div
                key={item.token}
                className="w-40 h-24 bg-white rounded-md flex items-end p-3.5"
                style={{ boxShadow: item.shadow }}
              >
                <div className="font-mono text-[11px] text-gray-700">
                  {item.token}<span className="block text-gray-500">{item.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── COMPONENTS ── */}
        <Section id="components" title="Core Components">
          <ComponentBlock name="Button">
            <LabeledItem label="Primary"><Button>Create task</Button></LabeledItem>
            <LabeledItem label="Secondary"><Button variant="secondary">Cancel</Button></LabeledItem>
            <LabeledItem label="Ghost"><Button variant="ghost">Skip</Button></LabeledItem>
            <LabeledItem label="Destructive"><Button variant="destructive">Delete</Button></LabeledItem>
            <LabeledItem label="Outline"><Button variant="outline">Export</Button></LabeledItem>
            <LabeledItem label="With icon">
              <Button><Plus className="mr-2 h-4 w-4" /> New task</Button>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Input" align="start">
            <LabeledItem label="Placeholder">
              <div className="w-[260px]">
                <Input placeholder="Search tasks…" />
              </div>
            </LabeledItem>
            <LabeledItem label="Filled">
              <div className="w-[260px]">
                <Input defaultValue="Weekly planning" />
              </div>
            </LabeledItem>
            <LabeledItem label="With icon">
              <div className="w-[260px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <Input className="pl-9" placeholder="Search…" />
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Textarea" align="start" headerRight={
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Type Size</span>
              <Select value={textareaToken} onValueChange={setTextareaToken}>
                <SelectTrigger className="w-[140px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="body">Body</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="fine">Fine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }>
            <LabeledItem label="Placeholder">
              <div className="w-[340px]">
                <Textarea placeholder="Add a description…" />
              </div>
            </LabeledItem>
            <LabeledItem label="Filled">
              <div className="w-[340px]">
                <Textarea className={TEXTAREA_TYPE_SPECS[textareaToken]} defaultValue="Review milestones, assign owners, and surface blockers before they cascade. Make sure to update the project board after the meeting." />
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Select" align="start">
            <LabeledItem label="Placeholder">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a status…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </LabeledItem>
            <LabeledItem label="Single Select">
              <Select defaultValue="review">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </LabeledItem>
            <LabeledItem label="Multi-Select">
              <Popover open={multiSelectOpen} onOpenChange={setMultiSelectOpen}>
                <PopoverTrigger asChild>
                  <button className="flex h-10 w-[200px] items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100 transition-colors focus:border-clay focus:ring-[3px] focus:ring-clay/15 focus:outline-none">
                    <span className={multiSelectValues.length > 0 ? "text-ink truncate" : "text-gray-500"}>
                      {multiSelectValues.length > 1
                        ? `Sheets (${multiSelectValues.length})`
                        : multiSelectValues.length === 1
                          ? (() => { const labels: Record<string, string> = { "site-plan": "Site Plan", "floor-1": "Floor 1", "floor-2": "Floor 2", "roof": "Roof", "electrical": "Electrical", "plumbing": "Plumbing", "window-schedule": "Window Schedule" }; return labels[multiSelectValues[0]] ?? multiSelectValues[0] })()
                        : "Choose sheets…"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-fit max-w-[400px] p-1" align="start">
                  {[
                    { value: "site-plan", label: "01 - Site Plan" },
                    { value: "floor-1", label: "02 - Floor 1" },
                    { value: "floor-2", label: "03 - Floor 2" },
                    { value: "roof", label: "04 - Roof" },
                    { value: "electrical", label: "05 - Electrical" },
                    { value: "plumbing", label: "06 - Plumbing" },
                    { value: "window-schedule", label: "07 - Window Schedule" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xs px-3 py-2 text-sm hover:bg-gray-100 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <Checkbox
                        checked={multiSelectValues.includes(item.value)}
                        onCheckedChange={(checked) => {
                          setMultiSelectValues(prev =>
                            checked
                              ? [...prev, item.value]
                              : prev.filter(v => v !== item.value)
                          )
                        }}
                      />
                      {item.label}
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </LabeledItem>
            <LabeledItem label="Multi-Select w/ Search">
              <Popover open={multiSearchOpen} onOpenChange={(v) => { setMultiSearchOpen(v); if (!v) setMultiSearchQuery("") }}>
                <PopoverTrigger asChild>
                  <button className="flex h-10 w-[200px] items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100 transition-colors focus:border-clay focus:ring-[3px] focus:ring-clay/15 focus:outline-none">
                    <span className={multiSearchValues.length > 0 ? "text-ink truncate" : "text-gray-500"}>
                      {multiSearchValues.length > 1
                        ? `Sheets (${multiSearchValues.length})`
                        : multiSearchValues.length === 1
                          ? (() => { const labels: Record<string, string> = { "site-plan": "Site Plan", "floor-1": "Floor 1", "floor-2": "Floor 2", "roof": "Roof", "electrical": "Electrical", "plumbing": "Plumbing", "window-schedule": "Window Schedule" }; return labels[multiSearchValues[0]] ?? multiSearchValues[0] })()
                        : "Choose sheets…"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-fit max-w-[400px] p-0" align="start">
                  <Command filter={(value, search) => value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0}>
                    <div className="relative">
                      <CommandInput
                        placeholder="Search sheets"
                        value={multiSearchQuery}
                        onValueChange={setMultiSearchQuery}
                      />
                      {multiSearchQuery.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMultiSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ink transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <CommandList>
                      <CommandEmpty>No sheets found.</CommandEmpty>
                      <CommandGroup>
                        {[
                          { value: "site-plan", label: "01 - Site Plan" },
                          { value: "floor-1", label: "02 - Floor 1" },
                          { value: "floor-2", label: "03 - Floor 2" },
                          { value: "roof", label: "04 - Roof" },
                          { value: "electrical", label: "05 - Electrical" },
                          { value: "plumbing", label: "06 - Plumbing" },
                          { value: "window-schedule", label: "07 - Window Schedule" },
                        ].map((item) => (
                          <CommandItem
                            key={item.value}
                            value={item.label}
                            onSelect={() => {
                              setMultiSearchValues(prev =>
                                prev.includes(item.value)
                                  ? prev.filter(v => v !== item.value)
                                  : [...prev, item.value]
                              )
                            }}
                            className="gap-2.5 px-3 py-2"
                          >
                            <Checkbox checked={multiSearchValues.includes(item.value)} tabIndex={-1} className="pointer-events-none" />
                            <span><HighlightText text={item.label} query={multiSearchQuery} /></span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="UserSelector" align="start" gap="gap-16">
            <LabeledItem label="Basic - Single Select" subtitle="With selection">
              <UserSelector
                users={sampleUsers}
                recentIds={recentUserIds}
                value={selectedUserId}
                onSelect={setSelectedUserId}
                onInvite={() => toast("Invite user flow triggered")}
                showNoAssignee={false}
                clearable
                noAssigneeLabel="Select User"
              />
            </LabeledItem>
            <LabeledItem label="Basic - Multi-Select" subtitle="With selection">
              <UserSelector
                users={sampleUsers}
                recentIds={recentUserIds}
                multiSelect
                values={multiSelectedUserIds}
                onValuesChange={setMultiSelectedUserIds}
                onInvite={() => toast("Invite user flow triggered")}
                clearable
                showNoAssignee={false}
                noAssigneeLabel="Select Assignee"
              />
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="DropdownMenu" headerRight={
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              Display menu name
              <Switch checked={showMenuName} onCheckedChange={setShowMenuName} />
            </label>
          }>
            <LabeledItem label="Action menu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {showMenuName && <DropdownMenuLabel>Actions</DropdownMenuLabel>}
                  {showMenuName && <DropdownMenuSeparator />}
                  <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit task</DropdownMenuItem>
                  <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                  <DropdownMenuItem><ArrowRight className="mr-2 h-4 w-4" /> Move to…</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-danger focus:text-danger">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </LabeledItem>
            <LabeledItem label="Action menu w/ submenu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {showMenuName && <DropdownMenuLabel>Actions</DropdownMenuLabel>}
                  {showMenuName && <DropdownMenuSeparator />}
                  <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit task</DropdownMenuItem>
                  <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger><ArrowRight className="mr-2 h-4 w-4" /> Move to…</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-[200px]">
                      {showMenuName && <DropdownMenuLabel>Projects</DropdownMenuLabel>}
                      {showMenuName && <DropdownMenuSeparator />}
                      <DropdownMenuItem><FolderOpen className="mr-2 h-4 w-4" /> Q3 Roadmap</DropdownMenuItem>
                      <DropdownMenuItem><FolderOpen className="mr-2 h-4 w-4" /> Marketing Site</DropdownMenuItem>
                      <DropdownMenuItem><FolderOpen className="mr-2 h-4 w-4" /> Mobile App</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Plus className="mr-2 h-4 w-4" /> New project…</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-danger focus:text-danger">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Checkbox">
            <LabeledItem label="Unchecked">
              <div className="flex items-center gap-2.5">
                <Checkbox id="c1" checked={checked1} onCheckedChange={(v) => setChecked1(v === true)} />
                <Label htmlFor="c1" className="cursor-pointer">Notify assignees</Label>
              </div>
            </LabeledItem>
            <LabeledItem label="Checked">
              <div className="flex items-center gap-2.5">
                <Checkbox id="c2" checked={checked2} onCheckedChange={(v) => setChecked2(v === true)} />
                <Label htmlFor="c2" className="cursor-pointer">Archive on complete</Label>
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Switch">
            <LabeledItem label="On">
              <div className="flex items-center gap-3">
                <Switch id="s1" checked={switchOn} onCheckedChange={setSwitchOn} />
                <Label htmlFor="s1" className="cursor-pointer">Enable notifications</Label>
              </div>
            </LabeledItem>
            <LabeledItem label="Off">
              <div className="flex items-center gap-3">
                <Switch id="s2" />
                <Label htmlFor="s2" className="cursor-pointer">Dark mode</Label>
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Badge">
            <LabeledItem label="Default"><Badge variant="default">Draft</Badge></LabeledItem>
            <LabeledItem label="Accent"><Badge variant="accent">In review</Badge></LabeledItem>
            <LabeledItem label="Success"><Badge variant="success">Done</Badge></LabeledItem>
            <LabeledItem label="Warning"><Badge variant="warning">Overdue</Badge></LabeledItem>
            <LabeledItem label="Destructive"><Badge variant="destructive">Failed</Badge></LabeledItem>
            <LabeledItem label="Info"><Badge variant="info">Info</Badge></LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Badge — Removable">
            <LabeledItem label="Default"><Badge variant="default" onRemove={() => {}} removeLabel="Remove Draft">Draft</Badge></LabeledItem>
            <LabeledItem label="Accent"><Badge variant="accent" onRemove={() => {}} removeLabel="Remove In review">In review</Badge></LabeledItem>
            <LabeledItem label="Success"><Badge variant="success" onRemove={() => {}} removeLabel="Remove Done">Done</Badge></LabeledItem>
            <LabeledItem label="Warning"><Badge variant="warning" onRemove={() => {}} removeLabel="Remove Overdue">Overdue</Badge></LabeledItem>
            <LabeledItem label="Destructive"><Badge variant="destructive" onRemove={() => {}} removeLabel="Remove Failed">Failed</Badge></LabeledItem>
            <LabeledItem label="Info"><Badge variant="info" onRemove={() => {}} removeLabel="Remove Info">Info</Badge></LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Avatar" gap="gap-16" align="end">
            <LabeledItem label="Image" subtitle="40px">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=JM&backgroundColor=D97757&textColor=ffffff" alt="JM" />
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Fallback" subtitle="40px">
              <Avatar>
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Small" subtitle="32px">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">SR</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Group" subtitle="32px">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarFallback className="text-xs">JM</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarFallback className="text-xs">AK</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarFallback className="text-xs">SR</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarFallback className="text-xs bg-gray-300 text-gray-700">+2</AvatarFallback>
                </Avatar>
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Tooltip">
            <LabeledItem label="Info">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View project details</p>
                </TooltipContent>
              </Tooltip>
            </LabeledItem>
            <LabeledItem label="Notification">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>3 unread notifications</p>
                </TooltipContent>
              </Tooltip>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Toast">
            <LabeledItem label="Success">
              <Button
                variant="outline"
                onClick={() => toast.success("Task created", { description: "Weekly planning has been added to your board." })}
              >
                Show success toast
              </Button>
            </LabeledItem>
            <LabeledItem label="Error">
              <Button
                variant="outline"
                onClick={() => toast.error("Something went wrong", { description: "Please try again later." })}
              >
                Show error toast
              </Button>
            </LabeledItem>
            <LabeledItem label="With action">
              <Button
                variant="outline"
                onClick={() => toast("Task updated", {
                  description: "Status changed to In Progress.",
                  action: { label: "Undo", onClick: () => toast("Undone!") },
                })}
              >
                Toast with action
              </Button>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Dialog">
            <LabeledItem label="Form modal">
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Create task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new task</DialogTitle>
                  <DialogDescription>Add a new task to your project board.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="task-title">Title</Label>
                    <Input id="task-title" placeholder="Task title…" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="task-desc">Description</Label>
                    <Textarea id="task-desc" placeholder="Add details…" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Select defaultValue="todo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button>Create task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="AlertDialog">
            <LabeledItem label="Destructive confirm">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete project</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project and all associated tasks. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-danger text-white hover:bg-danger-hover">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Sheet">
            <LabeledItem label="Right panel">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline"><PanelRight className="mr-2 h-4 w-4" /> Open detail panel</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Task details</SheetTitle>
                  <SheetDescription>View and edit task information.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sheet-title">Title</Label>
                    <Input id="sheet-title" defaultValue="Design onboarding flow" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sheet-desc">Description</Label>
                    <Textarea id="sheet-desc" defaultValue="Create wireframes and prototypes for the new user onboarding experience." />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Assignee</Label>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">JM</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Jason McMinn</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Badge variant="accent" className="w-fit">In Progress</Badge>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Table" align="start" headerRight={
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Row density</span>
              <Select value={tableDensity} onValueChange={(v) => setTableDensity(v as TableDensity)}>
                <SelectTrigger className="w-[140px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }>
            <div className="w-full">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  {(sorting.length > 0 || globalFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => { setSorting([]); setGlobalFilter(""); setColumnFilters([]) }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reset Sorting
                    </Button>
                  )}
                </div>
                <div className="relative w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 z-10" />
                  <Input
                    placeholder="Filter tasks…"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                  {globalFilter && (
                    <button
                      onClick={() => setGlobalFilter("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="border border-gray-300 rounded-md overflow-hidden">
              <Table ref={tableRef} density={tableDensity} className="w-full" style={{ tableLayout: "fixed" }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToHorizontalAxis]}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                        {headerGroup.headers.map((header) => (
                          <DraggableTableHeader
                            key={header.id}
                            header={header}
                            draggingColumnId={draggingColumnId}
                            tableRef={tableRef}
                          />
                        ))}
                      </SortableContext>
                    </TableRow>
                  ))}
                </TableHeader>
                </DndContext>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          const colId = cell.column.id
                          const val = cell.getValue() as string
                          return (
                            <TableCell
                              key={cell.id}
                              style={{ width: cell.column.getSize() }}
                              className={cn(
                                colId === "id" && "font-mono text-xs text-gray-500",
                                colId === "title" && "font-medium",
                                colId === "priority" && "text-sm",
                              )}
                            >
                              {colId === "status" ? (
                                <Badge variant={
                                  val === "Done" ? "success" :
                                  val === "In Progress" ? "accent" :
                                  val === "Todo" ? "warning" : "default"
                                }>
                                  <HighlightText text={val} query={globalFilter} />
                                </Badge>
                              ) : colId === "assignee" ? (
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px]">{val}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <HighlightText text={val} query={globalFilter} />
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columnOrder.length} className="h-24 text-center text-gray-500">
                        No tasks found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
              <div className="mt-3">
                <span className="text-xs text-gray-500">
                  {table.getFilteredRowModel().rows.length} of {tasks.length} task(s)
                </span>
              </div>
            </div>
          </ComponentBlock>

          <ComponentBlock name="Tabs" align="start">
            <LabeledItem label="Default">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 text-sm text-gray-500">
                  Project overview content goes here.
                </TabsContent>
                <TabsContent value="tasks" className="p-4 text-sm text-gray-500">
                  Task list content goes here.
                </TabsContent>
                <TabsContent value="settings" className="p-4 text-sm text-gray-500">
                  Settings content goes here.
                </TabsContent>
              </Tabs>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Card" align="start">
            <LabeledItem label="With progress">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Weekly planning</CardTitle>
                <CardDescription>Review milestones and assign owners for Q3.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progress</span>
                    <Badge variant="accent">In review</Badge>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-clay h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost" size="sm">Skip</Button>
                <Button size="sm">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </Card>
            </LabeledItem>
          </ComponentBlock>
        </Section>

        {/* ── MEDIUM PRIORITY ── */}
        <Section id="medium" title="Extended Components">
          <ComponentBlock name="Command">
            <LabeledItem label="Inline palette">
              <Command className="rounded-md border border-gray-300 shadow-sm w-[350px]">
                <CommandInput placeholder="Type a command or search…" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem><FileText className="mr-2 h-4 w-4" /> New document<CommandShortcut>⌘N</CommandShortcut></CommandItem>
                    <CommandItem><Search className="mr-2 h-4 w-4" /> Search tasks<CommandShortcut>⌘K</CommandShortcut></CommandItem>
                    <CommandItem><Settings className="mr-2 h-4 w-4" /> Settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Recent">
                    <CommandItem><FolderOpen className="mr-2 h-4 w-4" /> Q3 Roadmap</CommandItem>
                    <CommandItem><BarChart3 className="mr-2 h-4 w-4" /> Analytics Dashboard</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Popover">
            <LabeledItem label="Filter popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filter tasks</h4>
                      <p className="text-sm text-gray-500">Narrow down your task list.</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label>Status</Label>
                        <Select defaultValue="all">
                          <SelectTrigger className="col-span-2 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label>Assignee</Label>
                        <Input className="col-span-2 h-8" placeholder="Search…" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock
            name="Calendar"
            align="start"
            headerRight={
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                Display the current year in the selected date
                <Switch checked={showCurrentYear} onCheckedChange={setShowCurrentYear} />
              </label>
            }
          >
            <LabeledItem label="Date picker">
              <DatePickerDemo showCurrentYear={showCurrentYear} />
            </LabeledItem>
            <div className="w-16" />
            <LabeledItem label="Date picker - tasks">
              <DatePickerTasksDemo showCurrentYear={showCurrentYear} />
            </LabeledItem>
            <div className="w-16" />
            <LabeledItem label="Inline calendar">
              <div className="border border-gray-300 rounded-md bg-white">
                <Calendar mode="single" className="rounded-md" />
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Progress">
            <LabeledItem label="25%">
              <div className="w-[260px]"><Progress value={25} /></div>
            </LabeledItem>
            <LabeledItem label="65%">
              <div className="w-[260px]"><Progress value={65} /></div>
            </LabeledItem>
            <LabeledItem label="100%">
              <div className="w-[260px]"><Progress value={100} /></div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Skeleton" align="start">
            <LabeledItem label="Card skeleton">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </LabeledItem>
            <LabeledItem label="List skeleton">
              <div className="space-y-3 w-[300px]">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Breadcrumb">
            <LabeledItem label="Default">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink>Projects</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>Q3 Roadmap</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </LabeledItem>
          </ComponentBlock>
        </Section>

        {/* ── LOW PRIORITY ── */}
        <Section id="low" title="Layout & Navigation">
          <ComponentBlock name="NavigationMenu">
            <LabeledItem label="Top nav">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px] md:grid-cols-2">
                        <li><NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>Q3 Roadmap</NavigationMenuLink></li>
                        <li><NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>Design System</NavigationMenuLink></li>
                        <li><NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>API Migration</NavigationMenuLink></li>
                        <li><NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>Mobile App</NavigationMenuLink></li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Tasks</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Reports</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Toggle">
            <LabeledItem label="Default">
              <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
            </LabeledItem>
            <LabeledItem label="Outline">
              <Toggle variant="outline" aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
            </LabeledItem>
            <LabeledItem label="With text">
              <Toggle aria-label="Toggle underline"><Underline className="h-4 w-4 mr-2" /> Underline</Toggle>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="ToggleGroup">
            <LabeledItem label="Text alignment">
              <ToggleGroup type="single" defaultValue="left" variant="outline">
                <ToggleGroupItem value="left" aria-label="Left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </LabeledItem>
            <LabeledItem label="View switcher">
              <ToggleGroup type="single" defaultValue="grid" variant="outline">
                <ToggleGroupItem value="grid" aria-label="Grid"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List"><List className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Alert" align="start">
            <LabeledItem label="Default">
              <Alert className="w-[400px]">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
              </Alert>
            </LabeledItem>
            <LabeledItem label="Destructive">
              <Alert variant="destructive" className="w-[400px]">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
              </Alert>
            </LabeledItem>
            <LabeledItem label="Success">
              <Alert variant="success" className="w-[400px]">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your changes have been saved successfully.</AlertDescription>
              </Alert>
            </LabeledItem>
            <LabeledItem label="Warning">
              <Alert variant="warning" className="w-[400px]">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>You are approaching your storage limit.</AlertDescription>
              </Alert>
            </LabeledItem>
            <LabeledItem label="Info">
              <Alert variant="info" className="w-[400px]">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>This feature is currently in beta.</AlertDescription>
              </Alert>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Sidebar" align="start">
            <LabeledItem label="App sidebar">
              <Sidebar className="rounded-md border border-gray-300">
                <SidebarHeader>
                  <span className="font-serif text-lg font-medium">Range</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarItem active><Home className="h-4 w-4" /> Dashboard</SidebarItem>
                    <SidebarItem><Inbox className="h-4 w-4" /> Inbox</SidebarItem>
                    <SidebarItem><FileText className="h-4 w-4" /> Tasks</SidebarItem>
                    <SidebarItem><BarChart3 className="h-4 w-4" /> Reports</SidebarItem>
                  </SidebarGroup>
                  <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarItem><ChevronRight className="h-4 w-4" /> Q3 Roadmap</SidebarItem>
                    <SidebarItem><ChevronRight className="h-4 w-4" /> Design System</SidebarItem>
                    <SidebarItem><ChevronRight className="h-4 w-4" /> API Migration</SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">JM</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Jason McMinn</span>
                  </div>
                </SidebarFooter>
              </Sidebar>
            </LabeledItem>
          </ComponentBlock>
        </Section>

        {/* ── Dividers ── */}
        <section id="dividers" className="mb-16">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div className="font-mono text-base text-gray-500">&lt;Separator /&gt;</div>
              <div className="flex items-center gap-2">
                {/* Separator color menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <div className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: separatorColor }} />
                      <span className="text-xs text-gray-500">Separator</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[280px]">
                    <DropdownMenuLabel>Separator color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ColorMenuItems
                      value={separatorColor}
                      defaultHex={SEPARATOR_COLOR_DEFAULT}
                      onSelect={setSeparatorColor}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Background color menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <div className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: separatorBg }} />
                      <span className="text-xs text-gray-500">Background</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[280px]">
                    <DropdownMenuLabel>Background color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ColorMenuItems
                      value={separatorBg}
                      defaultHex={SEPARATOR_BG_DEFAULT}
                      onSelect={setSeparatorBg}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div
            className="flex w-full gap-6 p-6 border border-gray-300 rounded-md transition-colors"
            style={{ backgroundColor: separatorBg }}
          >
            {/* Horizontal dividers */}
            <div className="flex-1 flex flex-col justify-between py-4" style={{ gap: "64px" }}>
              <Separator className="w-1/2" style={{ backgroundColor: separatorColor }} />
              <Separator className="w-1/2" style={{ backgroundColor: separatorColor }} />
              <Separator className="h-[2px] w-1/2" style={{ backgroundColor: separatorColor }} />
              <Separator className="h-[2px] w-1/2" style={{ backgroundColor: separatorColor }} />
            </div>
            {/* Vertical dividers */}
            <div className="flex-1 flex justify-between px-8" style={{ height: "300px" }}>
              <Separator orientation="vertical" style={{ backgroundColor: separatorColor }} />
              <Separator orientation="vertical" style={{ backgroundColor: separatorColor }} />
              <Separator orientation="vertical" className="w-[2px]" style={{ backgroundColor: separatorColor }} />
              <Separator orientation="vertical" className="w-[2px]" style={{ backgroundColor: separatorColor }} />
            </div>
          </div>
        </section>

        {/* ── ANIMATION ── */}
        <Section id="animation" title="Animation">
          <BorderChaseDemo />
        </Section>
      </div>
    </TooltipProvider>
  )
}

export default App
