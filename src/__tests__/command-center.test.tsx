import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({
  getFleetHealth: vi.fn().mockResolvedValue([
    {
      id: "inst-001",
      name: "prod-assistant",
      status: "running",
      health: "healthy",
      uptime: 86400,
      pluginCount: 2,
      sessionCount: 5,
      provider: "anthropic",
    },
    {
      id: "inst-002",
      name: "dev-bot",
      status: "stopped",
      health: "healthy",
      uptime: null,
      pluginCount: 1,
      sessionCount: 0,
      provider: "openai",
    },
    {
      id: "inst-003",
      name: "community-mod",
      status: "running",
      health: "degraded",
      uptime: 3600,
      pluginCount: 3,
      sessionCount: 0,
      provider: "openai",
    },
  ]),
}));

import { CommandCenter } from "../components/dashboard/command-center";

describe("CommandCenter", () => {
  it("renders the page heading", () => {
    render(<CommandCenter />);
    expect(screen.getByText("Command Center")).toBeInTheDocument();
    expect(screen.getByText("Fleet overview and quick actions")).toBeInTheDocument();
  });

  it("renders fleet summary cards with counts after loading", async () => {
    render(<CommandCenter />);

    await waitFor(() => {
      expect(screen.getByTestId("running-count")).toHaveTextContent("2");
    });
    expect(screen.getByTestId("stopped-count")).toHaveTextContent("1");
    expect(screen.getByTestId("degraded-count")).toHaveTextContent("1");
  });

  it("shows resource usage", async () => {
    render(<CommandCenter />);

    await waitFor(() => {
      expect(screen.getByTestId("cpu-usage")).not.toHaveTextContent("--");
    });
    expect(screen.getByTestId("memory-usage")).not.toHaveTextContent("--");
  });

  it("renders the activity feed", () => {
    render(<CommandCenter />);
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getAllByText("created instance").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("installed plugin")).toBeInTheDocument();
  });

  it("renders quick action buttons with correct links", () => {
    render(<CommandCenter />);

    const launchLink = screen.getByText("Launch New Instance").closest("a");
    expect(launchLink).toHaveAttribute("href", "/instances/new");

    const healthLink = screen.getByText("Fleet Health").closest("a");
    expect(healthLink).toHaveAttribute("href", "/fleet/health");

    const pluginsLink = screen.getByText("Manage Plugins").closest("a");
    expect(pluginsLink).toHaveAttribute("href", "/plugins");

    const billingLink = screen.getByText("Billing Overview").closest("a");
    expect(billingLink).toHaveAttribute("href", "/billing/usage");
  });

  it("activity feed items are clickable links", () => {
    render(<CommandCenter />);

    const link = screen.getByText("prod-assistant").closest("a");
    expect(link).toHaveAttribute("href", "/instances/inst-001");
  });
});
