import { afterEach, describe, expect, it, vi } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
});
vi.stubGlobal("fetch", mockFetch);

const mockControlInstance = vi.fn().mockResolvedValue({ ok: true });

vi.mock("@/lib/trpc", () => ({
  trpcVanilla: {
    fleet: {
      listInstances: { query: vi.fn() },
      getInstance: { query: vi.fn() },
      createInstance: { mutate: vi.fn() },
      controlInstance: { mutate: mockControlInstance },
      getInstanceHealth: { query: vi.fn() },
      getInstanceLogs: { query: vi.fn() },
      getInstanceMetrics: { query: vi.fn() },
      listTemplates: { query: vi.fn() },
    },
  },
  trpc: {},
}));

// Mock api-config
vi.mock("@/lib/api-config", () => ({
  API_BASE_URL: "https://api.test/api",
  PLATFORM_BASE_URL: "https://api.test",
}));

describe("controlInstance HTTP behavior", () => {
  afterEach(() => {
    mockFetch.mockClear();
    mockControlInstance.mockClear();
  });

  it("sends DELETE /fleet/bots/:id for destroy action (still REST)", async () => {
    const { controlInstance } = await import("@/lib/api");
    await controlInstance("bot-123", "destroy");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test/fleet/bots/bot-123",
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(mockControlInstance).not.toHaveBeenCalled();
  });

  it("uses tRPC for start action", async () => {
    const { controlInstance } = await import("@/lib/api");
    await controlInstance("bot-123", "start");

    expect(mockControlInstance).toHaveBeenCalledWith({ id: "bot-123", action: "start" });
  });

  it("uses tRPC for stop action", async () => {
    const { controlInstance } = await import("@/lib/api");
    await controlInstance("bot-123", "stop");

    expect(mockControlInstance).toHaveBeenCalledWith({ id: "bot-123", action: "stop" });
  });

  it("uses tRPC for restart action", async () => {
    const { controlInstance } = await import("@/lib/api");
    await controlInstance("bot-123", "restart");

    expect(mockControlInstance).toHaveBeenCalledWith({ id: "bot-123", action: "restart" });
  });
});
