import { useState, useMemo } from "react"
import { Check, UserPlus, UserRound, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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
  onInvite?: () => void
  placeholder?: string
  className?: string
}

const roleBadgeVariant: Record<UserRole, "info" | "accent" | "warning"> = {
  Admin: "info",
  Collaborator: "accent",
  Guest: "warning",
}

function getInitialsColor(initials: string) {
  const colors = [
    "bg-olive text-white",
    "bg-sea-glass text-white",
    "bg-dusty-plum text-white",
    "bg-info text-white",
    "bg-clay text-white",
    "bg-gray-500 text-white",
  ]
  let hash = 0
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function UserRow({
  user,
  selected,
  onSelect,
}: {
  user: User
  selected: boolean
  onSelect: () => void
}) {
  return (
    <CommandItem
      value={`${user.name} ${user.email}`}
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5"
    >
      <span className="w-5 shrink-0 flex items-center justify-center">
        {selected && <Check className="h-4 w-4 text-foreground" />}
      </span>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className={cn("text-xs font-medium", getInitialsColor(user.initials))}>
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{user.name}</span>
          <Badge variant={roleBadgeVariant[user.role]} className="text-[10px] px-1.5 py-0 h-5 shrink-0">
            {user.role}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
      </div>
    </CommandItem>
  )
}

function UserSelector({
  users,
  recentIds = [],
  value,
  onSelect,
  onInvite,
  placeholder = "Select user…",
  className,
}: UserSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedUser = useMemo(
    () => users.find((u) => u.id === value) ?? null,
    [users, value]
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

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch("") }}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2.5 h-10 px-3 rounded-sm border border-input bg-white text-sm",
            "hover:bg-gray-100 transition-colors",
            "focus:border-primary focus:ring-[3px] focus:ring-primary/15 focus:outline-none",
            className
          )}
        >
          {selectedUser ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarFallback className={cn("text-[10px] font-medium", getInitialsColor(selectedUser.initials))}>
                  {selectedUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit min-w-[280px] max-w-[400px] p-0"
        align="start"
        collisionPadding={16}
      >
        <Command>
          <div className="relative">
            <CommandInput
              placeholder="Search users"
              value={search}
              onValueChange={setSearch}
            />
            {search.length > 0 && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <CommandList className="max-h-[min(60vh,400px)]">
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="no-assignee"
                onSelect={() => handleSelect(null)}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <span className="w-5 shrink-0 flex items-center justify-center">
                  {value === null && <Check className="h-4 w-4 text-foreground" />}
                </span>
                <div className="h-9 w-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                  <UserRound className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium">No Assignee</span>
              </CommandItem>
            </CommandGroup>
            {recentUsers.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recents">
                  {recentUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      selected={value === user.id}
                      onSelect={() => handleSelect(user.id)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
            {nonRecentUsers.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Users">
                  {nonRecentUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      selected={value === user.id}
                      onSelect={() => handleSelect(user.id)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
            {onInvite && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => { onInvite(); setOpen(false) }}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <span className="w-5 shrink-0" />
                    <UserPlus className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">Invite User</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { UserSelector }
