import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InstanceListClient } from "../app/instances/instance-list-client";

vi.mock("@/lib/api", () => ({
  listInstances: vi.fn().mockResolvedValue([
    {
      id: "inst-001",
      name: "test-instance",
      template: "General Assistant",
      status: "running",
      provider: "anthropic",
      channels: ["discord"],
      plugins: [{ id: "p1", name: "memory", version: "1.0.0", enabled: true }],
      uptime: 3600,
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "inst-002",
      name: "stopped-bot",
      template: "Code Helper",
      status: "stopped",
      provider: "openai",
      channels: [],
      plugins: [],
      uptime: null,
      createdAt: "2026-01-02T00:00:00Z",
    },
  ]),
  controlInstance: vi.fn().mockResolvedValue(undefined),
}));

describe("InstanceListClient", () => {
  it("renders instance list with mock data", async () => {
    render(<InstanceListClient />);

    await waitFor(() => {
      expect(screen.getByText("test-instance")).toBeInTheDocument();
    });
    expect(screen.getByText("stopped-bot")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("Stopped")).toBeInTheDocument();
  });

  it("renders the page heading", async () => {
    render(<InstanceListClient />);

    expect(screen.getByText("Instances")).toBeInTheDocument();
    expect(screen.getByText("Manage your WOPR instances")).toBeInTheDocument();
  });

  it("has a New Instance button linking to /instances/new", async () => {
    render(<InstanceListClient />);

    const link = screen.getByText("New Instance");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/instances/new");
  });

  it("filters by search text", async () => {
    const user = userEvent.setup();
    render(<InstanceListClient />);

    await waitFor(() => {
      expect(screen.getByText("test-instance")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search by name or template...");
    await user.type(searchInput, "stopped");

    expect(screen.queryByText("test-instance")).not.toBeInTheDocument();
    expect(screen.getByText("stopped-bot")).toBeInTheDocument();
  });
});
