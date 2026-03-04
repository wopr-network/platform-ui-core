import { beforeEach, describe, expect, it, vi } from "vitest";

// ---- Mock tRPC client ----
const { mockListPlugins, mockUpdatePlugin, mockAddPlugin } = vi.hoisted(() => ({
  mockListPlugins: { query: vi.fn() },
  mockUpdatePlugin: { mutate: vi.fn() },
  mockAddPlugin: { mutate: vi.fn() },
}));

vi.mock("@/lib/trpc", () => ({
  trpcVanilla: {
    adminMarketplace: {
      listPlugins: mockListPlugins,
      updatePlugin: mockUpdatePlugin,
      addPlugin: mockAddPlugin,
    },
  },
  trpc: {},
}));

vi.mock("@/lib/logger", () => ({
  logger: () => ({ warn: vi.fn(), error: vi.fn() }),
}));

import type { AdminPlugin } from "@/lib/admin-marketplace-api";
import {
  addPluginByNpm,
  getAllPlugins,
  getDiscoveryQueue,
  getEnabledPlugins,
  isMockMode,
  reorderPlugins,
  updatePlugin,
} from "@/lib/admin-marketplace-api";

function fakePlugin(overrides: Partial<AdminPlugin> = {}): AdminPlugin {
  return {
    id: "test-1",
    npm_package: "@test/plugin",
    name: "Test Plugin",
    description: "A test plugin",
    version: "1.0.0",
    author: "Test",
    category: "utility",
    icon_url: null,
    enabled: true,
    featured: false,
    sort_order: 0,
    notes: "",
    superpower_md: null,
    discovered_at: 1000,
    enabled_at: 2000,
    reviewed: true,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("isMockMode", () => {
  it("returns true when NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE is not set", () => {
    delete process.env.NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE;
    expect(isMockMode()).toBe(true);
  });

  it("returns true when NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE is not 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "false");
    expect(isMockMode()).toBe(true);
  });

  it("returns false when NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE is 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    expect(isMockMode()).toBe(false);
  });
});

describe("getAllPlugins", () => {
  it("returns plugins from tRPC when API succeeds", async () => {
    const plugins = [fakePlugin()];
    mockListPlugins.query.mockResolvedValue(plugins);

    const result = await getAllPlugins();

    expect(mockListPlugins.query).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(plugins);
  });

  it("falls back to mock data when API fails in mock mode", async () => {
    mockListPlugins.query.mockRejectedValue(new Error("API down"));

    const result = await getAllPlugins();

    expect(result.length).toBe(6);
    expect(result[0].npm_package).toBe("@wopr-network/plugin-discord");
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockListPlugins.query.mockRejectedValue(new Error("API down"));

    await expect(getAllPlugins()).rejects.toThrow("API down");
  });
});

describe("getDiscoveryQueue", () => {
  it("returns only unreviewed plugins from tRPC", async () => {
    const plugins = [
      fakePlugin({ id: "a", reviewed: true }),
      fakePlugin({ id: "b", reviewed: false }),
    ];
    mockListPlugins.query.mockResolvedValue(plugins);

    const result = await getDiscoveryQueue();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });

  it("falls back to mock data filtered by !reviewed in mock mode", async () => {
    mockListPlugins.query.mockRejectedValue(new Error("fail"));

    const result = await getDiscoveryQueue();

    expect(result.length).toBe(2);
    expect(result.every((p) => !p.reviewed)).toBe(true);
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockListPlugins.query.mockRejectedValue(new Error("fail"));

    await expect(getDiscoveryQueue()).rejects.toThrow("fail");
  });
});

describe("getEnabledPlugins", () => {
  it("returns enabled+reviewed plugins sorted by sort_order from tRPC", async () => {
    const plugins = [
      fakePlugin({ id: "b", enabled: true, reviewed: true, sort_order: 2 }),
      fakePlugin({ id: "a", enabled: true, reviewed: true, sort_order: 1 }),
      fakePlugin({ id: "c", enabled: false, reviewed: true, sort_order: 0 }),
      fakePlugin({ id: "d", enabled: true, reviewed: false, sort_order: 0 }),
    ];
    mockListPlugins.query.mockResolvedValue(plugins);

    const result = await getEnabledPlugins();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("falls back to mock data in mock mode", async () => {
    mockListPlugins.query.mockRejectedValue(new Error("fail"));

    const result = await getEnabledPlugins();

    expect(result.length).toBe(4);
    expect(result.every((p) => p.enabled && p.reviewed)).toBe(true);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].sort_order).toBeGreaterThanOrEqual(result[i - 1].sort_order);
    }
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockListPlugins.query.mockRejectedValue(new Error("fail"));

    await expect(getEnabledPlugins()).rejects.toThrow("fail");
  });
});

describe("updatePlugin", () => {
  it("calls tRPC mutate and returns updated plugin on success", async () => {
    const updated = fakePlugin({ id: "x", notes: "updated" });
    mockUpdatePlugin.mutate.mockResolvedValue(updated);

    const result = await updatePlugin({ id: "x", notes: "updated" });

    expect(mockUpdatePlugin.mutate).toHaveBeenCalledWith({ id: "x", notes: "updated" });
    expect(result).toEqual(updated);
  });

  it("falls back to mock data in mock mode and applies partial updates", async () => {
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    const result = await updatePlugin({ id: "discord", notes: "new note", featured: false });

    expect(result.id).toBe("discord");
    expect(result.notes).toBe("new note");
    expect(result.featured).toBe(false);
  });

  it("sets enabled_at when enabling a plugin that had null enabled_at in mock mode", async () => {
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    const result = await updatePlugin({ id: "code-review-bot", enabled: true });

    expect(result.enabled).toBe(true);
    expect(result.enabled_at).toBeTypeOf("number");
    expect(result.enabled_at).toBeGreaterThan(0);
  });

  it("throws Plugin not found for unknown id in mock mode", async () => {
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    await expect(updatePlugin({ id: "nonexistent" })).rejects.toThrow(
      "Plugin not found: nonexistent",
    );
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    await expect(updatePlugin({ id: "x" })).rejects.toThrow("fail");
  });
});

describe("addPluginByNpm", () => {
  it("calls tRPC mutate and returns new plugin on success", async () => {
    const newPlugin = fakePlugin({ npm_package: "@foo/bar" });
    mockAddPlugin.mutate.mockResolvedValue(newPlugin);

    const result = await addPluginByNpm({ npm_package: "@foo/bar" });

    expect(mockAddPlugin.mutate).toHaveBeenCalledWith({ npm_package: "@foo/bar" });
    expect(result).toEqual(newPlugin);
  });

  it("falls back to mock data in mock mode with scoped package", async () => {
    mockAddPlugin.mutate.mockRejectedValue(new Error("fail"));

    const result = await addPluginByNpm({ npm_package: "@scope/my-plugin" });

    expect(result.npm_package).toBe("@scope/my-plugin");
    expect(result.name).toBe("my-plugin");
    expect(result.enabled).toBe(false);
    expect(result.reviewed).toBe(false);
    expect(result.version).toBe("0.0.0");
  });

  it("falls back to mock data in mock mode with unscoped package", async () => {
    mockAddPlugin.mutate.mockRejectedValue(new Error("fail"));

    const result = await addPluginByNpm({ npm_package: "simple-plugin" });

    expect(result.name).toBe("simple-plugin");
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockAddPlugin.mutate.mockRejectedValue(new Error("fail"));

    await expect(addPluginByNpm({ npm_package: "@foo/bar" })).rejects.toThrow("fail");
  });
});

describe("reorderPlugins", () => {
  it("calls updatePlugin.mutate for each id with correct sort_order", async () => {
    mockUpdatePlugin.mutate.mockResolvedValue({});

    await reorderPlugins(["c", "a", "b"]);

    expect(mockUpdatePlugin.mutate).toHaveBeenCalledTimes(3);
    expect(mockUpdatePlugin.mutate).toHaveBeenCalledWith({ id: "c", sort_order: 0 });
    expect(mockUpdatePlugin.mutate).toHaveBeenCalledWith({ id: "a", sort_order: 1 });
    expect(mockUpdatePlugin.mutate).toHaveBeenCalledWith({ id: "b", sort_order: 2 });
  });

  it("handles empty array without calling mutate", async () => {
    await reorderPlugins([]);

    expect(mockUpdatePlugin.mutate).not.toHaveBeenCalled();
  });

  it("silently succeeds in mock mode when API fails", async () => {
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    await expect(reorderPlugins(["a"])).resolves.toBeUndefined();
  });

  it("throws when API fails in live mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_MARKETPLACE_LIVE", "true");
    mockUpdatePlugin.mutate.mockRejectedValue(new Error("fail"));

    await expect(reorderPlugins(["a"])).rejects.toThrow("fail");
  });
});
