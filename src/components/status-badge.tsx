import { Badge } from "@/components/ui/badge";
import type { InstanceStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<InstanceStatus, { label: string; className: string }> = {
  running: {
    label: "Running",
    className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
  },
  stopped: {
    label: "Stopped",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
  },
  degraded: {
    label: "Degraded",
    className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/25",
  },
  error: {
    label: "Error",
    className: "bg-red-500/15 text-red-500 border-red-500/25",
  },
};

export function StatusBadge({ status }: { status: InstanceStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5", config.className)}>
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500 animate-[pulse-dot_2s_ease-in-out_infinite]": status === "running",
          "bg-zinc-400": status === "stopped",
          "bg-yellow-500": status === "degraded",
          "bg-red-500 animate-[pulse-dot_0.8s_ease-in-out_infinite]": status === "error",
        })}
      />
      {config.label}
    </Badge>
  );
}
