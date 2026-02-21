// Thin derivation layer — the canonical data lives in marketplace-data.ts.
// This module exists for backward compatibility with channel-wizard imports.

import {
  type ConfigSchemaField,
  type SetupStep as MarketplaceSetupStep,
  MOCK_MANIFESTS,
  type SetupFlowType,
} from "./marketplace-data";

export type { SetupFlowType };

// Re-export ConfigSchemaField as ConfigField for backward compat
export type ConfigField = ConfigSchemaField;

// Re-export SetupStep for backward compat
export type SetupStep = MarketplaceSetupStep;

export interface ChannelManifest {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  setup: MarketplaceSetupStep[];
  connectionTest?: {
    label: string;
    endpoint: string;
  };
}

// Derive channel manifests from the canonical marketplace data
export const channelManifests: ChannelManifest[] = MOCK_MANIFESTS.filter(
  (m) => m.category === "channel",
).map((m) => ({
  id: m.id,
  name: m.name,
  description: m.description,
  icon: m.icon,
  color: m.color,
  setup: m.setup,
  connectionTest: m.connectionTest,
}));

export function getManifest(pluginId: string): ChannelManifest | undefined {
  return channelManifests.find((m) => m.id === pluginId);
}
