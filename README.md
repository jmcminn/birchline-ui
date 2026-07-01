# Birchline UI

shadcn/ui components reskinned with [Birchline](https://github.com/jmcminn/birchline) design tokens.

## Documentation

- [Foundations](./docs/foundations.md) — tokens, color roles, type ramp, spacing, theming, focus.
- [Components](./docs/components.md) — index, install commands, and "which one do I use?" guidance.

## Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Radix UI primitives (via shadcn/ui pattern)
- Vite

## Getting Started

```bash
npm install
npm run dev
```

## Testing

Interaction/render tests run on Vitest + React Testing Library (jsdom):

```bash
npm test          # run once
npm run test:watch
```

Tests live in `src/components/ui/__tests__/` and cover rendering, variant
classes, and key interactions (controls, tabs, dialog/menu overlays). They are
excluded from the production `tsc -b` build.

## Distribution (shadcn registry)

Birchline UI is distributed as a **shadcn registry** — components are copied into
your project (you own the code), and they ship with the Birchline design tokens.

Source of truth is [`registry.json`](./registry.json); `npm run registry:build`
compiles it to servable JSON in `public/r/`. Host `public/r/` anywhere static
and point the base URL at it (replace `birchline-ui.example.com`).

**Consume it** from any Tailwind v4 + shadcn project:

1. Register the namespace in your `components.json`:
   ```json
   { "registries": { "@birchline": "https://<your-host>/r/{name}.json" } }
   ```
2. Install the tokens once, then any component (deps resolve automatically):
   ```bash
   npx shadcn@latest add @birchline/tokens        # design tokens (do this first)
   npx shadcn@latest add @birchline/button
   npx shadcn@latest add @birchline/user-selector # pulls avatar, badge, command, …
   ```
3. Import the tokens in your global CSS (after Tailwind):
   ```css
   @import "tailwindcss";
   @import "./styles/birchline-tokens.css";
   ```

## Components

- Button (primary, secondary, ghost, destructive, outline)
- Input (with search icon variant)
- Select (single-select with dropdown)
- DropdownMenu (action menus)
- Checkbox
- Switch
- Badge (default, accent, success, warning, destructive, info)
- Tabs
- Card
- Label
- Separator

## Design Tokens

All Birchline tokens are defined in `src/index.css` using Tailwind v4's `@theme` directive — colors, typography, spacing, radius, and shadows map directly from the [Birchline Design System](https://jmcminn.github.io/birchline/birchline-design-system.html).
