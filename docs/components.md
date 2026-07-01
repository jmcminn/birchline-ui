# Components

31 components, installable from the Birchline shadcn registry. Configure the
namespace once (see [README](../README.md#distribution-shadcn-registry)), then:

```bash
npx shadcn@latest add @birchline/tokens   # once, first
npx shadcn@latest add @birchline/<name>
```

Internal dependencies resolve automatically (e.g. `user-selector` pulls
`avatar`, `badge`, `checkbox`, `command`, `popover`).

## Index

| Component | Purpose | `@birchline/…` |
|---|---|---|
| Alert | Inline, non-blocking status message | `alert` |
| AlertDialog | Blocking confirm for destructive/irreversible actions | `alert-dialog` |
| Avatar | User image with initials fallback | `avatar` |
| Badge | Small status/label pill | `badge` |
| Breadcrumb | Hierarchical navigation trail | `breadcrumb` |
| Button | Actions (primary, secondary, ghost, outline, destructive, link) | `button` |
| Calendar | Date grid / date-picker body | `calendar` |
| Card | Grouped content surface | `card` |
| Checkbox | Multi-select / boolean opt-in | `checkbox` |
| Command | Command palette / searchable list (cmdk) | `command` |
| Dialog | Focused modal task or form | `dialog` |
| DropdownMenu | Contextual action menu (supports submenus) | `dropdown-menu` |
| Input | Single-line text field (with clear button) | `input` |
| Label | Accessible form label | `label` |
| NavigationMenu | Top-level site navigation with panels | `navigation-menu` |
| Popover | Free-form floating content anchored to a trigger | `popover` |
| Progress | Determinate progress bar | `progress` |
| Select | Choose one from a known list | `select` |
| Separator | Visual divider | `separator` |
| Sheet | Edge-anchored panel (drawer) | `sheet` |
| Sidebar | App navigation sidebar | `sidebar` |
| Skeleton | Loading placeholder | `skeleton` |
| Switch | Instant on/off setting | `switch` |
| Table | Data table (sorting, density, column DnD) | `table` |
| Tabs | Switch between peer views | `tabs` |
| Textarea | Multi-line text field | `textarea` |
| Toaster | Transient toast notifications (sonner) | `toaster` |
| Toggle | Two-state icon/text button | `toggle` |
| ToggleGroup | Grouped toggles (single/multi) | `toggle-group` |
| Tooltip | Hover/focus hint on an element | `tooltip` |
| UserSelector | Searchable person picker (single/multi, roles, recents) | `user-selector` |

## Which one do I use?

**Picking one value from a list**
- **Select** — one choice from a short, known set of options.
- **DropdownMenu** — a menu of *actions* (not value selection).
- **Command** — many options that need search/filtering + keyboard nav.
- **UserSelector** — specifically for choosing people (avatars, roles, recents,
  single or multi); built on Command + Popover.

**Floating / overlay surfaces**
- **Tooltip** — a passive hint; no interactive content, no focus trap.
- **Popover** — small interactive content anchored to a trigger, non-blocking.
- **DropdownMenu** — a list of actions from a trigger.
- **Dialog** — a focused modal task/form; traps focus, blocks the page.
- **Sheet** — like Dialog but slides from an edge; good for longer forms/filters.
- **AlertDialog** — a *confirmation* only; use for destructive/irreversible
  actions where the user must choose (never for routine forms).

**Feedback**
- **Toaster (toast)** — transient, auto-dismissing confirmation of an action.
- **Alert** — persistent, inline context within the page.
- **AlertDialog** — requires a decision before continuing.

**Boolean / mode controls**
- **Switch** — a setting that applies immediately (e.g. "Enable notifications").
- **Checkbox** — opt-in within a form that's submitted later, or multi-select.
- **Toggle / ToggleGroup** — toolbar-style two-state buttons (formatting, view mode).
- **Tabs** — switching between peer *views*, not setting a value.

## Do / Don't (high-signal)

- **Don't** use AlertDialog for ordinary forms — it's for confirmations. Use Dialog.
- **Don't** use a Toast for anything the user must act on — it disappears. Use Alert/AlertDialog.
- **Don't** put interactive controls in a Tooltip — it's not focusable/clickable. Use Popover.
- **Do** pair every Input/Textarea/Select with a Label (or `aria-label`).
- **Do** prefer Select over DropdownMenu when the outcome is choosing a value.
