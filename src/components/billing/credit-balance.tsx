"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreditBalance as CreditBalanceData } from "@/lib/api";

export function CreditBalance({ data }: { data: CreditBalanceData }) {
  const runwayText =
    data.runway === null
      ? "N/A"
      : data.runway === 0
        ? "Suspended"
        : `~${data.runway} day${data.runway === 1 ? "" : "s"}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold font-mono">${data.balance.toFixed(2)}</div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div>
            <span className="block text-xs uppercase tracking-wider">Daily burn</span>
            <span className="font-medium text-foreground">${data.dailyBurn.toFixed(2)}/day</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider">Runway</span>
            <span className="font-medium text-foreground">{runwayText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
