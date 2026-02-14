export const pricingData = {
  bot_price: { amount: 5, period: "month" },
  signup_credit: 5,
  capabilities: [
    {
      category: "Text Generation",
      icon: "bot" as const,
      models: [
        { name: "Claude Sonnet 4.5", unit: "1M input tokens", price: 3.0 },
        { name: "Claude Opus 4", unit: "1M input tokens", price: 15.0 },
        { name: "Gemini 2.5 Pro", unit: "1M input tokens", price: 1.25 },
        { name: "GPT-4o", unit: "1M input tokens", price: 2.5 },
        { name: "Kimi K3", unit: "1M input tokens", price: 0.8 },
      ],
    },
    {
      category: "Voice",
      icon: "mic" as const,
      models: [
        { name: "Text-to-Speech", unit: "1K characters", price: 0.2 },
        { name: "Speech-to-Text", unit: "minute", price: 0.02 },
      ],
    },
    {
      category: "Image Generation",
      icon: "image" as const,
      models: [
        { name: "SDXL", unit: "image", price: 0.03 },
        { name: "Flux", unit: "image", price: 0.05 },
      ],
    },
    {
      category: "Messaging",
      icon: "smartphone" as const,
      models: [{ name: "SMS", unit: "message", price: 0.01 }],
    },
  ],
} as const;

export type PricingData = typeof pricingData;
export type Capability = PricingData["capabilities"][number];
export type Model = Capability["models"][number];
