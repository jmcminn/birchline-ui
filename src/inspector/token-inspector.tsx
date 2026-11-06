/**
 * Token inspector overlay for the Birchline showcase.
 *
 * While `active`, hovering any component that carries `data-slot` outlines it;
 * clicking pins a panel listing the colour and type tokens it uses per state.
 * The click is swallowed so inspecting a button doesn't trigger it.
 * Esc unpins, then exits.
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
const PANEL_WIDTH = 400

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
      {pinned && pinRect && <Panel el={pinned} rect={pinRect} onClose={close} />}
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

function Panel({ el, rect, onClose }: { el: HTMLElement; rect: DOMRect; onClose: () => void }) {
  // Cheap to compute; re-run every render so theme/mode switches (which bump the
  // parent's tick) pick up dark: variants and the inherited font.
  const report: InspectReport = inspectElement(el)

  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = Math.min(Math.max(12, rect.left), vw - PANEL_WIDTH - 12)
  const below = vh - rect.bottom > 280 || rect.top < 280
  const style: React.CSSProperties = below
    ? { top: rect.bottom + 10, left, width: PANEL_WIDTH }
    : { bottom: vh - rect.top + 10, left, width: PANEL_WIDTH }

  const subtitle = [report.variant, report.size && report.size !== "default" ? `size ${report.size}` : null]
    .filter(Boolean)
    .join(" · ")

  return (
    <div
      role="dialog"
      aria-label={`Tokens for ${report.component}`}
      className="fixed z-[61] max-h-[70vh] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
      style={style}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="font-mono text-[13px]">
          &lt;{report.component} /&gt;
          {subtitle && <span className="ml-2 text-muted-foreground">{subtitle}</span>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="rounded-xs p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 pb-4 pt-3 font-mono text-[11.5px] leading-[1.5]">
        <SectionTitle>Colors</SectionTitle>
        <div className="grid grid-cols-[72px_1fr] gap-y-2.5">
          {report.states.map((block) => (
            <StateRows key={block.state} label={STATE_LABEL[block.state]} block={block} />
          ))}
        </div>

        {report.type.length > 0 && (
          <>
            <SectionTitle className="mt-4">Text</SectionTitle>
            <div className="grid grid-cols-[72px_1fr] gap-y-1">
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
      </div>
    </div>
  )
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-2 text-[10px] uppercase tracking-[0.08em] text-muted-foreground ${className}`}>{children}</div>
}

function StateRows({ label, block }: { label: string; block: InspectReport["states"][number] }) {
  const empty = block.colors.length === 0
  return (
    <>
      <div className="text-muted-foreground">{label}</div>
      <div className="flex flex-col gap-1">
        {block.colors.map((row) => (
          <div key={`${row.token}/${row.opacity ?? ""}`} className="grid grid-cols-[minmax(0,auto)_1fr] items-baseline gap-x-3">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Swatch token={row.token} opacity={row.opacity} />
              --{row.token}
              {row.opacity !== undefined && <span className="text-muted-foreground">/{row.opacity}%</span>}
            </span>
            <span className="text-right text-muted-foreground">
              {row.uses.join(", ")}
            </span>
          </div>
        ))}
        {(empty || block.effects.length > 0) && (
          <div className="text-muted-foreground">
            {empty && "no new colors"}
            {empty && block.effects.length > 0 && " · "}
            {block.effects.join(" · ")}
          </div>
        )}
      </div>
    </>
  )
}

function Swatch({ token, opacity }: { token: string; opacity?: number }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] border border-border"
      style={{ background: `var(--color-${token})`, opacity: opacity !== undefined ? opacity / 100 : undefined }}
    />
  )
}
