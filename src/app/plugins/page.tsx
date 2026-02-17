"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatInstallCount,
  hasHostedOption,
  listMarketplacePlugins,
  type PluginManifest,
} from "@/lib/marketplace-data";

interface InstalledPlugin {
  id: string;
  pluginId: string;
  enabled: boolean;
  installedAt: string;
  instanceName: string;
}

const mockInstalled: InstalledPlugin[] = [
  {
    id: "inst-1",
    pluginId: "discord-channel",
    enabled: true,
    installedAt: "2026-02-10",
    instanceName: "Production Bot",
  },
  {
    id: "inst-2",
    pluginId: "semantic-memory",
    enabled: true,
    installedAt: "2026-02-10",
    instanceName: "Production Bot",
  },
  {
    id: "inst-3",
    pluginId: "content-moderation",
    enabled: false,
    installedAt: "2026-02-11",
    instanceName: "Production Bot",
  },
  {
    id: "inst-4",
    pluginId: "webhooks",
    enabled: true,
    installedAt: "2026-02-12",
    instanceName: "Staging Bot",
  },
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
} as const;

const capabilityColors: Record<string, string> = {
  channel: "border-blue-500/40 text-blue-400",
  memory: "border-purple-500/40 text-purple-400",
  embeddings: "border-purple-500/40 text-purple-400",
  moderation: "border-amber-500/40 text-amber-400",
  voice: "border-cyan-500/40 text-cyan-400",
  tts: "border-cyan-500/40 text-cyan-400",
  stt: "border-cyan-500/40 text-cyan-400",
  webhook: "border-yellow-500/40 text-yellow-400",
  integration: "border-indigo-500/40 text-indigo-400",
  ui: "border-sky-500/40 text-sky-400",
  analytics: "border-emerald-500/40 text-emerald-400",
  llm: "border-orange-500/40 text-orange-400",
  "image-gen": "border-pink-500/40 text-pink-400",
};

export default function PluginsPage() {
  const [catalog, setCatalog] = useState<PluginManifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [installed, setInstalled] = useState<InstalledPlugin[]>(mockInstalled);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listMarketplacePlugins();
    setCatalog(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function togglePlugin(id: string) {
    setInstalled((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  const installedManifests = useMemo(() => {
    const manifestMap = new Map(catalog.map((m) => [m.id, m]));
    return installed.map((inst) => ({
      ...inst,
      manifest: manifestMap.get(inst.pluginId),
    }));
  }, [installed, catalog]);

  const installedIds = new Set(installed.map((i) => i.pluginId));

  const availablePlugins = useMemo(() => {
    let result = catalog.filter((p) => !installedIds.has(p.id));
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)),
      );
    }
    return result;
  }, [catalog, installedIds, search]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="mb-6 h-9 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, n) => `sk-${n}`).map((skId, _i) => (
            <Card key={skId}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-widest uppercase">PLUGINS</h1>
        <p className="mt-2 text-muted-foreground">
          Manage installed plugins and discover new ones for your WOPR Bot instances.
        </p>
      </div>

      <Tabs defaultValue="installed">
        <TabsList variant="line">
          <TabsTrigger
            value="installed"
            className="data-[state=active]:text-terminal after:bg-terminal"
          >
            Installed ({installed.length})
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="data-[state=active]:text-terminal after:bg-terminal"
          >
            Catalog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="mt-6">
          {installedManifests.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-sm border border-dashed border-terminal/20">
              <p className="font-mono text-sm text-terminal/60">
                &gt; NO PLUGINS INSTALLED. YOUR ARSENAL IS EMPTY.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {installedManifests.map((item) => {
                const manifest = item.manifest;
                if (!manifest) return null;
                return (
                  <motion.div key={item.id} variants={staggerItem}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{ backgroundColor: manifest.color }}
                            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            {manifest.name[0]}
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{manifest.name}</CardTitle>
                              <Badge
                                variant={item.enabled ? "terminal" : "secondary"}
                                className={item.enabled ? "gap-1.5" : "text-muted-foreground"}
                              >
                                {item.enabled && (
                                  <span className="size-1.5 rounded-full bg-emerald-500 animate-[pulse-dot_2s_ease-in-out_infinite]" />
                                )}
                                {item.enabled ? "Active" : "Disabled"}
                              </Badge>
                            </div>
                            <CardDescription className="mt-1 line-clamp-2">
                              {manifest.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Instance: {item.instanceName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Installed: {item.installedAt}
                            </p>
                          </div>
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={() => togglePlugin(item.id)}
                            aria-label={`Toggle ${manifest.name}`}
                            className="data-[state=checked]:bg-terminal"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <Input
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-black/50 border-terminal/30 placeholder:text-terminal/30 focus-visible:border-terminal focus-visible:ring-terminal/20"
          />

          {availablePlugins.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-sm border border-dashed border-terminal/20">
              <p className="font-mono text-sm text-terminal/60">&gt; NO MATCHING PLUGINS FOUND.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {availablePlugins.map((plugin) => {
                const hostedAvailable = hasHostedOption(plugin.capabilities);
                return (
                  <motion.div key={plugin.id} variants={staggerItem}>
                    <Link href={`/marketplace/${plugin.id}`}>
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Card className="h-full transition-colors hover:border-terminal/30">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <motion.div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                                style={{ backgroundColor: plugin.color }}
                                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.4 }}
                              >
                                {plugin.name[0]}
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">{plugin.name}</CardTitle>
                                  <Badge variant="secondary" className="text-[10px]">
                                    v{plugin.version}
                                  </Badge>
                                </div>
                                <CardDescription className="mt-1 line-clamp-2">
                                  {plugin.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                              {plugin.capabilities.map((cap) => (
                                <Badge
                                  key={cap}
                                  variant="outline"
                                  className={`text-[10px] ${capabilityColors[cap] ?? ""}`}
                                >
                                  {cap}
                                </Badge>
                              ))}
                              {hostedAvailable && (
                                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/25 text-[10px]">
                                  WOPR Hosted Available
                                </Badge>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-mono tabular-nums">
                                {formatInstallCount(plugin.installCount)} installs
                              </span>
                              <span>{plugin.author}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
