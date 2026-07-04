# Reference material

Historical design references for Birchline UI. Not part of the build or the
component library — kept purely for provenance and context.

## `birchline-design-system.html`

The **original, single-file design-system prototype** that Birchline UI grew
out of (preserved from the now-retired `jmcminn/birchline` repo, created
2026-05-11). It's a self-contained HTML page — open it directly in a browser,
no build step.

Adapted from Thariq's design-system example:
<https://thariqs.github.io/html-effectiveness/05-design-system.html>

### Why keep it

It documents the **original token vocabulary**, some of which was renamed as the
system moved into React. Handy when you run across the old names in git history
or older references:

| Original name | Current token (`src/registry/birchline-tokens.css`) |
| ------------- | --------------------------------------------------- |
| `--slate` `#141413`      | `--color-ink` `#141413` |
| `--olive` `#788C5D`      | `--color-green` `#5F7348` |
| `--dusty-plum` `#7B6B8A` | `--color-plum` `#7B6B8A` |
| `--sea-glass` `#5B8E8A`  | `--color-teal` `#5B8E8A` |
| `--clay`, `--oat`, `--ivory`, grays | carried over largely unchanged |

This is a **frozen snapshot**, not a living document — the canonical tokens and
components live in `src/`.
