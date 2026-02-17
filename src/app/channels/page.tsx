"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { channelManifests } from "@/lib/mock-manifests";

interface ConnectedChannel {
  pluginId: string;
  name: string;
  connectedAt: string;
}

const mockConnected: ConnectedChannel[] = [
  { pluginId: "discord", name: "WOPR HQ", connectedAt: "2026-02-10" },
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

export default function ChannelsPage() {
  const [connected] = useState<ConnectedChannel[]>(mockConnected);

  const connectedIds = new Set(connected.map((c) => c.pluginId));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-widest uppercase">COMMS CHANNELS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect messaging platforms to your WOPR Bot. Each channel is driven by a plugin manifest.
        </p>
      </div>

      {connected.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-terminal">
            LINKED
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {connected.map((ch) => {
              const manifest = channelManifests.find((m) => m.id === ch.pluginId);
              if (!manifest) return null;
              return (
                <motion.div key={ch.pluginId} variants={staggerItem}>
                  <Card className="border-terminal/20 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                          style={{ backgroundColor: manifest.color }}
                          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {manifest.name[0]}
                        </motion.div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {manifest.name}
                            <Badge variant="terminal" className="gap-1.5">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-[pulse-dot_2s_ease-in-out_infinite]" />
                              Connected
                            </Badge>
                          </CardTitle>
                          <CardDescription>{ch.name}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Connected since {ch.connectedAt}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      ) : (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-terminal">
            LINKED
          </h2>
          <div className="flex h-40 items-center justify-center rounded-sm border border-dashed border-terminal/20">
            <p className="font-mono text-sm text-terminal/60">
              &gt; NO CHANNELS LINKED. YOUR WOPR BOT IS ISOLATED.
            </p>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          AVAILABLE
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {channelManifests
            .filter((m) => !connectedIds.has(m.id))
            .map((manifest) => (
              <motion.div key={manifest.id} variants={staggerItem}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Card className="flex flex-col transition-colors hover:border-terminal/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                          style={{ backgroundColor: manifest.color }}
                          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {manifest.name[0]}
                        </motion.div>
                        <div>
                          <CardTitle>{manifest.name}</CardTitle>
                          <CardDescription>{manifest.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button variant="terminal" className="w-full" asChild>
                        <Link href={`/channels/setup/${manifest.id}`}>Connect</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
        </motion.div>
      </section>
    </div>
  );
}
