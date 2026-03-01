import { afterEach, describe, expect, it, vi } from "vitest";

describe("api-config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses default PLATFORM_BASE_URL when env is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", undefined as unknown as string);
    vi.resetModules();
    const { PLATFORM_BASE_URL } = await import("./api-config");
    expect(PLATFORM_BASE_URL).toBe("http://localhost:3001");
  });

  it("uses NEXT_PUBLIC_API_URL when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.wopr.bot");
    vi.resetModules();
    const { PLATFORM_BASE_URL } = await import("./api-config");
    expect(PLATFORM_BASE_URL).toBe("https://api.wopr.bot");
  });

  it("derives API_BASE_URL from PLATFORM_BASE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.wopr.bot");
    vi.resetModules();
    const { API_BASE_URL } = await import("./api-config");
    expect(API_BASE_URL).toBe("https://api.wopr.bot/api");
  });

  it("uses default API_BASE_URL when env not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", undefined as unknown as string);
    vi.resetModules();
    const { API_BASE_URL } = await import("./api-config");
    expect(API_BASE_URL).toBe("http://localhost:3001/api");
  });

  it("uses default SITE_URL when env is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined as unknown as string);
    vi.resetModules();
    const { SITE_URL } = await import("./api-config");
    expect(SITE_URL).toBe("https://wopr.bot");
  });

  it("uses NEXT_PUBLIC_SITE_URL when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.wopr.bot");
    vi.resetModules();
    const { SITE_URL } = await import("./api-config");
    expect(SITE_URL).toBe("https://staging.wopr.bot");
  });
});
