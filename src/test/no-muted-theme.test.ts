import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const root = resolve(__dirname, "../..")
const read = (p: string) => readFileSync(resolve(root, p), "utf8")

describe("single accent palette (Muted theme removed)", () => {
  it("emits no data-theme selector", () => {
    expect(read("src/registry/birchline-tokens.css")).not.toMatch(/data-theme/)
  })
  it("only ships a dark mode override", () => {
    const json = JSON.parse(read("tokens/birchline.tokens.json"))
    expect(Object.keys(json.$extensions["com.birchline.modes"])).toEqual(["dark"])
  })
  it("base accents are the former Bright values", () => {
    const css = read("src/registry/birchline-tokens.css")
    expect(css).toMatch(/--color-clay: #D05E38;/)
    expect(css).toMatch(/--color-teal: #5DB2AC;/)
  })
})
