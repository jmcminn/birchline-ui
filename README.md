# Birchline UI

shadcn/ui components reskinned with [Birchline](https://github.com/jmcminn/birchline) design tokens.

## Documentation

- [Foundations](./docs/foundations.md) — token architecture, color roles, type ramp, spacing, theming, focus.
- [Components](./docs/components.md) — index, install commands, and "which one do I use?" guidance.
- [Changelog](./CHANGELOG.md) — notable changes and the token versioning policy.

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
compiles it to servable JSON in `public/r/`, which is published to GitHub Pages
by [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) on every push
to `main` and served at **`https://jmcminn.github.io/birchline-ui/r/{name}.json`**.

**Consume it** from any Tailwind v4 + shadcn project:

1. Register the namespace in your `components.json`:
   ```json
   { "registries": { "@birchline": "https://jmcminn.github.io/birchline-ui/r/{name}.json" } }
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

Tokens follow a three-tier architecture (primitives → aliases → semantic) so a
hex value lives in exactly one place. The **single source of truth** is
[`tokens/birchline.tokens.mjs`](./tokens/birchline.tokens.mjs); edit it there and
run:

```bash
npm run tokens:build
```

That generates two artifacts (never hand-edit them):

- [`src/registry/birchline-tokens.css`](./src/registry/birchline-tokens.css) —
  the Tailwind v4 `@theme` file the app and shadcn registry consume.
- [`tokens/birchline.tokens.json`](./tokens/birchline.tokens.json) — a portable
  **W3C DTCG** document for Figma, native, and other-platform tooling.

`build` and `registry:build` regenerate automatically. Theming composes two
independent axes — palette (`data-theme`: Muted / `bright`) × mode (`data-mode`:
light / `dark`). See [Foundations](./docs/foundations.md) for the full token
reference and theming guide, and [CHANGELOG.md](./CHANGELOG.md) for the
versioning policy (tokens are a public API).
