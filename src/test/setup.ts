import "@testing-library/jest-dom/vitest"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => cleanup())

// jsdom is missing several DOM APIs that Radix UI / cmdk rely on.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
// @ts-expect-error assign test doubles
window.ResizeObserver = window.ResizeObserver || NoopObserver
// @ts-expect-error assign test doubles
window.IntersectionObserver = window.IntersectionObserver || NoopObserver

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn()
if (!Element.prototype.hasPointerCapture) Element.prototype.hasPointerCapture = () => false
if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = () => {}
if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = () => {}

// jsdom has no layout, so Recharts' ResponsiveContainer sees a 0x0 box and warns
// on every chart render. Expected here; real hover and drawing are checked in a browser.
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("of chart should be greater than 0")) return
  originalWarn(...args)
}
