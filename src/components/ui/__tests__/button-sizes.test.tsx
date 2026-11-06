import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "../button"

const cases = [
  ["lg", ["h-[38px]", "px-4", "text-sm"]],
  ["default", ["h-[38px]", "px-4", "text-sm"]],
  ["md", ["h-8", "px-3", "text-[13px]"]],
  ["sm", ["h-7", "px-2.5", "text-xs"]],
] as const

describe("Button sizes", () => {
  it.each(cases)("size %s applies its height, padding and type size", (size, classes) => {
    render(<Button size={size}>Go</Button>)
    const btn = screen.getByRole("button")
    for (const c of classes) expect(btn.className).toContain(c)
  })

  it("defaults to md", () => {
    render(<Button>Go</Button>)
    const btn = screen.getByRole("button")
    expect(btn.dataset.size).toBe("lg")
    expect(btn.className).toContain("h-[38px]")
  })
})
