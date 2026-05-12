import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import { MoreHorizontal, Plus, Search, Trash2, Copy, Pencil, ArrowRight } from "lucide-react"

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16">
      <h2 className="font-serif text-[26px] font-medium tracking-tight mb-2">{title}</h2>
      <Separator className="mb-7" />
      {children}
    </section>
  )
}

function ComponentBlock({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-xs text-muted-foreground mb-3">&lt;{name} /&gt;</div>
      <div className="flex flex-wrap items-center gap-4 p-6 bg-card border border-border rounded-md">
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

function App() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [switchOn, setSwitchOn] = useState(true)

  return (
    <div className="max-w-[980px] mx-auto px-6 py-14">
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

        <ComponentBlock name="Input">
          <div className="w-[260px]">
            <Input placeholder="Search tasks…" />
          </div>
          <div className="w-[260px]">
            <Input defaultValue="Weekly planning" />
          </div>
          <div className="w-[260px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search…" />
            </div>
          </div>
        </ComponentBlock>

        <ComponentBlock name="Select">
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
        </ComponentBlock>

        <ComponentBlock name="DropdownMenu">
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
        </ComponentBlock>

        <ComponentBlock name="Checkbox">
          <div className="flex items-center gap-2.5">
            <Checkbox id="c1" checked={checked1} onCheckedChange={(v) => setChecked1(v === true)} />
            <Label htmlFor="c1" className="cursor-pointer">Notify assignees</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="c2" checked={checked2} onCheckedChange={(v) => setChecked2(v === true)} />
            <Label htmlFor="c2" className="cursor-pointer">Archive on complete</Label>
          </div>
        </ComponentBlock>

        <ComponentBlock name="Switch">
          <div className="flex items-center gap-3">
            <Switch id="s1" checked={switchOn} onCheckedChange={setSwitchOn} />
            <Label htmlFor="s1" className="cursor-pointer">Enable notifications</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="s2" />
            <Label htmlFor="s2" className="cursor-pointer">Dark mode</Label>
          </div>
        </ComponentBlock>

        <ComponentBlock name="Badge">
          <Badge variant="default">Draft</Badge>
          <Badge variant="accent">In review</Badge>
          <Badge variant="success">Done</Badge>
          <Badge variant="warning">Overdue</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="info">Info</Badge>
        </ComponentBlock>

        <ComponentBlock name="Tabs">
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
        </ComponentBlock>

        <ComponentBlock name="Card">
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
        </ComponentBlock>
      </Section>
    </div>
  )
}

export default App
