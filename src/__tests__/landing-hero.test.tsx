import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../components/landing/hero";

describe("Landing Hero", () => {
  it("renders the CTA button", () => {
    render(<Hero />);
    expect(screen.getByRole("button", { name: /get your wopr bot/i })).toBeInTheDocument();
  });

  it("shows the price", () => {
    render(<Hero />);
    expect(screen.getByText(/\$5\/month/)).toBeInTheDocument();
  });

  it("shows the domain", () => {
    render(<Hero />);
    expect(screen.getByText("wopr.bot")).toBeInTheDocument();
  });

  it("renders the beta badge", () => {
    render(<Hero />);
    expect(screen.getByText("Now in beta")).toBeInTheDocument();
  });

  it("uses terminal variant on the CTA button", () => {
    render(<Hero />);
    const button = screen.getByRole("button", { name: /get your wopr bot/i });
    expect(button).toHaveAttribute("data-variant", "terminal");
  });

  it("uses terminal variant on the badge", () => {
    render(<Hero />);
    const badge = screen.getByText("Now in beta");
    expect(badge).toHaveAttribute("data-variant", "terminal");
  });
});
