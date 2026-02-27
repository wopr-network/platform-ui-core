import { describe, expect, it, vi } from "vitest";
import { platformUIToolDefinitions } from "../lib/plugin/tool-definitions";

// Mock browser APIs needed by tool modules
vi.stubGlobal("window", {
  dispatchEvent: vi.fn(),
  location: { pathname: "/" },
});
vi.stubGlobal("document", { querySelector: vi.fn() });
vi.stubGlobal("CSS", { escape: (s: string) => s });

vi.mock("@/lib/api", () => ({
  listInstances: vi.fn(),
  createInstance: vi.fn(),
  controlInstance: vi.fn(),
  getInstanceHealth: vi.fn(),
  getInstanceLogs: vi.fn(),
}));

vi.mock("@/lib/marketplace-data", () => ({
  listMarketplacePlugins: vi.fn(),
}));

import { getMarketplaceOnboardingTools } from "../lib/webmcp/marketplace-onboarding-tools";
import { getChatWebMCPTools, getWebMCPTools } from "../lib/webmcp/tools";

describe("tool definitions stay in sync with handlers", () => {
  it("every handler tool name has a matching definition", () => {
    const definitionNames = new Set(platformUIToolDefinitions.map((d) => d.name));

    const handlerTools = [
      ...getWebMCPTools(vi.fn()),
      ...getChatWebMCPTools(),
      ...getMarketplaceOnboardingTools({ router: { push: vi.fn() } }),
    ];

    for (const tool of handlerTools) {
      expect(
        definitionNames.has(tool.name),
        `Handler tool "${tool.name}" missing from platformUIToolDefinitions`,
      ).toBe(true);
    }
  });

  it("every definition has a matching handler", () => {
    const handlerTools = [
      ...getWebMCPTools(vi.fn()),
      ...getChatWebMCPTools(),
      ...getMarketplaceOnboardingTools({ router: { push: vi.fn() } }),
    ];
    const handlerNames = new Set(handlerTools.map((t) => t.name));

    for (const def of platformUIToolDefinitions) {
      expect(handlerNames.has(def.name), `Definition "${def.name}" has no matching handler`).toBe(
        true,
      );
    }
  });
});
