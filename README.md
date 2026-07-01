# Birchline UI

shadcn/ui components reskinned with [Birchline](https://github.com/jmcminn/birchline) design tokens.

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
