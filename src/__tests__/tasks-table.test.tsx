import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "@/App"

// Characterization tests for the Tasks demo table (TanStack Table). They pin the
// user-visible behavior — column order, sorting, and search — so the table
// library can be upgraded without changing what people see.

function renderTable() {
  render(<App />)
  const table = screen
    .getAllByRole("table")
    .find((t) => within(t).queryByRole("columnheader", { name: /assignee/i }))
  if (!table) throw new Error("Tasks table not found")
  return table
}

const headerNames = (table: HTMLElement) =>
  within(table)
    .getAllByRole("columnheader")
    .map((h) => h.textContent?.trim())

// Row identity is the TASK-### id, whichever column it currently sits in.
const rowIds = (table: HTMLElement) =>
  within(table)
    .getAllByRole("row")
    .slice(1) // header row
    .map((r) => r.textContent?.match(/TASK-\d{3}/)?.[0])

// The sort handler sits on the label wrapper inside the header cell, so click the
// label text the way a person would.
const clickHeader = (table: HTMLElement, name: string) =>
  userEvent.click(within(within(table).getByRole("columnheader", { name })).getByText(name))

const ORIGINAL_ORDER = [
  "TASK-001", "TASK-002", "TASK-003", "TASK-004", "TASK-005",
  "TASK-006", "TASK-007", "TASK-008", "TASK-009", "TASK-010",
]

describe("Tasks table", () => {
  it("starts with the configured column order and sorted by priority", () => {
    const table = renderTable()
    expect(headerNames(table)).toEqual(["Priority", "Status", "Title", "Assignee", "ID"])
    // High → Medium → Low; ties keep their original relative order.
    expect(rowIds(table)).toEqual([
      "TASK-001", "TASK-004", "TASK-006", "TASK-007", // High
      "TASK-002", "TASK-005", "TASK-009", "TASK-010", // Medium
      "TASK-003", "TASK-008", // Low
    ])
  })

  it("sorts Status by workflow order, then reverses, then clears", async () => {
    const table = renderTable()

    await clickHeader(table, "Status")
    // In Progress → Todo → Backlog → Done (not alphabetical)
    expect(rowIds(table)).toEqual([
      "TASK-001", "TASK-004", "TASK-007", // In Progress
      "TASK-003", "TASK-006", "TASK-010", // Todo
      "TASK-005", "TASK-008", // Backlog
      "TASK-002", "TASK-009", // Done
    ])

    await clickHeader(table, "Status")
    expect(rowIds(table)).toEqual([
      "TASK-002", "TASK-009", // Done
      "TASK-005", "TASK-008", // Backlog
      "TASK-003", "TASK-006", "TASK-010", // Todo
      "TASK-001", "TASK-004", "TASK-007", // In Progress
    ])

    await clickHeader(table, "Status")
    expect(rowIds(table)).toEqual(ORIGINAL_ORDER)
  })

  it("sorts Priority with High first when ascending", async () => {
    const table = renderTable()
    // Priority starts ascending; the next click reverses it to Low → High.
    await clickHeader(table, "Priority")
    expect(rowIds(table)).toEqual([
      "TASK-003", "TASK-008", // Low
      "TASK-002", "TASK-005", "TASK-009", "TASK-010", // Medium
      "TASK-001", "TASK-004", "TASK-006", "TASK-007", // High
    ])
  })

  it("sorts Title alphabetically", async () => {
    const table = renderTable()
    await clickHeader(table, "Title")
    expect(rowIds(table)).toEqual([
      "TASK-005", // Add dark mode support
      "TASK-009", // Add export to CSV
      "TASK-001", // Design onboarding flow
      "TASK-004", // Fix login redirect bug
      "TASK-007", // Implement SSO integration
      "TASK-006", // Migrate to PostgreSQL 16
      "TASK-010", // Performance audit homepage
      "TASK-008", // Refactor notification service
      "TASK-002", // Set up CI/CD pipeline
      "TASK-003", // Write API documentation
    ])
  })

  it("sorts ID ascending then descending", async () => {
    const table = renderTable()
    await clickHeader(table, "ID")
    expect(rowIds(table)).toEqual(ORIGINAL_ORDER)
    await clickHeader(table, "ID")
    expect(rowIds(table)).toEqual([...ORIGINAL_ORDER].reverse())
  })

  it("does not sort by Assignee", async () => {
    const table = renderTable()
    const before = rowIds(table)
    await clickHeader(table, "Assignee")
    expect(rowIds(table)).toEqual(before)
  })

  it("filters rows from the search box and reports the count", async () => {
    const table = renderTable()
    const input = screen.getByPlaceholderText("Filter tasks…")

    await userEvent.type(input, "high")
    expect(rowIds(table)).toEqual(["TASK-001", "TASK-004", "TASK-006", "TASK-007"])
    expect(screen.getByText(/of 10 task\(s\)/)).toHaveTextContent("4 of 10 task(s)")

    // matches any column, case-insensitively (assignee initials here)
    await userEvent.clear(input)
    await userEvent.type(input, "jm")
    expect(rowIds(table)).toEqual(["TASK-001", "TASK-004", "TASK-009"])
    expect(screen.getByText(/of 10 task\(s\)/)).toHaveTextContent("3 of 10 task(s)")
  })

  it("shows an empty state when nothing matches, and recovers when cleared", async () => {
    const table = renderTable()
    const input = screen.getByPlaceholderText("Filter tasks…")

    await userEvent.type(input, "zzz-no-match")
    expect(within(table).getByText("No tasks found.")).toBeInTheDocument()
    expect(screen.getByText(/of 10 task\(s\)/)).toHaveTextContent("0 of 10 task(s)")

    await userEvent.clear(input)
    expect(rowIds(table)).toHaveLength(10)
  })
})
