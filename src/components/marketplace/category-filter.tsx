"use client";

import { Badge } from "@/components/ui/badge";
import { ALL_CATEGORIES, type PluginCategory } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: PluginCategory | null;
  onSelect: (category: PluginCategory | null) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  const categoriesWithPlugins = ALL_CATEGORIES.filter((c) => (counts[c.id] ?? 0) > 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onSelect(null)}>
        <Badge
          variant={selected === null ? "default" : "outline"}
          className={cn("cursor-pointer transition-colors", selected === null && "shadow-sm")}
        >
          All
        </Badge>
      </button>
      {categoriesWithPlugins.map((cat) => (
        <button key={cat.id} type="button" onClick={() => onSelect(cat.id)}>
          <Badge
            variant={selected === cat.id ? "default" : "outline"}
            className={cn("cursor-pointer transition-colors", selected === cat.id && "shadow-sm")}
          >
            {cat.label}
            <span className="ml-1 opacity-60">{counts[cat.id]}</span>
          </Badge>
        </button>
      ))}
    </div>
  );
}
