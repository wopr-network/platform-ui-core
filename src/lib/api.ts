export type InstanceStatus = "running" | "stopped" | "degraded" | "error";

export interface Instance {
  id: string;
  name: string;
  template: string;
  status: InstanceStatus;
  provider: string;
  channels: string[];
  plugins: PluginInfo[];
  uptime: number | null;
  createdAt: string;
}

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
}

export interface ChannelInfo {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
}

export interface SessionInfo {
  id: string;
  userId: string;
  messageCount: number;
  startedAt: string;
  lastActivityAt: string;
}

export interface InstanceDetail extends Instance {
  config: Record<string, unknown>;
  channelDetails: ChannelInfo[];
  sessions: SessionInfo[];
  resourceUsage: {
    memoryMb: number;
    cpuPercent: number;
  };
}

export interface InstanceTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultPlugins: string[];
}

// --- Mock data ---

const MOCK_TEMPLATES: InstanceTemplate[] = [
  {
    id: "general",
    name: "General Assistant",
    description: "A versatile assistant for general-purpose conversations.",
    icon: "Bot",
    defaultPlugins: ["memory", "web-search"],
  },
  {
    id: "coding",
    name: "Code Helper",
    description: "Specialized for code review, debugging, and development tasks.",
    icon: "Code",
    defaultPlugins: ["memory", "code-executor", "git"],
  },
  {
    id: "discord-bot",
    name: "Discord Bot",
    description: "A Discord bot with moderation and community management features.",
    icon: "MessageSquare",
    defaultPlugins: ["memory", "discord", "moderation"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Analyzes datasets, generates charts, and provides insights.",
    icon: "BarChart",
    defaultPlugins: ["memory", "data-tools", "chart-gen"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Start from scratch with a blank configuration.",
    icon: "Settings",
    defaultPlugins: [],
  },
];

const MOCK_INSTANCES: Instance[] = [
  {
    id: "inst-001",
    name: "prod-assistant",
    template: "General Assistant",
    status: "running",
    provider: "anthropic",
    channels: ["discord-general", "slack-eng"],
    plugins: [
      { id: "p1", name: "memory", version: "1.2.0", enabled: true },
      { id: "p2", name: "web-search", version: "0.9.1", enabled: true },
    ],
    uptime: 86400,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "inst-002",
    name: "code-review-bot",
    template: "Code Helper",
    status: "running",
    provider: "anthropic",
    channels: ["github-prs"],
    plugins: [
      { id: "p3", name: "memory", version: "1.2.0", enabled: true },
      { id: "p4", name: "code-executor", version: "2.0.0", enabled: true },
      { id: "p5", name: "git", version: "1.0.0", enabled: true },
    ],
    uptime: 172800,
    createdAt: "2026-01-10T08:30:00Z",
  },
  {
    id: "inst-003",
    name: "community-mod",
    template: "Discord Bot",
    status: "degraded",
    provider: "openai",
    channels: ["discord-main"],
    plugins: [
      { id: "p6", name: "memory", version: "1.2.0", enabled: true },
      { id: "p7", name: "discord", version: "3.1.0", enabled: true },
      { id: "p8", name: "moderation", version: "1.5.0", enabled: false },
    ],
    uptime: 3600,
    createdAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "inst-004",
    name: "analytics-engine",
    template: "Data Analyst",
    status: "stopped",
    provider: "anthropic",
    channels: [],
    plugins: [
      { id: "p9", name: "memory", version: "1.2.0", enabled: true },
      { id: "p10", name: "data-tools", version: "0.5.0", enabled: true },
    ],
    uptime: null,
    createdAt: "2026-02-05T09:00:00Z",
  },
  {
    id: "inst-005",
    name: "broken-experiment",
    template: "Custom",
    status: "error",
    provider: "openai",
    channels: ["test-channel"],
    plugins: [],
    uptime: null,
    createdAt: "2026-02-10T16:00:00Z",
  },
];

function getMockDetail(instance: Instance): InstanceDetail {
  return {
    ...instance,
    config: {
      model: instance.provider === "anthropic" ? "claude-sonnet-4-5-20250514" : "gpt-4o",
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: `You are ${instance.name}, a helpful assistant.`,
    },
    channelDetails: instance.channels.map((ch, i) => ({
      id: `ch-${i}`,
      name: ch,
      type: ch.startsWith("discord") ? "discord" : ch.startsWith("slack") ? "slack" : "other",
      status: instance.status === "running" ? "connected" : "disconnected",
    })),
    sessions:
      instance.status === "running"
        ? [
            {
              id: "sess-001",
              userId: "user-alice",
              messageCount: 42,
              startedAt: "2026-02-12T08:00:00Z",
              lastActivityAt: "2026-02-12T09:30:00Z",
            },
            {
              id: "sess-002",
              userId: "user-bob",
              messageCount: 17,
              startedAt: "2026-02-12T09:00:00Z",
              lastActivityAt: "2026-02-12T09:25:00Z",
            },
          ]
        : [],
    resourceUsage: {
      memoryMb: instance.status === "running" ? 256 : 0,
      cpuPercent: instance.status === "running" ? 12.5 : 0,
    },
  };
}

// --- API client ---

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Use mock data until the backend is ready.
// Each function tries the real API first and falls back to mocks.

export async function listInstances(): Promise<Instance[]> {
  try {
    return await apiFetch<Instance[]>("/instances");
  } catch {
    return MOCK_INSTANCES;
  }
}

export async function getInstance(id: string): Promise<InstanceDetail> {
  try {
    return await apiFetch<InstanceDetail>(`/instances/${id}`);
  } catch {
    const inst = MOCK_INSTANCES.find((i) => i.id === id);
    if (!inst) throw new Error(`Instance ${id} not found`);
    return getMockDetail(inst);
  }
}

export async function createInstance(data: {
  name: string;
  template: string;
  provider: string;
  channels: string[];
  plugins: string[];
}): Promise<Instance> {
  try {
    return await apiFetch<Instance>("/instances", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Mock: return a fake created instance
    const newInst: Instance = {
      id: `inst-${Date.now()}`,
      name: data.name,
      template: data.template,
      status: "stopped",
      provider: data.provider,
      channels: data.channels,
      plugins: data.plugins.map((p, i) => ({
        id: `p-new-${i}`,
        name: p,
        version: "1.0.0",
        enabled: true,
      })),
      uptime: null,
      createdAt: new Date().toISOString(),
    };
    return newInst;
  }
}

export async function controlInstance(
  id: string,
  action: "start" | "stop" | "restart" | "destroy",
): Promise<void> {
  try {
    await apiFetch(`/instances/${id}/${action}`, { method: "POST" });
  } catch {
    // Mock: no-op
  }
}

export async function listTemplates(): Promise<InstanceTemplate[]> {
  try {
    return await apiFetch<InstanceTemplate[]>("/templates");
  } catch {
    return MOCK_TEMPLATES;
  }
}
