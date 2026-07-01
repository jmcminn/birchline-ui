import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

describe("component interactions", () => {
  it("Button fires onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await user.click(screen.getByRole("button", { name: "Go" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("Checkbox toggles checked state", async () => {
    const user = userEvent.setup()
    function Wrapper() {
      const [v, setV] = useState(false)
      return <Checkbox aria-label="agree" checked={v} onCheckedChange={(c) => setV(c === true)} />
    }
    render(<Wrapper />)
    const cb = screen.getByRole("checkbox", { name: "agree" })
    expect(cb).toHaveAttribute("aria-checked", "false")
    await user.click(cb)
    expect(cb).toHaveAttribute("aria-checked", "true")
  })

  it("Tabs switches panels on click", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    )
    expect(screen.getByText("Panel A")).toBeInTheDocument()
    await user.click(screen.getByRole("tab", { name: "B" }))
    expect(screen.getByText("Panel B")).toBeInTheDocument()
  })

  it("Input types a value and the clear button resets it", async () => {
    const user = userEvent.setup()
    render(<Input placeholder="search" defaultValue="" />)
    const input = screen.getByPlaceholderText("search") as HTMLInputElement
    await user.type(input, "hello")
    expect(input.value).toBe("hello")
    // built-in clear button appears once there is a value
    const clear = screen.getByRole("button")
    await user.click(clear)
    expect(input.value).toBe("")
  })

  it("Dialog opens on trigger and shows its title", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.queryByText("My Dialog")).not.toBeInTheDocument()
    await user.click(screen.getByText("Open"))
    expect(await screen.findByText("My Dialog")).toBeInTheDocument()
  })

  it("DropdownMenu opens and reveals items", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.queryByText("Edit")).not.toBeInTheDocument()
    await user.click(screen.getByText("Actions"))
    expect(await screen.findByText("Edit")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })
})
