"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { Wizard } from "@/components/channel-wizard";
import { getManifest } from "@/lib/mock-manifests";

export default function ChannelSetupPage({ params }: { params: Promise<{ plugin: string }> }) {
  const { plugin } = use(params);
  const router = useRouter();
  const manifest = getManifest(plugin);

  if (!manifest) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Channel Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            No manifest found for &ldquo;{plugin}&rdquo;.
          </p>
        </div>
      </div>
    );
  }

  function handleComplete(_values: Record<string, string>) {
    // In production this would POST to the API
    router.push("/channels");
  }

  function handleCancel() {
    router.push("/channels");
  }

  return (
    <div className="flex min-h-full items-center justify-center p-8">
      <Wizard manifest={manifest} onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}
