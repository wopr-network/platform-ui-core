"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { additionalModels, heroModels, MODEL_COUNT, type ModelOption } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

interface StepModelSelectProps {
  selectedModel: string | null;
  onSelectModel: (modelId: string) => void;
}

export function StepModelSelect({ selectedModel, onSelectModel }: StepModelSelectProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Pick a brain for your WOPR</h2>
        <p className="mt-2 text-muted-foreground">
          Choose the AI model that powers your WOPR. Change anytime in settings.
        </p>
      </div>

      {/* Hero model cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {heroModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            selected={selectedModel === model.id}
            onSelect={() => onSelectModel(model.id)}
          />
        ))}
      </div>

      {/* More models expandable section */}
      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setShowMore(!showMore)}
          data-testid="more-models-toggle"
        >
          <span className="text-xs">{showMore ? "v" : ">"}</span>
          <span>More models -- {MODEL_COUNT} models available</span>
        </button>

        {showMore && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {additionalModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                selected={selectedModel === model.id}
                onSelect={() => onSelectModel(model.id)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Powered by credits. Change anytime in settings.
      </p>
    </div>
  );
}

function ModelCard({
  model,
  selected,
  onSelect,
  compact = false,
}: {
  model: ModelOption;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button type="button" className="w-full text-left" onClick={onSelect}>
      <Card
        className={cn(
          "h-full transition-all hover:shadow-md",
          selected ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/30",
        )}
        data-testid={`model-card-${model.id}`}
      >
        <CardHeader className={compact ? "pb-0" : undefined}>
          <div className="flex items-center justify-between">
            <CardTitle className={compact ? "text-sm" : "text-base"}>{model.name}</CardTitle>
            <div className="flex items-center gap-1">
              {model.recommended && <Badge variant="terminal">Recommended</Badge>}
              {selected && (
                <Badge variant="default" className="text-xs">
                  Selected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {model.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{model.provider}</span>
            <span className="text-xs font-medium">{model.costPerMessage}</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
