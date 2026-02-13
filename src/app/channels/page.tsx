"use client";

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

export default function ChannelsPage() {
  const [connected] = useState<ConnectedChannel[]>(mockConnected);

  const connectedIds = new Set(connected.map((c) => c.pluginId));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
        <p className="mt-2 text-muted-foreground">
          Connect messaging platforms to WOPR. Each channel is driven by a plugin manifest.
        </p>
      </div>

      {connected.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Connected</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connected.map((ch) => {
              const manifest = channelManifests.find((m) => m.id === ch.pluginId);
              if (!manifest) return null;
              return (
                <Card key={ch.pluginId}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                        style={{ backgroundColor: manifest.color }}
                      >
                        {manifest.name[0]}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {manifest.name}
                          <Badge variant="secondary" className="text-green-500">
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
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Available Channels</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channelManifests
            .filter((m) => !connectedIds.has(m.id))
            .map((manifest) => (
              <Card key={manifest.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                      style={{ backgroundColor: manifest.color }}
                    >
                      {manifest.name[0]}
                    </div>
                    <div>
                      <CardTitle>{manifest.name}</CardTitle>
                      <CardDescription>{manifest.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href={`/channels/setup/${manifest.id}`}>Connect</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
