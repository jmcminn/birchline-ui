import { useState, useMemo } from "react"
import { Check, UserPlus, UserRound, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 1) return <>{text}</>
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

export type UserRole = "Admin" | "Collaborator" | "Guest"

export interface User {
  id: string
  name: string
  email: string
  initials: string
  role: UserRole
}

interface UserSelectorProps {
  users: User[]
  recentIds?: string[]
  value?: string | null
  onSelect?: (userId: string | null) => void
  multiSelect?: boolean
  values?: string[]
  onValuesChange?: (userIds: string[]) => void
  onInvite?: () => void
  placeholder?: string
  noAssigneeLabel?: string
  showNoAssignee?: boolean
  clearable?: boolean
  className?: string
}

const roleBadgeVariant: Record<UserRole, "accent" | "muted"> = {
  Admin: "accent",
  Collaborator: "accent",
  Guest: "muted",
}

function getRoleAvatarColor(role: UserRole) {
  return role === "Guest" ? "bg-gray-500 text-white" : "bg-clay text-white"
}

function UserRow({
  user,
  selected,
  onSelect,
  search,
  multiSelect,
}: {
  user: User
  selected: boolean
  onSelect: () => void
  search?: string
  multiSelect?: boolean
}) {
  return (
    <CommandItem
      value={`${user.name} ${user.email}`}
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5"
    >
      <span className="w-5 shrink-0 flex items-center justify-center">
        {multiSelect ? (
          <Checkbox checked={selected} tabIndex={-1} className="pointer-events-none" />
        ) : (
          selected && <Check className="h-4 w-4 text-ink" />
        )}
      </span>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn("text-xs font-medium", getRoleAvatarColor(user.role))}>
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate"><HighlightMatch text={user.name} query={search ?? ""} /></span>
          <Badge variant={roleBadgeVariant[user.role]} className="text-[11px] px-1.5 py-0 h-5 shrink-0">
            {user.role}
          </Badge>
        </div>
        <div className="text-xs text-gray-500 truncate"><HighlightMatch text={user.email} query={search ?? ""} /></div>
      </div>
    </CommandItem>
  )
}

function UserSelector({
  users,
  recentIds = [],
  value,
  onSelect,
  multiSelect = false,
  values = [],
  onValuesChange,
  onInvite,
  placeholder = "Select user…",
  noAssigneeLabel = "No Assignee",
  showNoAssignee = true,
  clearable = false,
  className,
}: UserSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedUser = useMemo(
    () => users.find((u) => u.id === value) ?? null,
    [users, value]
  )

  const selectedUsers = useMemo(
    () => users.filter((u) => values.includes(u.id)),
    [users, values]
  )

  const recentUsers = useMemo(
    () => recentIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) as User[],
    [users, recentIds]
  )

  const nonRecentUsers = useMemo(
    () => users.filter((u) => !recentIds.includes(u.id)),
    [users, recentIds]
  )

  function handleSelect(userId: string | null) {
    onSelect?.(userId)
    setOpen(false)
    setSearch("")
  }

  function handleMultiToggle(userId: string) {
    const next = values.includes(userId)
      ? values.filter((id) => id !== userId)
      : [...values, userId]
    onValuesChange?.(next)
  }

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch("") }}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 h-10 px-2 rounded-sm border border-gray-300 bg-white text-sm",
            "hover:bg-gray-100 transition-colors",
            "focus:border-clay focus:ring-[3px] focus:ring-clay/15 focus:outline-none",
            className
          )}
        >
          {multiSelect ? (
            selectedUsers.length > 0 ? (
              <>
                <div className="flex items-center -space-x-1.5">
                  {selectedUsers.slice(0, 3).map((u) => (
                    <Avatar key={u.id} className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className={cn("text-[10px] font-medium", getRoleAvatarColor(u.role))}>
                        {u.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="font-medium">
                  {selectedUsers.length === 1 ? selectedUsers[0].name : `${selectedUsers.length} users`}
                </span>
                {clearable && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); onValuesChange?.([]) }}
                    className="ml-auto text-gray-500 hover:text-ink transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="h-6 w-6 rounded-full border-[1.5px] border-dashed border-gray-300 flex items-center justify-center shrink-0">
                  <UserRound className="h-3 w-3 text-gray-300" />
                </div>
                <span className="text-gray-500">{noAssigneeLabel}</span>
              </>
            )
          ) : selectedUser ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarFallback className={cn("text-[10px] font-medium", getRoleAvatarColor(selectedUser.role))}>
                  {selectedUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
              {clearable && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); onSelect?.(null) }}
                  className="ml-auto text-gray-500 hover:text-ink transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
            </>
          ) : value === null ? (
            <>
              <div className="h-6 w-6 rounded-full border-[1.5px] border-dashed border-gray-300 flex items-center justify-center shrink-0">
                <UserRound className="h-3 w-3 text-gray-300" />
              </div>
              <span className="text-gray-500">{noAssigneeLabel}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit min-w-[280px] max-w-[400px] p-0"
        align="start"
        side="bottom"
        collisionPadding={16}
        sticky="always"
      >
        <Command filter={(value, search) => {
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}>
          <div className="relative">
            <CommandInput
              placeholder="Search users"
              value={search}
              onValueChange={setSearch}
            />
            {search.length > 0 && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <CommandList className="max-h-[calc(var(--radix-popover-content-available-height,50vh)-64px-44px)] overflow-y-auto">
            <CommandEmpty>No users found.</CommandEmpty>
            {!search && showNoAssignee && (
              <CommandGroup>
                <CommandItem
                  value="no-assignee"
                  onSelect={() => { if (multiSelect) { onValuesChange?.([]); setOpen(false); setSearch("") } else { handleSelect(null) } }}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <span className="w-5 shrink-0 flex items-center justify-center">
                    {value === null && <Check className="h-4 w-4 text-ink" />}
                  </span>
                  <div className="h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                    <UserRound className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="text-sm font-medium">No Assignee</span>
                </CommandItem>
              </CommandGroup>
            )}
            {recentUsers.length > 0 && (
              <>
                {!search && showNoAssignee && <CommandSeparator />}
                <CommandGroup heading="Recents">
                  {recentUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      selected={multiSelect ? values.includes(user.id) : value === user.id}
                      onSelect={() => multiSelect ? handleMultiToggle(user.id) : handleSelect(user.id)}
                      search={search}
                      multiSelect={multiSelect}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
            {nonRecentUsers.length > 0 && (
              <>
                {((!search && showNoAssignee) || recentUsers.length > 0) && <CommandSeparator />}
                <CommandGroup heading="Users">
                  {nonRecentUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      selected={multiSelect ? values.includes(user.id) : value === user.id}
                      onSelect={() => multiSelect ? handleMultiToggle(user.id) : handleSelect(user.id)}
                      search={search}
                      multiSelect={multiSelect}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {onInvite && !search && (
            <div className="border-t border-gray-300">
              <CommandGroup>
                <CommandItem
                  onSelect={() => { onInvite(); setOpen(false) }}
                  className="flex items-center gap-3 px-3 py-1"
                >
                  <span className="w-5 shrink-0" />
                  <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <UserPlus className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm">Invite User</span>
                </CommandItem>
              </CommandGroup>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { UserSelector }
