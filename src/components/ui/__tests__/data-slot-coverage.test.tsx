/**
 * Guard rail for the token inspector (Phase 4).
 *
 * The inspector finds a component by its `data-slot` attribute, so every
 * exported component and part must carry one. Two checks:
 *
 *  1. Manifest — the full set of `data-slot` literals authored in the component
 *     sources (plus the one showcase slot) must match the frozen list below.
 *     Removing or renaming a slot fails here; adding one is a deliberate edit to
 *     the list. This is the "nothing silently loses its slot" guard.
 *  2. Render — a representative sample across every category (including portalled
 *     overlays, Calendar, Sidebar and Table) is actually mounted, and each
 *     expected `data-slot` is asserted present in the DOM, proving the attribute
 *     survives to render and not just to source.
 */
import { readFileSync, readdirSync } from "fs"
import path from "path"
import * as React from "react"
import { render } from "@testing-library/react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem } from "@/components/ui/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

/** The full set of data-slot values, frozen. Update deliberately when adding a component/part. */
const EXPECTED_SLOTS = [
  "alert", "alert-description", "alert-title",
  "alert-dialog-content", "alert-dialog-description", "alert-dialog-footer", "alert-dialog-header", "alert-dialog-overlay", "alert-dialog-title",
  "avatar", "avatar-fallback", "avatar-image",
  "badge", "border-chase", "button", "calendar", "checkbox", "input", "label", "progress", "separator", "skeleton", "switch", "textarea", "toggle", "user-selector",
  "breadcrumb", "breadcrumb-ellipsis", "breadcrumb-item", "breadcrumb-link", "breadcrumb-list", "breadcrumb-page", "breadcrumb-separator",
  "card", "card-content", "card-description", "card-footer", "card-header", "card-title",
  "command", "command-empty", "command-group", "command-input", "command-item", "command-list", "command-separator",
  "dialog-content", "dialog-description", "dialog-footer", "dialog-header", "dialog-overlay", "dialog-title",
  "dropdown-menu-checkbox-item", "dropdown-menu-content", "dropdown-menu-item", "dropdown-menu-label", "dropdown-menu-radio-item", "dropdown-menu-separator", "dropdown-menu-sub-content", "dropdown-menu-sub-trigger",
  "line-chart", "line-chart-legend", "line-chart-tooltip",
  "navigation-menu-content", "navigation-menu-link", "navigation-menu-trigger", "navigation-menu-viewport",
  "popover-content",
  "select-content", "select-item", "select-separator", "select-trigger",
  "sheet-content", "sheet-description", "sheet-footer", "sheet-header", "sheet-overlay", "sheet-title",
  "sidebar", "sidebar-content", "sidebar-footer", "sidebar-group", "sidebar-group-label", "sidebar-header", "sidebar-item",
  "table", "table-body", "table-caption", "table-cell", "table-footer", "table-head", "table-header", "table-row",
  "tabs", "tabs-content", "tabs-list", "tabs-trigger",
  "toggle-group", "toggle-group-item",
  "tooltip-content",
].sort()

describe("data-slot coverage · manifest", () => {
  it("the authored data-slot set matches the frozen list", () => {
    const uiDir = path.resolve(process.cwd(), "src/components/ui")
    const files = readdirSync(uiDir).filter((f) => f.endsWith(".tsx")).map((f) => path.join(uiDir, f))
    files.push(path.resolve(process.cwd(), "src/App.tsx")) // border-chase lives in the showcase
    const found = new Set<string>()
    for (const file of files) {
      const src = readFileSync(file, "utf8")
      for (const m of src.matchAll(/data-slot="([^"]+)"/g)) found.add(m[1])
    }
    expect([...found].sort()).toEqual(EXPECTED_SLOTS)
  })
})

describe("data-slot coverage · render", () => {
  const has = (slot: string) => !!document.querySelector(`[data-slot="${slot}"]`)

  it("inline components carry their slot in the DOM", () => {
    render(
      <>
        <Badge>New</Badge>
        <Input placeholder="x" />
        <Card><CardHeader><CardTitle>T</CardTitle></CardHeader><CardContent>B</CardContent></Card>
        <Table><TableHeader><TableRow><TableHead>H</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody></Table>
        <Sidebar><SidebarHeader>H</SidebarHeader><SidebarContent><SidebarItem active>Item</SidebarItem></SidebarContent></Sidebar>
        <Calendar />
        <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>
      </>,
    )
    for (const slot of [
      "badge", "input", "card", "card-header", "card-title", "card-content",
      "table", "table-row", "table-cell", "sidebar", "sidebar-item", "calendar",
      "breadcrumb", "breadcrumb-link",
    ]) {
      expect(has(slot), slot).toBe(true)
    }
  })

  it("portalled overlays carry their slot when open", () => {
    render(
      <>
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Desc</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <DropdownMenu open>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
            <DropdownMenuItem>Item</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Body</PopoverContent>
        </Popover>
        <Select open>
          <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      </>,
    )
    for (const slot of [
      "dialog-content", "dialog-header", "dialog-title", "dialog-description",
      "dropdown-menu-content", "dropdown-menu-item", "dropdown-menu-label", "dropdown-menu-separator",
      "popover-content",
      "select-trigger", "select-content", "select-item",
    ]) {
      expect(has(slot), slot).toBe(true)
    }
  })
})
