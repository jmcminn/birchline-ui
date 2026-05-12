import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { MoreHorizontal, Plus, Search, Trash2, Copy, Pencil, ArrowRight, Info, PanelRight, Bell, CalendarDays, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, LayoutGrid, List, Home, Settings, FolderOpen, Inbox, FileText, BarChart3, AlertCircle, CheckCircle, AlertTriangle, InfoIcon, Terminal, ChevronRight } from "lucide-react"

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16">
      <h2 className="font-serif text-[26px] font-medium tracking-tight mb-2">{title}</h2>
      <Separator className="mb-7" />
      {children}
    </section>
  )
}

function ComponentBlock({ name, children, align }: { name: string; children: React.ReactNode; align?: string }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-xs text-muted-foreground mb-3">&lt;{name} /&gt;</div>
      <div className={`flex flex-wrap ${align === "start" ? "items-start" : "items-center"} gap-4 p-6 bg-card border border-border rounded-md`}>
        {children}
      </div>
    </div>
  )
}

function LabeledItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      {children}
      <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

function ColorSwatch({ color, hex, token, noBorder }: { color: string; hex: string; token: string; noBorder?: boolean }) {
  return (
    <div>
      <div
        className="w-16 h-16 rounded-sm mb-2"
        style={{
          backgroundColor: color,
          border: noBorder ? "1.5px solid transparent" : "1.5px solid var(--color-border)",
        }}
      />
      <span className="font-mono text-xs text-gray-700 block">{hex}</span>
      <span className="font-mono text-[11px] text-muted-foreground block">{token}</span>
    </div>
  )
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date>()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}

const tasks = [
  { id: "TASK-001", title: "Design onboarding flow", status: "In Progress", priority: "High", assignee: "JM" },
  { id: "TASK-002", title: "Set up CI/CD pipeline", status: "Done", priority: "Medium", assignee: "AK" },
  { id: "TASK-003", title: "Write API documentation", status: "Todo", priority: "Low", assignee: "SR" },
  { id: "TASK-004", title: "Fix login redirect bug", status: "In Progress", priority: "High", assignee: "JM" },
  { id: "TASK-005", title: "Add dark mode support", status: "Backlog", priority: "Medium", assignee: "LP" },
]

function App() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [switchOn, setSwitchOn] = useState(true)

  return (
    <TooltipProvider>
      <div className="max-w-[980px] mx-auto px-6 py-14">
        <Toaster />

        <header className="mb-12">
          <h1 className="font-serif text-[40px] font-medium tracking-tight mb-1.5">
            Birchline UI
          </h1>
          <p className="text-muted-foreground text-sm">
            shadcn/ui components reskinned with Birchline design tokens — <code className="font-mono text-[13px] bg-gray-100 px-1.5 py-0.5 rounded-xs">@birchline/ui</code>
          </p>
        </header>

        {/* ── COLOR ── */}
        <Section id="color" title="Color">
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Primary</div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-4 gap-y-5">
              <ColorSwatch color="#D97757" hex="#D97757" token="--clay" noBorder />
              <ColorSwatch color="#141413" hex="#141413" token="--slate" noBorder />
              <ColorSwatch color="#FAF9F5" hex="#FAF9F5" token="--ivory" />
              <ColorSwatch color="#E3DACC" hex="#E3DACC" token="--oat" noBorder />
            </div>
          </div>
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Neutral</div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-4 gap-y-5">
              <ColorSwatch color="#FFFFFF" hex="#FFFFFF" token="--white" />
              <ColorSwatch color="#F0EEE6" hex="#F0EEE6" token="--gray-100" />
              <ColorSwatch color="#D1CFC5" hex="#D1CFC5" token="--gray-300" noBorder />
              <ColorSwatch color="#87867F" hex="#87867F" token="--gray-500" noBorder />
              <ColorSwatch color="#3D3D3A" hex="#3D3D3A" token="--gray-700" noBorder />
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Semantic</div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-4 gap-y-5">
              <ColorSwatch color="#788C5D" hex="#788C5D" token="--success" noBorder />
              <ColorSwatch color="#C78E3F" hex="#C78E3F" token="--warning" noBorder />
              <ColorSwatch color="#B04A4A" hex="#B04A4A" token="--danger" noBorder />
              <ColorSwatch color="#5C7CA3" hex="#5C7CA3" token="--info" noBorder />
              <ColorSwatch color="#7B6B8A" hex="#7B6B8A" token="--dusty-plum" noBorder />
              <ColorSwatch color="#5B8E8A" hex="#5B8E8A" token="--sea-glass" noBorder />
            </div>
          </div>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section id="typography" title="Typography">
          <div className="border border-border rounded-md bg-card overflow-hidden">
            {[
              { cls: "font-serif text-5xl leading-[1.1] font-medium tracking-tight", name: "Display", meta: "48 / 1.1 / 500" },
              { cls: "font-serif text-[32px] leading-[1.2] font-medium tracking-tight", name: "Heading 1", meta: "32 / 1.2 / 500" },
              { cls: "font-serif text-2xl leading-[1.3] font-medium", name: "Heading 2", meta: "24 / 1.3 / 500" },
              { cls: "font-sans text-base leading-[1.55]", name: "Body", meta: "16 / 1.55 / 430", text: "Review milestones, assign owners, and surface blockers before they cascade." },
              { cls: "font-sans text-sm leading-[1.5]", name: "Small", meta: "14 / 1.5 / 430", text: "Review milestones, assign owners, and surface blockers before they cascade." },
              { cls: "font-sans text-xs leading-[1.4] font-medium text-muted-foreground", name: "Caption", meta: "12 / 1.4 / 500", text: "UPDATED 2 HOURS AGO" },
            ].map((row, i, arr) => (
              <div key={row.name} className={`flex items-baseline justify-between gap-6 px-6 py-5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`flex-1 min-w-0 truncate ${row.cls}`}>
                  {row.text ?? "Plan the week ahead"}
                </div>
                <div className="font-mono text-xs text-muted-foreground text-right shrink-0">
                  <span className="text-gray-700 block mb-0.5">{row.name}</span>
                  {row.meta}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SPACING ── */}
        <Section id="spacing" title="Spacing">
          <div className="flex items-end gap-7 p-7 bg-card border border-border rounded-md overflow-x-auto">
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
                  {s.px}<span className="block text-muted-foreground">{s.token}</span>
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
                className="w-[120px] h-[88px] bg-oat border border-border flex items-end p-3"
                style={{ borderRadius: item.r }}
              >
                <div className="font-mono text-[11px] text-gray-700">
                  {item.r}<span className="block text-muted-foreground">{item.token}</span>
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
                className="w-40 h-24 bg-card rounded-md flex items-end p-3.5"
                style={{ boxShadow: item.shadow }}
              >
                <div className="font-mono text-[11px] text-gray-700">
                  {item.token}<span className="block text-muted-foreground">{item.meta}</span>
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
              <div className="w-[260px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search…" />
                </div>
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Textarea" align="start">
            <LabeledItem label="Placeholder">
              <div className="w-[340px]">
                <Textarea placeholder="Add a description…" />
              </div>
            </LabeledItem>
            <LabeledItem label="Filled">
              <div className="w-[340px]">
                <Textarea defaultValue="Review milestones, assign owners, and surface blockers before they cascade. Make sure to update the project board after the meeting." />
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="Select" align="start">
            <LabeledItem label="Placeholder">
              <div className="w-[260px]">
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
              </div>
            </LabeledItem>
            <LabeledItem label="Pre-selected">
              <div className="w-[260px]">
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
              </div>
            </LabeledItem>
          </ComponentBlock>

          <ComponentBlock name="DropdownMenu">
            <LabeledItem label="Action menu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit task</DropdownMenuItem>
                  <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                  <DropdownMenuItem><ArrowRight className="mr-2 h-4 w-4" /> Move to…</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
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

          <ComponentBlock name="Avatar">
            <LabeledItem label="Image">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=JM&backgroundColor=D97757&textColor=ffffff" alt="JM" />
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Fallback">
              <Avatar>
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Small">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">SR</AvatarFallback>
              </Avatar>
            </LabeledItem>
            <LabeledItem label="Group">
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
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-danger-hover">
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

          <ComponentBlock name="Table" align="start">
            <div className="w-full border border-border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[60px]">Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{task.id}</TableCell>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={
                          task.status === "Done" ? "success" :
                          task.status === "In Progress" ? "accent" :
                          task.status === "Todo" ? "warning" : "default"
                        }>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{task.priority}</TableCell>
                      <TableCell>
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <TabsContent value="overview" className="p-4 text-sm text-muted-foreground">
                  Project overview content goes here.
                </TabsContent>
                <TabsContent value="tasks" className="p-4 text-sm text-muted-foreground">
                  Task list content goes here.
                </TabsContent>
                <TabsContent value="settings" className="p-4 text-sm text-muted-foreground">
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
              <Command className="rounded-md border border-border shadow-sm w-[350px]">
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
                      <p className="text-sm text-muted-foreground">Narrow down your task list.</p>
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

          <ComponentBlock name="Calendar">
            <LabeledItem label="Date picker">
              <DatePickerDemo />
            </LabeledItem>
            <LabeledItem label="Inline calendar">
              <div className="border border-border rounded-md bg-card">
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
              <Sidebar className="h-[400px] rounded-md border border-border">
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
      </div>
    </TooltipProvider>
  )
}

export default App
