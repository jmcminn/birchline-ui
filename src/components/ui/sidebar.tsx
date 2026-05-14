import * as React from "react"
import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-gray-300 bg-white",
        className
      )}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 px-4 py-3 border-b border-gray-300", className)} {...props} />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 py-2", className)} {...props} />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t border-gray-300 px-4 py-3", className)} {...props} />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-2", className)} {...props} />
  )
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-xs font-medium text-gray-500", className)}
      {...props}
    />
  )
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left transition-colors cursor-pointer",
      active ? "bg-gray-100 text-ink font-medium" : "text-gray-500 hover:bg-gray-100 hover:text-ink",
      className
    )}
    {...props}
  />
))
SidebarItem.displayName = "SidebarItem"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
}
