"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminListPaymentMethods,
  adminTogglePaymentMethod,
  adminUpsertPaymentMethod,
  type PaymentMethodAdmin,
} from "@/lib/api";

function AddMethodForm({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    token: "",
    chain: "",
    type: "erc20",
    contractAddress: "",
    decimals: 18,
    displayName: "",
    displayOrder: 0,
    confirmations: 1,
    rpcUrl: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const id = `${form.token}:${form.chain}`;
    await adminUpsertPaymentMethod({
      id,
      type: form.type,
      token: form.token,
      chain: form.chain,
      contractAddress: form.contractAddress || null,
      decimals: form.decimals,
      displayName: form.displayName || `${form.token} on ${form.chain}`,
      enabled: true,
      displayOrder: form.displayOrder,
      rpcUrl: form.rpcUrl || null,
      confirmations: form.confirmations,
    });
    setSaving(false);
    setOpen(false);
    setForm({
      token: "",
      chain: "",
      type: "erc20",
      contractAddress: "",
      decimals: 18,
      displayName: "",
      displayOrder: 0,
      confirmations: 1,
      rpcUrl: "",
    });
    onSaved();
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Add Payment Method
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Token</span>
          <input
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            placeholder="USDC"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Chain</span>
          <input
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            placeholder="base"
            value={form.chain}
            onChange={(e) => setForm({ ...form, chain: e.target.value })}
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Type</span>
          <select
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="erc20">ERC-20</option>
            <option value="native">Native</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Decimals</span>
          <input
            type="number"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            value={form.decimals}
            onChange={(e) => setForm({ ...form, decimals: Number(e.target.value) })}
          />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="text-xs text-muted-foreground">Contract Address (empty for native)</span>
          <input
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono"
            placeholder="0x..."
            value={form.contractAddress}
            onChange={(e) => setForm({ ...form, contractAddress: e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Display Order</span>
          <input
            type="number"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Confirmations</span>
          <input
            type="number"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            value={form.confirmations}
            onChange={(e) => setForm({ ...form, confirmations: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethodAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const m = await adminListPaymentMethods();
      setMethods(m);
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(id: string, enabled: boolean) {
    await adminTogglePaymentMethod(id, enabled);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <AddMethodForm onSaved={load} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : methods.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment methods configured.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Token</th>
                    <th className="pb-2 pr-4">Chain</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Contract</th>
                    <th className="pb-2 pr-4">Decimals</th>
                    <th className="pb-2 pr-4">Order</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {methods.map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{m.token}</td>
                      <td className="py-2 pr-4">{m.chain}</td>
                      <td className="py-2 pr-4">{m.type}</td>
                      <td className="py-2 pr-4 font-mono text-xs">
                        {m.contractAddress ? `${m.contractAddress.slice(0, 10)}...` : "—"}
                      </td>
                      <td className="py-2 pr-4">{m.decimals}</td>
                      <td className="py-2 pr-4">{m.displayOrder}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            m.enabled
                              ? "text-xs font-medium text-green-500"
                              : "text-xs font-medium text-red-500"
                          }
                        >
                          {m.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(m.id, !m.enabled)}
                        >
                          {m.enabled ? "Disable" : "Enable"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
