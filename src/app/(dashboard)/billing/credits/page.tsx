"use client";

import { useCallback, useEffect, useState } from "react";
import { BuyCreditsPanel } from "@/components/billing/buy-credits-panel";
import { CreditBalance } from "@/components/billing/credit-balance";
import { LowBalanceBanner } from "@/components/billing/low-balance-banner";
import { TransactionHistory } from "@/components/billing/transaction-history";
import type { CreditBalance as CreditBalanceData } from "@/lib/api";
import { getCreditBalance } from "@/lib/api";

export default function CreditsPage() {
  const [balance, setBalance] = useState<CreditBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCreditBalance();
      setBalance(data);
    } catch {
      setError("Failed to load credit balance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Loading credits...
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
        <p>{error ?? "Unable to load credits."}</p>
        <button type="button" onClick={load} className="text-sm underline hover:text-foreground">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
        <p className="text-sm text-muted-foreground">
          Manage your credit balance and purchase history
        </p>
      </div>

      <LowBalanceBanner balance={balance.balance} runway={balance.runway} />

      <CreditBalance data={balance} />
      <BuyCreditsPanel />
      <TransactionHistory />
    </div>
  );
}
