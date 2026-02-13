import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/settings/profile",
}));

// Mock better-auth/react
vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({
    useSession: () => ({ data: null, isPending: false, error: null }),
    signIn: { email: vi.fn(), social: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  }),
}));

describe("Profile page", () => {
  it("renders profile heading and form fields", async () => {
    const { default: ProfilePage } = await import("../app/(dashboard)/settings/profile/page");
    render(<ProfilePage />);

    // Initially shows loading
    expect(screen.getByText("Loading profile...")).toBeInTheDocument();

    // Wait for mock data to load
    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders change password section", async () => {
    const { default: ProfilePage } = await import("../app/(dashboard)/settings/profile/page");
    render(<ProfilePage />);

    expect(await screen.findByText("Change Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change password" })).toBeInTheDocument();
  });

  it("renders connected accounts section", async () => {
    const { default: ProfilePage } = await import("../app/(dashboard)/settings/profile/page");
    render(<ProfilePage />);

    expect(await screen.findByText("Connected Accounts")).toBeInTheDocument();
    expect(screen.getByText("github")).toBeInTheDocument();
    expect(screen.getByText("discord")).toBeInTheDocument();
    expect(screen.getByText("google")).toBeInTheDocument();
  });

  it("renders delete account section", async () => {
    const { default: ProfilePage } = await import("../app/(dashboard)/settings/profile/page");
    render(<ProfilePage />);

    expect(await screen.findByText("Delete Account")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete account" })).toBeInTheDocument();
  });

  it("renders save button", async () => {
    const { default: ProfilePage } = await import("../app/(dashboard)/settings/profile/page");
    render(<ProfilePage />);

    expect(await screen.findByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});

describe("Providers page", () => {
  it("renders provider keys heading", async () => {
    const { default: ProvidersPage } = await import("../app/(dashboard)/settings/providers/page");
    render(<ProvidersPage />);

    expect(screen.getByText("Loading providers...")).toBeInTheDocument();
    expect(await screen.findByText("Provider Keys")).toBeInTheDocument();
  });

  it("renders configured providers with status", async () => {
    const { default: ProvidersPage } = await import("../app/(dashboard)/settings/providers/page");
    render(<ProvidersPage />);

    expect(await screen.findByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("xAI")).toBeInTheDocument();
  });

  it("renders BYOK messaging", async () => {
    const { default: ProvidersPage } = await import("../app/(dashboard)/settings/providers/page");
    render(<ProvidersPage />);

    expect(await screen.findByText(/Bring Your Own Key/)).toBeInTheDocument();
  });

  it("renders test connection and rotate buttons for configured providers", async () => {
    const { default: ProvidersPage } = await import("../app/(dashboard)/settings/providers/page");
    render(<ProvidersPage />);

    const testButtons = await screen.findAllByRole("button", { name: "Test connection" });
    expect(testButtons.length).toBeGreaterThanOrEqual(1);

    const rotateButtons = screen.getAllByRole("button", { name: "Rotate key" });
    expect(rotateButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders add key button for unconfigured providers", async () => {
    const { default: ProvidersPage } = await import("../app/(dashboard)/settings/providers/page");
    render(<ProvidersPage />);

    expect(await screen.findByRole("button", { name: "Add key" })).toBeInTheDocument();
  });
});

describe("API Keys page", () => {
  it("renders API keys heading and generate button", async () => {
    const { default: ApiKeysPage } = await import("../app/(dashboard)/settings/api-keys/page");
    render(<ApiKeysPage />);

    expect(screen.getByText("Loading API keys...")).toBeInTheDocument();
    expect(await screen.findByText("API Keys")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate new key" })).toBeInTheDocument();
  });

  it("renders existing API keys in table", async () => {
    const { default: ApiKeysPage } = await import("../app/(dashboard)/settings/api-keys/page");
    render(<ApiKeysPage />);

    expect(await screen.findByText("CI Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Monitoring Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
  });

  it("renders revoke buttons for each key", async () => {
    const { default: ApiKeysPage } = await import("../app/(dashboard)/settings/api-keys/page");
    render(<ApiKeysPage />);

    const revokeButtons = await screen.findAllByRole("button", { name: "Revoke" });
    expect(revokeButtons).toHaveLength(3);
  });

  it("renders scope badges", async () => {
    const { default: ApiKeysPage } = await import("../app/(dashboard)/settings/api-keys/page");
    render(<ApiKeysPage />);

    expect(await screen.findByText("full")).toBeInTheDocument();
    expect(screen.getByText("read-only")).toBeInTheDocument();
    expect(screen.getByText("instances")).toBeInTheDocument();
  });
});

describe("Organization page", () => {
  it("renders organization heading and form", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    expect(screen.getByText("Loading organization...")).toBeInTheDocument();
    expect(await screen.findByText("Organization")).toBeInTheDocument();
    expect(screen.getByLabelText("Organization name")).toBeInTheDocument();
    expect(screen.getByLabelText("Billing email")).toBeInTheDocument();
  });

  it("renders members table", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    expect(await screen.findByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Carol Davis")).toBeInTheDocument();
  });

  it("renders member roles", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    expect(await screen.findByText("owner")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("viewer")).toBeInTheDocument();
  });

  it("renders invite member button", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    expect(await screen.findByRole("button", { name: "Invite member" })).toBeInTheDocument();
  });

  it("renders remove buttons for non-owner members", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    const removeButtons = await screen.findAllByRole("button", { name: "Remove" });
    expect(removeButtons).toHaveLength(2); // Bob and Carol, not Alice (owner)
  });

  it("renders transfer buttons for non-owner members", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    const transferButtons = await screen.findAllByRole("button", { name: "Transfer" });
    expect(transferButtons).toHaveLength(2);
  });

  it("renders save button for org details", async () => {
    const { default: OrgPage } = await import("../app/(dashboard)/settings/org/page");
    render(<OrgPage />);

    expect(await screen.findByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});

describe("Settings layout", () => {
  it("renders settings navigation links", async () => {
    const { default: SettingsLayout } = await import("../app/(dashboard)/settings/layout");
    render(
      <SettingsLayout>
        <div>child content</div>
      </SettingsLayout>,
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Provider Keys")).toBeInTheDocument();
    expect(screen.getByText("API Keys")).toBeInTheDocument();
    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
