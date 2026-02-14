"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCreditCheckout } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CreditTier {
  amount: number;
  bonus: number | null;
  label: string;
}

const TIERS: CreditTier[] = [
  { amount: 5, bonus: null, label: "$5" },
  { amount: 10, bonus: null, label: "$10" },
  { amount: 25, bonus: 2, label: "$25" },
  { amount: 50, bonus: 5, label: "$50" },
  { amount: 100, bonus: 10, label: "$100" },
];

export function BuyCreditsPanel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (selected === null) return;
    setLoading(true);
    setError(null);
    try {
      const { checkoutUrl } = await createCreditCheckout(selected);
      window.location.href = checkoutUrl;
    } catch {
      setError("Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Credits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {TIERS.map((tier) => (
            <button
              key={tier.amount}
              type="button"
              onClick={() => setSelected(tier.amount)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
                selected === tier.amount
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border",
              )}
            >
              <span className="text-lg font-bold">{tier.label}</span>
              {tier.bonus !== null && (
                <Badge variant="secondary" className="text-xs">
                  +{tier.bonus}%
                </Badge>
              )}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          onClick={handleCheckout}
          disabled={selected === null || loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Redirecting..." : "Buy credits"}
        </Button>
      </CardContent>
    </Card>
  );
}
