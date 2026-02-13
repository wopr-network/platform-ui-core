import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InstanceDetailClient } from "../app/instances/[id]/instance-detail-client";

vi.mock("@/lib/api", () => ({
  getInstance: vi.fn().mockResolvedValue({
    id: "inst-001",
    name: "test-instance",
    template: "General Assistant",
    status: "running",
    provider: "anthropic",
    channels: ["discord-general"],
    plugins: [
      { id: "p1", name: "memory", version: "1.2.0", enabled: true },
      { id: "p2", name: "web-search", version: "0.9.1", enabled: false },
    ],
    uptime: 86400,
    createdAt: "2026-01-15T10:00:00Z",
    config: { model: "claude-sonnet-4-5-20250514", maxTokens: 4096 },
    channelDetails: [{ id: "ch-0", name: "discord-general", type: "discord", status: "connected" }],
    sessions: [
      {
        id: "sess-001",
        userId: "user-alice",
        messageCount: 42,
        startedAt: "2026-02-12T08:00:00Z",
        lastActivityAt: "2026-02-12T09:30:00Z",
      },
    ],
    resourceUsage: { memoryMb: 256, cpuPercent: 12.5 },
  }),
  controlInstance: vi.fn().mockResolvedValue(undefined),
}));

describe("InstanceDetailClient", () => {
  it("renders instance name and status", async () => {
    render(<InstanceDetailClient instanceId="inst-001" />);

    await waitFor(() => {
      expect(screen.getByText("test-instance")).toBeInTheDocument();
    });
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("renders all tab triggers", async () => {
    render(<InstanceDetailClient instanceId="inst-001" />);

    await waitFor(() => {
      expect(screen.getByText("test-instance")).toBeInTheDocument();
    });

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Plugins" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Channels" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sessions" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Config" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Logs" })).toBeInTheDocument();
  });

  it("shows overview metrics by default", async () => {
    render(<InstanceDetailClient instanceId="inst-001" />);

    await waitFor(() => {
      expect(screen.getByText("256 MB")).toBeInTheDocument();
    });
    expect(screen.getByText("12.5%")).toBeInTheDocument();
    expect(screen.getByText("running")).toBeInTheDocument();
  });

  it("shows action buttons for running instance", async () => {
    render(<InstanceDetailClient instanceId="inst-001" />);

    await waitFor(() => {
      expect(screen.getByText("Stop")).toBeInTheDocument();
    });
    expect(screen.getByText("Restart")).toBeInTheDocument();
    expect(screen.getByText("Destroy")).toBeInTheDocument();
  });
});
