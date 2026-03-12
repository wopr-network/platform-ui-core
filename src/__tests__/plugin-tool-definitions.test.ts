import { describe, expect, it } from "vitest";
import { platformUIToolDefinitions } from "../lib/plugin/tool-definitions";

describe("platformUIToolDefinitions", () => {
  it("exports an array of tool definitions", () => {
    expect(Array.isArray(platformUIToolDefinitions)).toBe(true);
    expect(platformUIToolDefinitions.length).toBeGreaterThan(0);
  });

  it("every definition has name, description, and inputSchema", () => {
    for (const def of platformUIToolDefinitions) {
      expect(typeof def.name).toBe("string");
      expect(typeof def.description).toBe("string");
      expect(typeof def.inputSchema).toBe("object");
    }
  });

  it("does not include handler functions (definitions only)", () => {
    for (const def of platformUIToolDefinitions) {
      expect(def).not.toHaveProperty("handler");
    }
  });

  it("includes expected fleet tools", () => {
    const names = platformUIToolDefinitions.map((d) => d.name);
    expect(names).toContain("platform_list_instances");
    expect(names).toContain("platform_create_instance");
    expect(names).toContain("platform_control_instance");
  });

  it("includes expected marketplace tools", () => {
    const names = platformUIToolDefinitions.map((d) => d.name);
    expect(names).toContain("marketplace.showSuperpowers");
    expect(names).toContain("marketplace.highlightCard");
    expect(names).toContain("marketplace.openDetail");
  });

  it("includes expected onboarding tools", () => {
    const names = platformUIToolDefinitions.map((d) => d.name);
    expect(names).toContain("onboarding.beginSetup");
    expect(names).toContain("onboarding.markComplete");
    expect(names).toContain("onboarding.showPricing");
  });

  it("includes expected chat tools", () => {
    const names = platformUIToolDefinitions.map((d) => d.name);
    expect(names).toContain("chat_expand");
    expect(names).toContain("chat_collapse");
    expect(names).toContain("chat_fullscreen");
  });
});
