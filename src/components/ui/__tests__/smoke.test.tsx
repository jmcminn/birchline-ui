import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

describe("component smoke tests", () => {
  it("Button renders its label and variant classes", () => {
    render(<Button variant="outline">Click me</Button>)
    const btn = screen.getByRole("button", { name: "Click me" })
    expect(btn).toBeInTheDocument()
    // routed through semantic tokens after refactor
    expect(btn.className).toContain("border-border")
  })

  it("Button supports asChild (renders as anchor)", () => {
    render(
      <Button asChild>
        <a href="/x">link</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "link" })
    expect(link).toHaveAttribute("href", "/x")
  })

  it("Badge renders", () => {
    render(<Badge variant="accent">New</Badge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("Input and Textarea render", () => {
    render(
      <>
        <Input placeholder="name" />
        <Textarea placeholder="desc" />
      </>
    )
    expect(screen.getByPlaceholderText("name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("desc")).toBeInTheDocument()
  })

  it("Label, Separator, Skeleton render", () => {
    render(
      <>
        <Label>Field</Label>
        <Separator data-testid="sep" />
        <Skeleton data-testid="sk" className="h-4 w-4" />
      </>
    )
    expect(screen.getByText("Field")).toBeInTheDocument()
    expect(screen.getByTestId("sep")).toBeInTheDocument()
    expect(screen.getByTestId("sk")).toBeInTheDocument()
  })

  it("Switch and Checkbox render as controls", () => {
    render(
      <>
        <Switch aria-label="notify" />
        <Checkbox aria-label="agree" />
      </>
    )
    expect(screen.getByRole("switch", { name: "notify" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "agree" })).toBeInTheDocument()
  })

  it("Progress renders", () => {
    render(<Progress value={40} />)
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("Avatar fallback renders", () => {
    render(
      <Avatar>
        <AvatarFallback>JM</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("JM")).toBeInTheDocument()
  })

  it("Card composes its parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>
    )
    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Desc")).toBeInTheDocument()
    expect(screen.getByText("Body")).toBeInTheDocument()
    expect(screen.getByText("Foot")).toBeInTheDocument()
  })

  it("Alert renders title and description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened</AlertDescription>
      </Alert>
    )
    expect(screen.getByText("Heads up")).toBeInTheDocument()
    expect(screen.getByText("Something happened")).toBeInTheDocument()
  })

  it("Tabs render the default tab content", () => {
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
  })
})
