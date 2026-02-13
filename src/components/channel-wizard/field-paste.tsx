"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConfigField } from "@/lib/mock-manifests";

interface FieldPasteProps {
  field: ConfigField;
  value: string;
  onChange: (key: string, value: string) => void;
  error?: string;
}

export function FieldPaste({ field, value, onChange, error }: FieldPasteProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>{field.label}</Label>
      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
      <div className="relative">
        <Input
          id={field.key}
          type={field.secret && !revealed ? "password" : "text"}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={error ? "border-destructive" : ""}
        />
        {field.secret && (
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            {revealed ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
