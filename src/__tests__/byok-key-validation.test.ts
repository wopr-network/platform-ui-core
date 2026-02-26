import { describe, expect, it, vi } from "vitest";

// Mock the settings-api module
const mockTestProviderKey = vi.fn();
vi.mock("@/lib/settings-api", () => ({
  testProviderKey: (...args: unknown[]) => mockTestProviderKey(...args),
  saveProviderKey: vi.fn(),
  listCapabilities: vi.fn().mockResolvedValue([]),
  updateCapability: vi.fn(),
  getNotificationPreferences: vi.fn().mockResolvedValue({}),
  updateNotificationPreferences: vi.fn(),
}));

// Mock api module to prevent real fetches
vi.mock("@/lib/api", () => ({
  deployInstance: vi.fn(),
  getCreditBalance: vi.fn().mockResolvedValue({ balance: 0 }),
  listInstances: vi.fn().mockResolvedValue([]),
  testChannelConnection: vi.fn(),
  storeTenantKey: vi.fn(),
}));

import { act, renderHook } from "@testing-library/react";
import { useOnboarding } from "@/components/onboarding/use-onboarding";

describe("BYOK key async validation", () => {
  it("byokKeyValidationStatus is exposed in state", () => {
    const { result } = renderHook(() => useOnboarding());
    const [state] = result.current;
    expect(state.byokKeyValidationStatus).toEqual({});
    expect(state.byokKeyValidationErrors).toEqual({});
  });

  it("validateByokKeyAsync calls testProviderKey and sets valid on success", async () => {
    mockTestProviderKey.mockResolvedValueOnce({ valid: true });
    const { result } = renderHook(() => useOnboarding());

    // Set provider mode and key value first
    act(() => {
      const [, actions] = result.current;
      actions.setProviderMode("byok");
      actions.setByokAiProvider("openai");
      actions.setByokKeyValue("openai_api_key", "sk-realkey123");
    });

    await act(async () => {
      const [, actions] = result.current;
      await actions.validateByokKeyAsync("openai_api_key");
    });

    expect(mockTestProviderKey).toHaveBeenCalledWith("openai", "sk-realkey123");
    const [state] = result.current;
    expect(state.byokKeyValidationStatus.openai_api_key).toBe("valid");
  });

  it("validateByokKeyAsync sets invalid with error message on failure", async () => {
    mockTestProviderKey.mockResolvedValueOnce({ valid: false, error: "Invalid key" });
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      const [, actions] = result.current;
      actions.setProviderMode("byok");
      actions.setByokAiProvider("openai");
      actions.setByokKeyValue("openai_api_key", "sk-badkey");
    });

    await act(async () => {
      const [, actions] = result.current;
      await actions.validateByokKeyAsync("openai_api_key");
    });

    const [state] = result.current;
    expect(state.byokKeyValidationStatus.openai_api_key).toBe("invalid");
    expect(state.byokKeyValidationErrors.openai_api_key).toBe("Invalid key");
  });

  it("validateByokKeyAsync handles network errors gracefully", async () => {
    mockTestProviderKey.mockRejectedValueOnce(new Error("fetch failed"));
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      const [, actions] = result.current;
      actions.setProviderMode("byok");
      actions.setByokAiProvider("openai");
      actions.setByokKeyValue("openai_api_key", "sk-something");
    });

    await act(async () => {
      const [, actions] = result.current;
      await actions.validateByokKeyAsync("openai_api_key");
    });

    const [state] = result.current;
    expect(state.byokKeyValidationStatus.openai_api_key).toBe("invalid");
    expect(state.byokKeyValidationErrors.openai_api_key).toBe(
      "Could not validate key. Check your connection and try again.",
    );
  });

  it("resets validation status when key value changes", async () => {
    mockTestProviderKey.mockResolvedValueOnce({ valid: true });
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      const [, actions] = result.current;
      actions.setByokKeyValue("openai_api_key", "sk-key1");
    });

    await act(async () => {
      const [, actions] = result.current;
      await actions.validateByokKeyAsync("openai_api_key");
    });

    expect(result.current[0].byokKeyValidationStatus.openai_api_key).toBe("valid");

    // Change the key value — should reset to idle
    act(() => {
      const [, actions] = result.current;
      actions.setByokKeyValue("openai_api_key", "sk-key2");
    });

    expect(result.current[0].byokKeyValidationStatus.openai_api_key).toBe("idle");
    expect(result.current[0].byokKeyValidationErrors.openai_api_key).toBeNull();
  });
});
