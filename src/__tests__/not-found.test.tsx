import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "../app/not-found";

describe("NotFound (404 page)", () => {
  it("renders the 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders a descriptive message", () => {
    render(<NotFound />);
    expect(screen.getByText(/page.*not.*found|doesn.*exist|couldn.*find/i)).toBeInTheDocument();
  });

  it("renders a link back to the dashboard", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /dashboard|home|go back/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows WOPR branding", () => {
    render(<NotFound />);
    expect(screen.getByText("WOPR")).toBeInTheDocument();
  });
});
