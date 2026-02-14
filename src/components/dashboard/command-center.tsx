"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FleetInstance } from "@/lib/api";
import { getFleetHealth } from "@/lib/api";

// TODO: Replace with real API types and endpoints when backend supports activity feed
interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  targetHref: string;
}

// TODO: Replace with real API call
function getMockActivity(): ActivityEvent[] {
  return [
    {
      id: "evt-1",
      timestamp: "2026-02-14T16:30:00Z",
      actor: "admin",
      action: "created instance",
      target: "prod-assistant",
      targetHref: "/instances/inst-001",
    },
    {
      id: "evt-2",
      timestamp: "2026-02-14T16:15:00Z",
      actor: "admin",
      action: "installed plugin",
      target: "memory v1.2.0",
      targetHref: "/plugins",
    },
    {
      id: "evt-3",
      timestamp: "2026-02-14T15:45:00Z",
      actor: "admin",
      action: "updated config",
      target: "community-mod",
      targetHref: "/instances/inst-003",
    },
    {
      id: "evt-4",
      timestamp: "2026-02-14T14:00:00Z",
      actor: "system",
      action: "restarted instance",
      target: "dev-bot",
      targetHref: "/instances/inst-002",
    },
    {
      id: "evt-5",
      timestamp: "2026-02-14T12:30:00Z",
      actor: "admin",
      action: "connected channel",
      target: "discord #general",
      targetHref: "/channels",
    },
    {
      id: "evt-6",
      timestamp: "2026-02-14T11:00:00Z",
      actor: "system",
      action: "health check failed",
      target: "community-mod",
      targetHref: "/instances/inst-003",
    },
    {
      id: "evt-7",
      timestamp: "2026-02-14T10:30:00Z",
      actor: "admin",
      action: "removed plugin",
      target: "web-search v0.9.0",
      targetHref: "/plugins",
    },
    {
      id: "evt-8",
      timestamp: "2026-02-14T09:00:00Z",
      actor: "admin",
      action: "changed provider key",
      target: "anthropic",
      targetHref: "/settings/providers",
    },
    {
      id: "evt-9",
      timestamp: "2026-02-13T23:00:00Z",
      actor: "system",
      action: "stopped instance",
      target: "dev-bot",
      targetHref: "/instances/inst-002",
    },
    {
      id: "evt-10",
      timestamp: "2026-02-13T20:00:00Z",
      actor: "admin",
      action: "created instance",
      target: "community-mod",
      targetHref: "/instances/inst-003",
    },
  ];
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function computeFleetStats(instances: FleetInstance[]) {
  const running = instances.filter((i) => i.status === "running").length;
  const stopped = instances.filter((i) => i.status === "stopped").length;
  const degraded = instances.filter(
    (i) => i.health === "degraded" || i.health === "unhealthy",
  ).length;
  // TODO: Replace with real resource usage from API
  const totalCpu = instances.length > 0 ? Math.min(100, Math.round(instances.length * 12.5)) : 0;
  const totalMemory = instances.length > 0 ? instances.length * 256 : 0;

  return { running, stopped, degraded, totalCpu, totalMemory };
}

export function CommandCenter() {
  const [instances, setInstances] = useState<FleetInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFleetHealth();
      setInstances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fleet health");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const stats = computeFleetStats(instances);
  const activity = getMockActivity();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground">Fleet overview and quick actions</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      )}

      {/* Fleet Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Running</p>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums" data-testid="running-count">
              {loading ? "--" : stats.running}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.running === 1 ? "instance" : "instances"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Stopped</p>
              <span className="size-2 rounded-full bg-zinc-400" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums" data-testid="stopped-count">
              {loading ? "--" : stats.stopped}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.stopped === 1 ? "instance" : "instances"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Degraded</p>
              {stats.degraded > 0 ? (
                <span className="size-2 rounded-full bg-red-500" />
              ) : (
                <span className="size-2 rounded-full bg-zinc-700" />
              )}
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums" data-testid="degraded-count">
              {loading ? "--" : stats.degraded}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.degraded > 0 ? "need attention" : "all clear"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Resources</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">CPU</span>
                <span className="text-sm font-bold tabular-nums" data-testid="cpu-usage">
                  {loading ? "--" : `${stats.totalCpu}%`}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Memory</span>
                <span className="text-sm font-bold tabular-nums" data-testid="memory-usage">
                  {loading ? "--" : `${stats.totalMemory} MB`}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">across fleet</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-border">
            {activity.map((evt) => (
              <Link
                key={evt.id}
                href={evt.targetHref}
                className="flex items-center justify-between py-2.5 text-sm transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {evt.actor}
                  </Badge>
                  <span className="text-muted-foreground">{evt.action}</span>
                  <span className="truncate font-medium">{evt.target}</span>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground ml-4">
                  {formatRelativeTime(evt.timestamp)}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild size="lg" className="h-auto py-4">
          <Link href="/instances/new">
            <div className="text-center">
              <p className="font-semibold">Launch New Instance</p>
              <p className="text-xs opacity-70">Deploy a new WOPR Bot</p>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-auto py-4">
          <Link href="/fleet/health">
            <div className="text-center">
              <p className="font-semibold">Fleet Health</p>
              <p className="text-xs opacity-70">Monitor all instances</p>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-auto py-4">
          <Link href="/plugins">
            <div className="text-center">
              <p className="font-semibold">Manage Plugins</p>
              <p className="text-xs opacity-70">Install and configure</p>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-auto py-4">
          <Link href="/billing/usage">
            <div className="text-center">
              <p className="font-semibold">Billing Overview</p>
              <p className="text-xs opacity-70">Usage and costs</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
