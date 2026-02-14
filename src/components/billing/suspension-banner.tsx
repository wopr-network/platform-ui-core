"use client";

import { useCallback, useEffect, useState } from "react";
import { LowBalanceBanner } from "@/components/billing/low-balance-banner";
import { getCreditBalance } from "@/lib/api";

export function SuspensionBanner() {
  const [balance, setBalance] = useState<number | null>(null);
  const [runway, setRunway] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getCreditBalance();
      setBalance(data.balance);
      setRunway(data.runway);
    } catch {
      // Non-critical — don't block rendering
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (balance === null) return null;

  return <LowBalanceBanner balance={balance} runway={runway} global />;
}
