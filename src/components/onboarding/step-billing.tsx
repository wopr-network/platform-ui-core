"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepBillingProps {
  billingEmail: string;
  cardComplete: boolean;
  onEmailChange: (email: string) => void;
  onCardCompleteChange: (complete: boolean) => void;
}

export function StepBilling({
  billingEmail,
  cardComplete,
  onEmailChange,
  onCardCompleteChange,
}: StepBillingProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Payment method</h2>
        <p className="mt-2 text-muted-foreground">
          Add a card to enable WOPR Hosted. You'll only be charged for what you use.
        </p>
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-sm text-blue-200">
          No minimum, no commitment. Pay-as-you-go pricing for all AI capabilities. Cancel anytime.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="billing-email">Billing email</Label>
          <Input
            id="billing-email"
            type="email"
            placeholder="you@example.com"
            value={billingEmail}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Where we send invoices and billing notifications.
          </p>
        </div>

        {/* Stripe Elements placeholder -- will be replaced with real Stripe integration */}
        <div className="space-y-1.5">
          <Label>Card details</Label>
          <div
            className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground"
            data-testid="stripe-card-placeholder"
          >
            {cardComplete ? "Card ending in 4242" : "Stripe Elements will load here"}
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Stripe. Your card details are never stored on our servers.
          </p>
          {/* Temporary mock toggle for development until Stripe is integrated */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={cardComplete}
              onChange={(e) => onCardCompleteChange(e.target.checked)}
              data-testid="mock-card-toggle"
            />
            <span>Simulate card entry (dev only)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
