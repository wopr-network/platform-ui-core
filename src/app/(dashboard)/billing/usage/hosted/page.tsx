"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HostedCapability, HostedUsageEvent } from "@/lib/api";
import { getHostedUsageEvents } from "@/lib/api";

const CAPABILITY_LABELS: Record<HostedCapability, string> = {
  transcription: "Transcription",
  image_gen: "Image Generation",
  text_gen: "Text Generation",
  embeddings: "Embeddings",
};

type SortField = "date" | "capability" | "provider" | "units" | "cost";
type SortDir = "asc" | "desc";

export default function HostedUsageDetailPage() {
  const [events, setEvents] = useState<HostedUsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [capabilityFilter, setCapabilityFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHostedUsageEvents().catch(() => []);
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (capabilityFilter !== "all") {
      result = result.filter((e) => e.capability === capabilityFilter);
    }
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "capability":
          cmp = a.capability.localeCompare(b.capability);
          break;
        case "provider":
          cmp = a.provider.localeCompare(b.provider);
          break;
        case "units":
          cmp = a.units - b.units;
          break;
        case "cost":
          cmp = a.cost - b.cost;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [events, capabilityFilter, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function handleExportCsv() {
    const header = "Date,Capability,Provider,Units,Unit,Cost\n";
    const rows = filteredEvents
      .map(
        (e) =>
          `${e.date},${CAPABILITY_LABELS[e.capability] ?? e.capability},${e.provider},${e.units},${e.unitLabel},${e.cost.toFixed(2)}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hosted-usage.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ^" : " v";
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Loading hosted usage...
      </div>
    );
  }

  const totalCost = filteredEvents.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hosted Usage Detail</h1>
        <p className="text-sm text-muted-foreground">Per-event breakdown of your hosted AI usage</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Usage Events</CardTitle>
              <CardDescription>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} — Total: $
                {totalCost.toFixed(2)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={capabilityFilter} onValueChange={setCapabilityFilter}>
                <SelectTrigger aria-label="Filter by capability">
                  <SelectValue placeholder="All capabilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All capabilities</SelectItem>
                  {(Object.entries(CAPABILITY_LABELS) as [HostedCapability, string][]).map(
                    ([cap, label]) => (
                      <SelectItem key={cap} value={cap}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No usage events found.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button type="button" onClick={() => handleSort("date")}>
                        Date{sortIndicator("date")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button type="button" onClick={() => handleSort("capability")}>
                        Capability{sortIndicator("capability")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button type="button" onClick={() => handleSort("provider")}>
                        Provider{sortIndicator("provider")}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button type="button" onClick={() => handleSort("units")}>
                        Units{sortIndicator("units")}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button type="button" onClick={() => handleSort("cost")}>
                        Cost{sortIndicator("cost")}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CAPABILITY_LABELS[event.capability] ?? event.capability}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.provider}</TableCell>
                      <TableCell className="text-right">
                        {event.units.toLocaleString()} {event.unitLabel}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${event.cost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
