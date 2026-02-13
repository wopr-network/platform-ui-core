"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProviderKey } from "@/lib/api";
import {
  listProviderKeys,
  removeProviderKey,
  saveProviderKey,
  testProviderKey,
  updateProviderModel,
} from "@/lib/api";

function statusVariant(status: ProviderKey["status"]) {
  if (status === "valid") return "default" as const;
  if (status === "invalid") return "destructive" as const;
  return "secondary" as const;
}

function formatLastChecked(lastChecked: string | null): string {
  if (!lastChecked) return "Never";
  const diff = Date.now() - new Date(lastChecked).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listProviderKeys();
    setProviders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTest(id: string) {
    setTesting(id);
    await testProviderKey(id);
    await load();
    setTesting(null);
  }

  async function handleRemove(id: string) {
    await removeProviderKey(id);
    setProviders((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleModelChange(id: string, model: string) {
    await updateProviderModel(id, model);
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, defaultModel: model } : p)));
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Loading providers...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Provider Keys</h1>
        <p className="text-sm text-muted-foreground">
          Bring Your Own Key (BYOK) -- your keys are stored securely in your instance and never
          leave your environment.
        </p>
      </div>

      {providers.map((provider) => (
        <Card key={provider.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{provider.provider}</CardTitle>
              <Badge variant={statusVariant(provider.status)}>
                {provider.status === "unchecked" && !provider.maskedKey
                  ? "Not configured"
                  : provider.status}
              </Badge>
            </div>
            {provider.maskedKey && (
              <CardDescription>
                Key: <code className="text-xs">{provider.maskedKey}</code> -- Last checked:{" "}
                {formatLastChecked(provider.lastChecked)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {provider.maskedKey ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`model-${provider.id}`}>Default model</Label>
                  <Select
                    value={provider.defaultModel ?? ""}
                    onValueChange={(v) => handleModelChange(provider.id, v)}
                  >
                    <SelectTrigger id={`model-${provider.id}`} className="w-full">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {provider.models.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(provider.id)}
                    disabled={testing === provider.id}
                  >
                    {testing === provider.id ? "Testing..." : "Test connection"}
                  </Button>
                  <RotateKeyDialog provider={provider} onSaved={load} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleRemove(provider.id)}
                  >
                    Remove
                  </Button>
                </div>
              </>
            ) : (
              <AddKeyDialog provider={provider} onSaved={load} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AddKeyDialog({ provider, onSaved }: { provider: ProviderKey; onSaved: () => void }) {
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await saveProviderKey(provider.provider, key);
    setKey("");
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {provider.provider} API Key</DialogTitle>
          <DialogDescription>
            Paste your {provider.provider} API key below. It will be validated before saving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-provider-key">API Key</Label>
            <Input
              id="new-provider-key"
              type="password"
              placeholder="Enter your API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RotateKeyDialog({ provider, onSaved }: { provider: ProviderKey; onSaved: () => void }) {
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await saveProviderKey(provider.provider, key);
    setKey("");
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Rotate key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rotate {provider.provider} Key</DialogTitle>
          <DialogDescription>
            Paste your new API key. The old key will be replaced after validation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rotate-provider-key">New API Key</Label>
            <Input
              id="rotate-provider-key"
              type="password"
              placeholder="Enter your new API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Replace key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
