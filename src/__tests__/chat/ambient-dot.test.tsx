import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AmbientDot } from "@/components/chat/ambient-dot";

describe("AmbientDot", () => {
  it("renders button with correct aria-label", () => {
    render(<AmbientDot hasUnread={false} onClick={vi.fn()} />);
    expect(screen.getByLabelText("Open WOPR chat")).toBeInTheDocument();
  });

  it("renders with chat-ambient-dot testid", () => {
    render(<AmbientDot hasUnread={false} onClick={vi.fn()} />);
    expect(screen.getByTestId("chat-ambient-dot")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<AmbientDot hasUnread={false} onClick={onClick} />);

    await user.click(screen.getByTestId("chat-ambient-dot"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders unread pulse animation when hasUnread is true", () => {
    render(<AmbientDot hasUnread={true} onClick={vi.fn()} />);
    const button = screen.getByTestId("chat-ambient-dot");
    // When hasUnread=true, there are 2 child divs (inner dot + pulse ring)
    const children = button.querySelectorAll("div");
    expect(children.length).toBe(2);
  });

  it("does not render pulse animation when hasUnread is false", () => {
    render(<AmbientDot hasUnread={false} onClick={vi.fn()} />);
    const button = screen.getByTestId("chat-ambient-dot");
    // When hasUnread=false, there is only 1 child div (inner dot)
    const children = button.querySelectorAll("div");
    expect(children.length).toBe(1);
  });
});
