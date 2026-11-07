/**
 * Token inspector overlay for the Birchline showcase.
 *
 * While `active`, hovering any component that carries `data-slot` outlines it;
 * clicking pins a panel listing the colour and type tokens it uses per state.
 * The click is swallowed so inspecting a button doesn't trigger it.
 * Esc unpins, then exits.
 *
 * Every exported component (and each exported part, e.g. CardHeader, TableRow)
 * carries its own `data-slot`, shadcn v4 style. A pinned part names its parent
 * ("in Card") and offers an ↑ button to inspect the enclosing component; nested
 * components are listed under "Contains" rather than mixed into the report.
 *
 * Lives outside `src/components/ui` on purpose: it's a docs tool, not a
 * registry component.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { inspectElement, type InspectReport } from "./inspect-element"
import { STATE_LABEL } from "./parse-classes"

const SLOT_SELECTOR = "[data-slot]"
const UI_SELECTOR = "[data-inspector-ui]"
const PANEL_WIDTH = 540
/** Rough panel height, used to decide whether it opens below or above its target. */
const PANEL_EST_HEIGHT = 640

function findSlot(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null
  if (target.closest(UI_SELECTOR)) return null
  return target.closest<HTMLElement>(SLOT_SELECTOR)
}

/** Re-render on scroll/resize and on palette/mode switches. */
function useLayoutTick(enabled: boolean) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const bump = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setTick((t) => t + 1))
    }
    window.addEventListener("scroll", bump, true)
    window.addEventListener("resize", bump)
    const obs = new MutationObserver(bump)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", bump, true)
      window.removeEventListener("resize", bump)
      obs.disconnect()
    }
  }, [enabled])
  return tick
}

export function TokenInspector({ active, onExit }: { active: boolean; onExit: () => void }) {
  const [hovered, setHovered] = useState<HTMLElement | null>(null)
  const [pinned, setPinned] = useState<HTMLElement | null>(null)
  const tick = useLayoutTick(active && (!!hovered || !!pinned))
  const pinnedRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    pinnedRef.current = pinned
  }, [pinned])

  // Reset when leaving inspect mode.
  const [wasActive, setWasActive] = useState(active)
  if (wasActive !== active) {
    setWasActive(active)
    if (!active) {
      setHovered(null)
      setPinned(null)
    }
  }

  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    root.classList.add("bl-inspecting")

    const onMove = (e: MouseEvent) => setHovered(findSlot(e.target))
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(UI_SELECTOR)) return
      const slot = findSlot(e.target)
      if (slot) {
        e.preventDefault()
        e.stopPropagation()
        setPinned(slot)
      } else {
        setPinned(null)
      }
    }
    // Swallow press events too so Radix triggers (which open on pointerdown) stay put.
    const onPress = (e: Event) => {
      if (findSlot(e.target)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (pinnedRef.current) setPinned(null)
      else onExit()
    }
    document.addEventListener("mousemove", onMove, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("pointerdown", onPress, true)
    document.addEventListener("mousedown", onPress, true)
    document.addEventListener("keydown", onKey)
    return () => {
      root.classList.remove("bl-inspecting")
      document.removeEventListener("mousemove", onMove, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("pointerdown", onPress, true)
      document.removeEventListener("mousedown", onPress, true)
      document.removeEventListener("keydown", onKey)
    }
  }, [active, onExit])

  const close = useCallback(() => setPinned(null), [])

  if (!active) return null
  // `tick` is read so layout-dependent values below recompute on scroll/theme.
  void tick
  const hoverRect = hovered && hovered !== pinned && hovered.isConnected ? hovered.getBoundingClientRect() : null
  const pinRect = pinned && pinned.isConnected ? pinned.getBoundingClientRect() : null

  return (
    <div data-inspector-ui>
      {hoverRect && <Outline rect={hoverRect} label={labelFor(hovered!)} dashed />}
      {pinRect && <Outline rect={pinRect} />}
      {pinned && pinRect && <Panel el={pinned} rect={pinRect} onClose={close} onPin={setPinned} />}
      {!pinned && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] rounded-sm border border-border bg-popover px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-md">
          Inspect mode — click a component · Esc to exit
        </div>
      )}
    </div>
  )
}

function labelFor(el: HTMLElement) {
  const slot = el.getAttribute("data-slot") ?? ""
  return `<${slot.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())} />`
}

function Outline({ rect, label, dashed }: { rect: DOMRect; label?: string; dashed?: boolean }) {
  return (
    <div
      className="pointer-events-none fixed z-[60] rounded-[3px]"
      style={{
        top: rect.top - 3,
        left: rect.left - 3,
        width: rect.width + 6,
        height: rect.height + 6,
        outline: `1.5px ${dashed ? "dashed" : "solid"} var(--color-info)`,
      }}
    >
      {label && (
        <span className="absolute -top-5 left-0 whitespace-nowrap rounded-[3px] bg-info px-1.5 py-px font-mono text-[10px] text-white">
          {label}
        </span>
      )}
    </div>
  )
}

function Panel({
  el,
  rect,
  onClose,
  onPin,
}: {
  el: HTMLElement
  rect: DOMRect
  onClose: () => void
  onPin: (el: HTMLElement) => void
}) {
  // Cheap to compute; re-run every render so theme/mode switches (which bump the
  // parent's tick) pick up dark: variants and the inherited font.
  const report: InspectReport = inspectElement(el)
  // Nearest enclosing component, so a part (CardContent) can step up to its parent (Card).
  const ancestor = el.parentElement?.closest<HTMLElement>(SLOT_SELECTOR) ?? null

  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = Math.min(Math.max(12, rect.left), vw - PANEL_WIDTH - 12)
  // Open on whichever side has room for the whole panel; if neither does, take the
  // roomier side and cap the height so the panel scrolls instead of leaving the window.
  const margin = 12
  const spaceBelow = vh - rect.bottom - 10 - margin
  const spaceAbove = rect.top - 10 - margin
  const below = spaceBelow >= PANEL_EST_HEIGHT || spaceBelow >= spaceAbove
  const maxHeight = Math.max(200, Math.min(vh * 0.85, below ? spaceBelow : spaceAbove))
  const style: React.CSSProperties = below
    ? { top: rect.bottom + 10, left, width: PANEL_WIDTH, maxHeight }
    : { bottom: vh - rect.top + 10, left, width: PANEL_WIDTH, maxHeight }

  const subtitle = [
    report.parent ? `in ${report.parent}` : null,
    report.variant,
    report.size && report.size !== "default" ? `size ${report.size}` : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div
      role="dialog"
      aria-label={`Tokens for ${report.component}`}
      className="fixed z-[61] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
      style={style}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="font-mono text-[14px]">
          &lt;{report.component} /&gt;
          {subtitle && <span className="ml-2 text-muted-foreground">{subtitle}</span>}
        </div>
        {ancestor && (
          <button
            onClick={() => onPin(ancestor)}
            title="Inspect the enclosing component"
            className="ml-auto mr-1 rounded-xs px-1.5 py-0.5 font-mono text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            ↑ {labelFor(ancestor)}
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="rounded-xs p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 pb-4 pt-3 font-mono text-[13px] leading-[1.5]">
        <SectionTitle>Colors</SectionTitle>
        {/* One shared grid: label | token | uses. The token column sizes to the longest
            token, so every "uses" string starts at the same left edge. The 12px column
            gap plus the token's mr-3 gives 24px between token and uses. */}
        <div className="grid grid-cols-[72px_max-content_1fr] gap-x-3">
          {report.states.map((block, i) => (
            <StateRows key={block.state} label={STATE_LABEL[block.state]} block={block} first={i === 0} isRest={block.state === "rest"} />
          ))}
        </div>

        {report.type.length > 0 && (
          <>
            <SectionTitle className="mt-4">Text</SectionTitle>
            <div className="grid grid-cols-[72px_1fr] gap-y-2">
              {report.type.map((t) => (
                <div key={t.type} className="contents">
                  <div className="text-muted-foreground capitalize">{t.type}</div>
                  <div>
                    {t.token}
                    {t.inherited && <span className="text-muted-foreground"> (inherited)</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {report.contains.length > 0 && (
          <>
            <SectionTitle className="mt-4">Contains</SectionTitle>
            <div className="leading-6">
              {report.contains.map((c) => `<${c} />`).join("  ")}
              <span className="text-muted-foreground"> · inspect separately</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-primary ${className}`}>{children}</div>
}

function StateRows({
  label,
  block,
  first,
  isRest,
}: {
  label: string
  block: InspectReport["states"][number]
  first: boolean
  isRest: boolean
}) {
  const empty = block.colors.length === 0
  const hasNote = empty || block.effects.length > 0
  // Gap between states, not between rows within a state.
  const gap = first ? "" : "mt-5"
  return (
    <>
      <div className={`leading-6 text-muted-foreground ${gap}`}>{label}</div>
      {block.colors.length > 0 ? (
        block.colors.map((row, i) => (
          <div key={`${row.raw ? "raw:" : ""}${row.token}/${row.opacity ?? ""}`} className="contents">
            {i > 0 && <div />}
            <span className={`mr-3 flex items-center gap-1.5 whitespace-nowrap ${i > 0 ? "mt-2" : gap}`}>
              <Swatch token={row.token} opacity={row.opacity} raw={row.raw} />
              {row.raw ? (
                <>
                  {row.token}
                  <span className="text-muted-foreground">not a token</span>
                </>
              ) : (
                <>--{row.token}</>
              )}
              {row.opacity !== undefined && <span className="text-muted-foreground">/{row.opacity}%</span>}
            </span>
            <span className={`text-left leading-6 text-muted-foreground ${i > 0 ? "mt-2" : gap}`}>{row.uses.join(", ")}</span>
          </div>
        ))
      ) : null}
      {hasNote && (
        <>
          {block.colors.length > 0 && <div />}
          <div className={`col-span-2 leading-6 text-muted-foreground ${block.colors.length > 0 ? "mt-2" : gap}`}>
            {empty && (isRest ? "no color tokens" : "no new colors")}
            {empty && block.effects.length > 0 && " · "}
            {block.effects.join(" · ")}
          </div>
        </>
      )}
    </>
  )
}

/** Colour tokens that are light enough to need a stroke: --white and --ivory, plus any
 *  token that resolves to the same value (e.g. --card, --background). */
function needsStroke(token: string): boolean {
  const cs = getComputedStyle(document.documentElement)
  const norm = (v: string) => v.trim().toLowerCase()
  const value = norm(cs.getPropertyValue(`--color-${token}`))
  return value !== "" && (value === norm(cs.getPropertyValue("--color-white")) || value === norm(cs.getPropertyValue("--color-ivory")))
}

function Swatch({ token, opacity, raw }: { token: string; opacity?: number; raw?: boolean }) {
  // Raw (non-token) colours always get a stroke: we can't tell how light they are.
  const stroke = raw || (needsStroke(token) && opacity === undefined)
  return (
    <span
      className={`inline-block h-6 w-6 shrink-0 rounded-[4px] ${stroke ? "border border-border" : ""}`}
      style={{ background: raw ? token : `var(--color-${token})`, opacity: opacity !== undefined ? opacity / 100 : undefined }}
    />
  )
}
