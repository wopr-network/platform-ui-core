import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      variants: _variants,
      initial: _initial,
      animate: _animate,
      whileHover: _whileHover,
      whileTap: _whileTap,
      transition: _transition,
      style,
      className,
    }: React.PropsWithChildren<{
      variants?: unknown;
      initial?: unknown;
      animate?: unknown;
      whileHover?: unknown;
      whileTap?: unknown;
      transition?: unknown;
      style?: React.CSSProperties;
      className?: string;
    }>) => (
      <div style={style} className={className}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock plugin setup chat hook
vi.mock("@/hooks/use-plugin-setup-chat", () => ({
  usePluginSetupChat: () => ({
    state: {
      isOpen: false,
      pluginName: "",
      messages: [],
      isConnected: false,
      isTyping: false,
      isComplete: false,
    },
    sendMessage: vi.fn(),
    closeSetup: vi.fn(),
    openSetup: vi.fn(),
  }),
}));

// Mock brand config
vi.mock("@/lib/brand-config", () => ({
  getBrandConfig: () => ({ productName: "TestProduct", brandName: "TestBrand" }),
}));

// Mock plugin-setup component
vi.mock("@/components/plugin-setup", () => ({
  SetupChatPanel: () => null,
}));

const mockListMarketplacePlugins = vi.fn();

vi.mock("@/lib/marketplace-data", () => ({
  listBots: vi.fn().mockResolvedValue([{ id: "bot-1", name: "Test Bot" }]),
  listMarketplacePlugins: (...args: unknown[]) => mockListMarketplacePlugins(...args),
  listInstalledPlugins: vi.fn().mockResolvedValue([]),
  togglePluginEnabled: vi.fn(),
  formatInstallCount: (n: number) => String(n),
  hasHostedOption: () => false,
}));

import PluginsPage from "@/app/plugins/page";

describe("plugins catalog error state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows error message with retry when catalog load fails", async () => {
    mockListMarketplacePlugins.mockRejectedValue(new Error("Network error"));

    render(<PluginsPage />);

    // Switch to the Catalog tab
    const catalogTab = await screen.findByRole("tab", { name: /catalog/i });
    await userEvent.click(catalogTab);

    // Should show the error message
    await waitFor(() => {
      expect(screen.getByText(/CATALOG LOAD FAILED/i)).toBeInTheDocument();
    });

    // Should show the retry button
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("retries loading when retry button is clicked", async () => {
    const catalogPlugin = {
      id: "plugin-1",
      name: "Test Plugin",
      description: "A test plugin",
      version: "1.0.0",
      color: "#ff0000",
      tags: [],
      capabilities: [],
      installCount: 100,
      author: "Test",
      category: "integration",
      configSchema: [],
    };

    // First call fails, second succeeds
    mockListMarketplacePlugins
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce([catalogPlugin]);

    render(<PluginsPage />);

    // Switch to the Catalog tab
    const catalogTab = await screen.findByRole("tab", { name: /catalog/i });
    await userEvent.click(catalogTab);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/CATALOG LOAD FAILED/i)).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByRole("button", { name: /retry/i });
    await userEvent.click(retryButton);

    // After retry, the error should be gone
    await waitFor(() => {
      expect(screen.queryByText(/CATALOG LOAD FAILED/i)).not.toBeInTheDocument();
    });

    // The loading skeleton replaces the tabs — wait for catalog tab to re-appear, then click it
    const catalogTabAgain = await screen.findByRole("tab", { name: /catalog/i });
    await userEvent.click(catalogTabAgain);

    // The plugin should now appear in the catalog
    await waitFor(() => {
      expect(screen.getByText("Test Plugin")).toBeInTheDocument();
    });
  });

  it("shows empty state (not error) when catalog loads with zero plugins", async () => {
    mockListMarketplacePlugins.mockResolvedValue([]);

    render(<PluginsPage />);

    // Switch to the Catalog tab
    const catalogTab = await screen.findByRole("tab", { name: /catalog/i });
    await userEvent.click(catalogTab);

    // Should show the normal empty state, not the error state
    await waitFor(() => {
      expect(screen.getByText(/NO MATCHING PLUGINS FOUND/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/CATALOG LOAD FAILED/i)).not.toBeInTheDocument();
  });
});
