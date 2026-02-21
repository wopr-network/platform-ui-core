"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { deployInstance } from "@/lib/api";
import { channelManifests } from "@/lib/mock-manifests";
import {
  AI_PROVIDERS,
  clearOnboardingState,
  ENHANCEMENT_PLUGINS,
  loadOnboardingState,
  type OnboardingState,
  saveOnboardingState,
} from "@/lib/onboarding-store";

type DeployPhase = "idle" | "creating" | "plugins" | "channels" | "health" | "done" | "error";

const DEPLOY_LABELS: Record<DeployPhase, string> = {
  idle: "",
  creating: "Creating instance...",
  plugins: "Installing plugins...",
  channels: "Connecting channels...",
  health: "Running health check...",
  done: "Done!",
  error: "Deploy failed",
};

const DEPLOY_PROGRESS: Record<DeployPhase, number> = {
  idle: 0,
  creating: 20,
  plugins: 45,
  channels: 70,
  health: 90,
  done: 100,
  error: 0,
};

export default function OnboardReviewPage() {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [instanceName, setInstanceName] = useState("");
  const [phase, setPhase] = useState<DeployPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadOnboardingState();
    setState(loaded);
    setInstanceName(loaded.instanceName || `wopr-${Date.now().toString(36)}`);
  }, []);

  async function handleDeploy() {
    setError(null);

    // Persist instanceName to localStorage before deploying
    const current = loadOnboardingState();
    current.instanceName = instanceName;
    saveOnboardingState(current);

    setPhase("creating");

    // Build env from the old onboarding state
    const env: Record<string, string> = {};

    // Providers: store validated API keys
    for (const provider of current.providers) {
      if (provider.key) {
        env[`${provider.id.toUpperCase()}_API_KEY`] = provider.key;
      }
    }

    // Channels
    if (current.channels.length > 0) {
      env.WOPR_PLUGINS_CHANNELS = current.channels.join(",");
    }

    // Channel configs (credential env vars)
    for (const [, config] of Object.entries(current.channelConfigs)) {
      for (const [key, value] of Object.entries(config)) {
        if (value) {
          env[key.toUpperCase()] = value;
        }
      }
    }

    // Plugins
    if (current.plugins.length > 0) {
      env.WOPR_PLUGINS_OTHER = current.plugins.join(",");
    }

    try {
      setPhase("plugins");
      await deployInstance({
        name: instanceName,
        description: "",
        env,
      });

      setPhase("channels");
      await new Promise((resolve) => setTimeout(resolve, 600));

      setPhase("health");
      await new Promise((resolve) => setTimeout(resolve, 600));

      setPhase("done");
      clearOnboardingState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create instance");
      setPhase("error");
    }
  }

  if (!state) return null;

  if (phase === "done") {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Your WOPR is live!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <span className="text-3xl text-emerald-500">&#10003;</span>
            </div>
            <p className="text-muted-foreground">
              Instance <span className="font-mono font-medium text-foreground">{instanceName}</span>{" "}
              is ready.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const deploying = phase !== "idle" && phase !== "error";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review &amp; Deploy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review your configuration, then deploy your WOPR agent.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="instance-name">Instance Name</Label>
          <Input
            id="instance-name"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            disabled={deploying}
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-sm border p-4">
            <h3 className="mb-2 text-sm font-medium">AI Providers</h3>
            <div className="flex flex-wrap gap-2">
              {state.providers.map((p) => {
                const meta = AI_PROVIDERS.find((m) => m.id === p.id);
                return (
                  <Badge key={p.id} variant="secondary">
                    {meta?.name ?? p.id}
                    {p.validated && <span className="ml-1 text-emerald-500">&#10003;</span>}
                  </Badge>
                );
              })}
              {state.providers.length === 0 && (
                <span className="text-xs text-muted-foreground">None selected</span>
              )}
            </div>
          </div>

          <div className="rounded-sm border p-4">
            <h3 className="mb-2 text-sm font-medium">Channels</h3>
            <div className="flex flex-wrap gap-2">
              {state.channels.map((id) => {
                const manifest = channelManifests.find((m) => m.id === id);
                const isConfigured = state.channelsConfigured.includes(id);
                return (
                  <Badge key={id} variant="secondary">
                    {manifest?.name ?? id}
                    {isConfigured && <span className="ml-1 text-emerald-500">&#10003;</span>}
                  </Badge>
                );
              })}
              {state.channels.length === 0 && (
                <span className="text-xs text-muted-foreground">Web Chat only</span>
              )}
            </div>
          </div>

          <div className="rounded-sm border p-4">
            <h3 className="mb-2 text-sm font-medium">Plugins</h3>
            <div className="flex flex-wrap gap-2">
              {state.plugins.map((id) => {
                const plugin = ENHANCEMENT_PLUGINS.find((p) => p.id === id);
                return (
                  <Badge key={id} variant="secondary">
                    {plugin?.name ?? id}
                  </Badge>
                );
              })}
              {state.plugins.length === 0 && (
                <span className="text-xs text-muted-foreground">None</span>
              )}
            </div>
          </div>
        </div>

        {deploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{DEPLOY_LABELS[phase]}</span>
              <span className="text-muted-foreground">{DEPLOY_PROGRESS[phase]}%</span>
            </div>
            <Progress value={DEPLOY_PROGRESS[phase]} />
          </div>
        )}

        {phase === "error" && error && (
          <div className="rounded-sm border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" disabled={deploying} asChild>
          <Link href="/onboard/plugins">Back</Link>
        </Button>
        <Button onClick={handleDeploy} disabled={phase !== "idle" && phase !== "error"}>
          {phase === "error" ? "Retry" : deploying ? "Deploying..." : "Deploy"}
        </Button>
      </CardFooter>
    </Card>
  );
}
