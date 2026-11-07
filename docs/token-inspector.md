# Token inspector

The showcase ships a **token inspector** — a dev tool that overlays the running
page and, for any component you click, lists the design tokens it uses per
interaction state (At Rest, Hover, Focus, Pressed, Selected, Invalid, Disabled)
plus its type tokens. It's a documentation aid, not part of the published
registry.

## Using it

Open the showcase (`npm run dev`) and click the **inspect** button in the top
‑right (the target icon). Then:

- **Hover** any component to outline it; **click** to pin a panel of its tokens.
- The panel header names the component and, for a part, its parent — e.g.
  `<SelectItem />  in Select` — with an **↑** button to step up to the enclosing
  component (useful when a part fully covers its parent, like `CardHeader` over
  `Card`).
- A **Contains** section lists nested components to inspect separately.
- **Alt-click (Option-click)** passes through while inspecting, so you can open a
  menu, select, popover, dialog or sheet and then inspect its contents with a
  normal click.
- **Esc** unpins the panel, then closes an open overlay, then exits inspect mode.

Colors that aren't Birchline tokens (a hard-coded hex, an `rgb()`, a computed
tint) are shown as **"not a token"** with a raw swatch, so off-system values are
easy to spot.

## How it finds components: `data-slot`

Every exported component and composable part carries a `data-slot` attribute
using shadcn/ui v4 names (`card-header`, `table-row`, `select-content`,
`dialog-title`, …), plus `data-variant` / `data-size` where it has variants. The
inspector walks the DOM for these attributes; parsing lives in
`src/inspector/` (`parse-classes.ts` → `inspect-element.ts` → `token-inspector.tsx`).

These attributes ship to registry consumers too — they're inert markers, so a
component's visual output is unchanged.

### Adopted third-party roots

A few components render DOM we don't author and can't put `data-slot` on. The
inspector **adopts** them by their own markup — currently Sonner toasts
(`[data-sonner-toast]` → `Toast`). The class parser also reads Sonner's
`group-[.toaster]:` / `group-[.toast]:` scoping variants as resting colors, so a
toast reports `--popover` / `--foreground` / `--border` like any other
component.

## Coverage guard

`src/components/ui/__tests__/data-slot-coverage.test.tsx` freezes the full set of
`data-slot` names and renders a sample (including opened overlays) to prove the
attribute reaches the DOM. Adding or renaming a component/part is a deliberate
edit to that list.

## Known limitations

- **Skeleton** reports "no color tokens" — its colors live in the `bl-skeleton`
  CSS class rather than in Tailwind utilities.
- **LineChart tooltip** is `pointer-events:none` (a Recharts default), so it
  can't be clicked directly; it's listed under the chart's **Contains** instead.
