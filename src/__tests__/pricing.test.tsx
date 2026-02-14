import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingPage } from "../components/pricing/pricing-page";
import { pricingData } from "../lib/pricing-data";

describe("PricingPage", () => {
  it("renders without crashing", () => {
    render(<PricingPage />);
    expect(screen.getByText(/you know exactly what you pay/i)).toBeInTheDocument();
  });

  it("shows the bot price ($5/month)", () => {
    render(<PricingPage />);
    const priceEl = screen.getByTestId("bot-price");
    expect(priceEl).toHaveTextContent("$5");
    expect(priceEl).toHaveTextContent("/month");
  });

  it("shows all capability categories", () => {
    render(<PricingPage />);
    for (const capability of pricingData.capabilities) {
      expect(screen.getByText(capability.category)).toBeInTheDocument();
    }
  });

  it("shows model names and prices", () => {
    render(<PricingPage />);
    for (const capability of pricingData.capabilities) {
      for (const model of capability.models) {
        expect(screen.getByText(model.name)).toBeInTheDocument();
      }
    }
  });

  it("has a CTA link to /signup", () => {
    render(<PricingPage />);
    const cta = screen.getByRole("link", { name: /get started/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/signup");
  });

  it("shows the signup credit amount", () => {
    render(<PricingPage />);
    expect(screen.getByText(/\$5 signup credit/)).toBeInTheDocument();
  });

  it("shows the transparent pricing badge", () => {
    render(<PricingPage />);
    const badge = screen.getByText("Transparent pricing");
    expect(badge).toHaveAttribute("data-variant", "terminal");
  });
});
