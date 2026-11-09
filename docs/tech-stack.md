# Birchline UI: Technical Stack

Based on the `package.json`, config files and workflows in `jmcminn/birchline-ui` (`main` at `7ccebe1`). Last updated 2026-11-01.

## Core stack
- React 19 with TypeScript 6.0 (TypeScript 7 is deferred, see "Decisions and pins")
- Vite 8 (dev server and bundler), with `@vitejs/plugin-react`
- Tailwind CSS 4, via the `@tailwindcss/vite` plugin
- Node 22 in CI and the Pages deploy. `.nvmrc` pins 22 and `engines` allows `^22.22.2 || ^24.15.0 || >=26` (the range `vitest` 5 and `jsdom` 30 support; odd-numbered releases such as 25 are outside it)

## Components and UI
- Radix UI primitives: alert dialog, avatar, checkbox, collapsible, dialog, dropdown menu, label, navigation menu, popover, progress, scroll area, select, separator, slot, switch, tabs, toggle, toggle group, tooltip
- shadcn/ui conventions: `components.json`, `registry.json`, and a `shadcn build` step (shadcn pinned to 4.23.0) that writes the registry to `public/r/`
- class-variance-authority, clsx, and tailwind-merge for variants and class handling
- @tabler/icons-react for icons
- cmdk for the command palette
- sonner for toasts
- react-day-picker 10 with date-fns 4 for the calendar and dates
- dnd-kit (core, sortable, modifiers, utilities) for drag and drop

## Data tables
- TanStack Table v9 (`@tanstack/react-table`), using the v9 `useTable` / `tableFeatures` API with explicit row-model slots

## Data visualization
- Recharts 3 (`recharts` 3.10.x) with `react-is` 19, which Recharts 3 expects to match React
- `LineChart` component (`src/components/ui/line-chart.tsx`): area-filled line chart with cumulative and daily modes, an optional per-series breakdown ("By Platform"), week-based zoom, and a dark hover card. Ported from the Range Analytics events chart
- Pure data helpers in `src/lib/line-chart-data.ts` (zoom window, cumulative totals, day-over-day change, gridline anchoring) and seeded synthetic demo data in `src/lib/line-chart-sample-data.ts`
- Note: Recharts also exports its own `LineChart`, so alias one if you import both

## Design tokens
- A custom `scripts/build-tokens.mjs` generates `src/registry/birchline-tokens.css` and `tokens/birchline.tokens.json` from `tokens/birchline.tokens.mjs`. It runs automatically before each build
- Three tiers: primitives, aliases, semantic. Light and dark modes
- Chart series tokens `chart-1` to `chart-5` (with dark-mode variants for the blue, green and bronze series)

## Registry
- 36 registry items, published to GitHub Pages at `https://jmcminn.github.io/birchline-ui/r/{name}.json`
- Includes `tokens`, `utils`, the UI components, and the chart items `line-chart`, `line-chart-data` and `line-chart-sample-data`

## Testing and quality
- Vitest 5 with jsdom 30
- Testing Library (React, DOM, jest-dom 7, user-event)
- 67 tests across 5 files: smoke and interaction tests for components, characterization tests for the Tasks table, and unit and component tests for the line chart (including date handling across time zones)
- ESLint 10 with typescript-eslint, react-hooks (including the React Compiler rules), and react-refresh plugins. Lint is at 0 errors
- 0 production dependency vulnerabilities (`npm audit --omit=dev`)

## Tooling and CI
- npm (with a lockfile)
- GitHub Actions, two workflows:
  - `ci.yml`: runs on pull requests to `main` and on pushes to `main`. Steps are lint, build (which includes the `tsc -b` type-check), tests, and a registry drift check that regenerates `public/r/` and fails if it differs from what is committed
  - `pages.yml`: rebuilds the registry and deploys it to GitHub Pages on every push to `main`
- A GitHub ruleset on `main` requires the `checks` status check to pass, blocks force pushes and deletion, and has no bypass list. Merged branches are deleted automatically

## Decisions and pins
- **TypeScript 7 is deferred.** It works on this project, but `typescript-eslint` (8.72.x) does not support it yet. Revisit when `npm view typescript-eslint peerDependencies` lists TypeScript 7. The upgrade plan is saved in the project docs
- **shadcn is pinned** to 4.23.0 in `registry:build`, so registry output only changes when the version changes
- **Recharts 3** was chosen over 2.15 because 2.15 hard-depends on `react-is@18`
- `@types/node` is on 22 to match the Node version used in CI and the deploy
