"use client";

import { motion } from "framer-motion";
import { Bitcoin, Check, CircleDollarSign, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createCryptoCheckout,
  createStablecoinCheckout,
  type StablecoinCheckoutResult,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { isAllowedRedirectUrl } from "@/lib/validate-redirect-url";

const CRYPTO_AMOUNTS = [
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
];

const STABLECOIN_TOKENS = [
  { token: "USDC", label: "USDC", chain: "base", chainLabel: "Base" },
  { token: "USDT", label: "USDT", chain: "base", chainLabel: "Base" },
  { token: "DAI", label: "DAI", chain: "base", chainLabel: "Base" },
];

type PaymentMethod = "btc" | "stablecoin";

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

function StablecoinDeposit({
  checkout,
  onReset,
}: {
  checkout: StablecoinCheckoutResult;
  onReset: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // TODO: poll charge status via tRPC query when backend endpoint exists
    // For now, show the deposit address and let the user confirm manually
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const displayAmount = `${checkout.amountUsd} ${checkout.token}`;

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-md border border-primary/25 bg-primary/5 p-4 text-center"
      >
        <Check className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-sm font-medium">Payment detected. Credits will appear shortly.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-md border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Send exactly{" "}
            <span className="font-mono font-bold text-foreground">{displayAmount}</span> to:
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

        <p className="text-xs text-muted-foreground">
          Only send {checkout.token} on the {checkout.chain} network. Other tokens or chains will be
          lost.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onReset}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

export function BuyCryptoCreditPanel() {
  const [method, setMethod] = useState<PaymentMethod>("stablecoin");
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState(STABLECOIN_TOKENS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stablecoinCheckout, setStablecoinCheckout] = useState<StablecoinCheckoutResult | null>(
    null,
  );

  async function handleBtcCheckout() {
    if (selected === null) return;
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCryptoCheckout(selected);
      if (!isAllowedRedirectUrl(url)) {
        setError("Unexpected checkout URL. Please contact support.");
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      setError("Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleStablecoinCheckout() {
    if (selected === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await createStablecoinCheckout(
        selected,
        selectedToken.token,
        selectedToken.chain,
      );
      setStablecoinCheckout(result);
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStablecoinCheckout(null);
    setSelected(null);
    setError(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {method === "btc" ? (
              <Bitcoin className="h-4 w-4 text-amber-500" />
            ) : (
              <CircleDollarSign className="h-4 w-4 text-blue-500" />
            )}
            Pay with Crypto
          </CardTitle>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setMethod("stablecoin");
                handleReset();
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                method === "stablecoin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Stablecoin
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod("btc");
                handleReset();
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                method === "btc"
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              BTC
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stablecoinCheckout ? (
            <StablecoinDeposit checkout={stablecoinCheckout} onReset={handleReset} />
          ) : (
            <>
              {method === "stablecoin" && (
                <div className="flex gap-2">
                  {STABLECOIN_TOKENS.map((t) => (
                    <button
                      key={`${t.token}:${t.chain}`}
                      type="button"
                      onClick={() => setSelectedToken(t)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                        selectedToken.token === t.token && selectedToken.chain === t.chain
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CRYPTO_AMOUNTS.map((amt) => (
                  <motion.button
                    key={amt.value}
                    type="button"
                    onClick={() => setSelected(amt.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
                      selected === amt.value
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
                onClick={method === "btc" ? handleBtcCheckout : handleStablecoinCheckout}
                disabled={selected === null || loading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loading
                  ? "Creating checkout..."
                  : method === "btc"
                    ? "Pay with BTC"
                    : `Pay with ${selectedToken.label}`}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
