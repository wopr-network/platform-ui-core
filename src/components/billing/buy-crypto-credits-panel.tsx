"use client";

import { motion } from "framer-motion";
import { Check, CircleDollarSign, Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type CheckoutResult,
  createCheckout,
  getChargeStatus,
  getSupportedPaymentMethods,
  type SupportedPaymentMethod,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type PaymentProgress = {
  status: "waiting" | "partial" | "confirming" | "credited" | "expired" | "failed";
  amountExpectedCents: number;
  amountReceivedCents: number;
  confirmations: number;
  confirmationsRequired: number;
};

const AMOUNTS = [
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

export function BuyCryptoCreditPanel() {
  const [methods, setMethods] = useState<SupportedPaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<SupportedPaymentMethod | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null);
  const [paymentProgress, setPaymentProgress] = useState<PaymentProgress | null>(null);

  // Poll charge status after checkout
  useEffect(() => {
    if (!checkout?.referenceId) {
      setPaymentProgress(null);
      return;
    }
    setPaymentProgress({
      status: "waiting",
      amountExpectedCents: 0,
      amountReceivedCents: 0,
      confirmations: 0,
      confirmationsRequired: 0,
    });
    const interval = setInterval(async () => {
      try {
        const res = await getChargeStatus(checkout.referenceId);
        let status: PaymentProgress["status"] = "waiting";
        if (res.credited) {
          status = "credited";
        } else if (res.status === "expired" || res.status === "failed") {
          status = res.status;
        } else if (
          res.amountReceivedCents >= res.amountExpectedCents &&
          res.amountReceivedCents > 0
        ) {
          status = "confirming";
        } else if (res.amountReceivedCents > 0) {
          status = "partial";
        }
        setPaymentProgress({
          status,
          amountExpectedCents: res.amountExpectedCents,
          amountReceivedCents: res.amountReceivedCents,
          confirmations: res.confirmations,
          confirmationsRequired: res.confirmationsRequired,
        });
        if (status === "credited" || status === "expired" || status === "failed") {
          clearInterval(interval);
        }
      } catch {
        // Ignore poll errors
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [checkout?.referenceId]);

  // Fetch available payment methods from backend on mount
  useEffect(() => {
    getSupportedPaymentMethods()
      .then((m) => {
        if (m.length > 0) {
          setMethods(m);
          setSelectedMethod(m[0]);
        }
      })
      .catch(() => {
        // Backend unavailable — panel stays empty
      });
  }, []);

  async function handleCheckout() {
    if (selectedAmount === null || !selectedMethod) return;
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckout(selectedMethod.chain, selectedAmount);
      setCheckout(result);
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCheckout(null);
    setSelectedAmount(null);
    setError(null);
  }

  if (methods.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            Pay with Crypto
          </CardTitle>
          <div className="flex flex-wrap gap-2 pt-1">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMethod(m);
                  handleReset();
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  selectedMethod?.id === m.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* biome-ignore lint/performance/noImgElement: external dynamic URLs from backend, not static assets */}
                <img
                  src={m.iconUrl}
                  alt={m.token}
                  className="h-4 w-4"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {m.token}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkout ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Send{" "}
                    <span className="font-mono font-bold text-foreground">
                      {checkout.displayAmount}
                    </span>{" "}
                    to:
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {checkout.token} on {checkout.chain}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <code className="flex-1 text-xs font-mono break-all text-foreground">
                    {checkout.depositAddress}
                  </code>
                  <CopyButton text={checkout.depositAddress} />
                </div>
                {checkout.priceCents && (
                  <p className="text-xs text-muted-foreground">
                    Price at checkout: ${(checkout.priceCents / 100).toFixed(2)} per{" "}
                    {checkout.token}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Only send {checkout.token} on the {checkout.chain} network.
                </p>
                {paymentProgress?.status === "waiting" && (
                  <p className="text-xs text-yellow-500 animate-pulse">Waiting for payment...</p>
                )}
                {paymentProgress?.status === "partial" && (
                  <p className="text-xs text-blue-500">
                    Received ${(paymentProgress.amountReceivedCents / 100).toFixed(2)} of $
                    {(paymentProgress.amountExpectedCents / 100).toFixed(2)} — send $
                    {(
                      (paymentProgress.amountExpectedCents - paymentProgress.amountReceivedCents) /
                      100
                    ).toFixed(2)}{" "}
                    more
                  </p>
                )}
                {paymentProgress?.status === "confirming" && (
                  <p className="text-xs text-blue-500">
                    Payment received. Confirming ({paymentProgress.confirmations} of{" "}
                    {paymentProgress.confirmationsRequired})...
                  </p>
                )}
                {paymentProgress?.status === "credited" && (
                  <p className="text-xs text-green-500 font-medium">
                    Payment confirmed! Credits added.
                  </p>
                )}
                {paymentProgress?.status === "expired" && (
                  <p className="text-xs text-red-500">Payment expired.</p>
                )}
                {paymentProgress?.status === "failed" && (
                  <p className="text-xs text-red-500">Payment failed.</p>
                )}
              </div>
              {paymentProgress?.status === "credited" ? (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Done
                </Button>
              ) : paymentProgress?.status === "expired" || paymentProgress?.status === "failed" ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Cancel
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {AMOUNTS.map((amt) => (
                  <motion.button
                    key={amt.value}
                    type="button"
                    onClick={() => setSelectedAmount(amt.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
                      selectedAmount === amt.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                        : "border-border",
                    )}
                  >
                    <span className="text-lg font-bold">{amt.label}</span>
                  </motion.button>
                ))}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={handleCheckout}
                disabled={selectedAmount === null || !selectedMethod || loading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loading ? "Creating checkout..." : `Pay with ${selectedMethod?.token ?? "Crypto"}`}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
