import { describe, expect, it } from "vitest";
import {
  addPluginByNpm,
  getDiscoveryQueue,
  getEnabledPlugins,
  updatePlugin,
} from "../lib/admin-marketplace-api";

describe("admin-marketplace-api", () => {
  it("getDiscoveryQueue returns only unreviewed plugins", async () => {
    const queue = await getDiscoveryQueue();
    expect(Array.isArray(queue)).toBe(true);
    for (const p of queue) {
      expect(p.reviewed).toBe(false);
    }
  });

  it("getEnabledPlugins returns only enabled plugins sorted by sort_order", async () => {
    const plugins = await getEnabledPlugins();
    expect(Array.isArray(plugins)).toBe(true);
    for (const p of plugins) {
      expect(p.enabled).toBe(true);
    }
    for (let i = 1; i < plugins.length; i++) {
      expect(plugins[i].sort_order).toBeGreaterThanOrEqual(plugins[i - 1].sort_order);
    }
  });

  it("updatePlugin returns updated plugin", async () => {
    const plugins = await getEnabledPlugins();
    if (plugins.length === 0) return;
    const updated = await updatePlugin({ id: plugins[0].id, notes: "test note" });
    expect(updated.notes).toBe("test note");
  });

  it("addPluginByNpm returns a new unreviewed plugin", async () => {
    const plugin = await addPluginByNpm({ npm_package: "@wopr-network/plugin-test" });
    expect(plugin.npm_package).toBe("@wopr-network/plugin-test");
    expect(plugin.reviewed).toBe(false);
    expect(plugin.enabled).toBe(false);
  });
});
