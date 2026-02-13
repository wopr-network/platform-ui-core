import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateInstanceClient } from "../app/instances/new/create-instance-client";

vi.mock("@/lib/api", () => ({
  listTemplates: vi.fn().mockResolvedValue([
    {
      id: "general",
      name: "General Assistant",
      description: "A versatile assistant.",
      icon: "Bot",
      defaultPlugins: ["memory"],
    },
    {
      id: "coding",
      name: "Code Helper",
      description: "For code tasks.",
      icon: "Code",
      defaultPlugins: ["memory", "code-executor"],
    },
  ]),
  createInstance: vi.fn().mockResolvedValue({
    id: "inst-new",
    name: "my-new-instance",
    template: "General Assistant",
    status: "stopped",
    provider: "anthropic",
    channels: [],
    plugins: [],
    uptime: null,
    createdAt: new Date().toISOString(),
  }),
}));

describe("CreateInstanceClient", () => {
  it("renders the create form heading", async () => {
    render(<CreateInstanceClient />);

    expect(screen.getByRole("heading", { name: "Create Instance" })).toBeInTheDocument();
  });

  it("renders template cards after loading", async () => {
    render(<CreateInstanceClient />);

    await waitFor(() => {
      expect(screen.getByText("General Assistant")).toBeInTheDocument();
    });
    expect(screen.getByText("Code Helper")).toBeInTheDocument();
  });

  it("shows confirmation after creating", async () => {
    const user = userEvent.setup();
    render(<CreateInstanceClient />);

    // Select template
    await waitFor(() => {
      expect(screen.getByText("General Assistant")).toBeInTheDocument();
    });
    await user.click(screen.getByText("General Assistant"));

    // Enter name
    const nameInput = screen.getByPlaceholderText("my-instance");
    await user.type(nameInput, "my-new-instance");

    // Submit
    await user.click(screen.getByRole("button", { name: "Create Instance" }));

    await waitFor(() => {
      expect(screen.getByText("Instance created")).toBeInTheDocument();
    });
  });

  it("disables submit button without name and template", () => {
    render(<CreateInstanceClient />);

    const submitBtn = screen.getByRole("button", { name: "Create Instance" });
    expect(submitBtn).toBeDisabled();
  });
});
