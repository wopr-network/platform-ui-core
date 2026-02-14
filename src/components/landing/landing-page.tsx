"use client";

import {
  BookOpen,
  Brain,
  Check,
  Code,
  Cpu,
  Eye,
  Hash,
  ImageIcon,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "./hero";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const scenarios = [
  {
    id: "research",
    text: "I told my WOPR Bot to research competitors, build a pitch deck, and email it to 50 investors. I went to sleep. I woke up to 3 replies.",
  },
  {
    id: "memory",
    text: "My WOPR Bot remembers every conversation I\u2019ve ever had with it. I said \u2018remember when we talked about that pricing idea last month?\u2019 It did.",
  },
  {
    id: "voice",
    text: "I run my business from Discord voice chat while I drive. My WOPR Bot takes the calls I can\u2019t.",
  },
  {
    id: "multi",
    text: "I have 3 bots. One runs my store. One writes my content. One handles customer support. My total payroll: $15/month.",
  },
  {
    id: "deploy",
    text: "My WOPR Bot wrote the code, tested it, deployed it, and messaged me on Discord when it was live. I was at dinner.",
  },
  {
    id: "website",
    text: "I told my bot \u2018make me a website.\u2019 It asked me 3 questions. 10 minutes later I had a site live at a real URL.",
  },
];

const channels = [
  { name: "Discord", icon: MessageSquare },
  { name: "Slack", icon: Hash },
  { name: "Telegram", icon: Send },
];

const providers = [
  { name: "Anthropic", icon: Brain },
  { name: "OpenAI", icon: Sparkles },
  { name: "Google Gemini", icon: Eye },
  { name: "Replicate", icon: Cpu },
];

const capabilities = [
  { name: "Voice", icon: Mic },
  { name: "Memory", icon: BookOpen },
  { name: "Image Generation", icon: ImageIcon },
  { name: "Code Execution", icon: Code },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    tagline: "Kick the tires.",
    features: ["$5 signup credit", "1 bot", "All providers", "All channels"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/mo",
    tagline: "Where most people live.",
    features: [
      "Credits included",
      "Unlimited bots",
      "All providers",
      "All channels",
      "Voice & memory",
    ],
    cta: "Get yours",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Credits",
    period: "",
    tagline: "No ceiling.",
    features: [
      "Credits at cost + margin",
      "Unlimited bots",
      "All providers",
      "All channels",
      "Priority support",
    ],
    cta: "Get started",
    highlighted: false,
  },
];

// ---------------------------------------------------------------------------
// Feature Grid Component
// ---------------------------------------------------------------------------

function FeatureGrid({
  title,
  items,
}: {
  title: string;
  items: { name: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-6 text-center"
          >
            <item.icon className="size-5 text-terminal" />
            <span className="text-sm text-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing Card Component
// ---------------------------------------------------------------------------

function PricingCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <div
      className={`flex flex-col rounded-sm border p-8 ${
        tier.highlighted
          ? "border-terminal bg-terminal/5 shadow-[0_0_24px_color-mix(in_srgb,var(--terminal)_10%,transparent)]"
          : "border-border bg-card"
      }`}
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">{tier.name}</p>
        <p className="mt-2 flex items-baseline gap-1">
          <span
            className={`text-4xl font-bold tracking-tight ${
              tier.highlighted ? "text-terminal" : "text-foreground"
            }`}
          >
            {tier.price}
          </span>
          {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{tier.tagline}</p>
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="size-4 shrink-0 text-terminal" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={tier.highlighted ? "terminal" : "outline"}
        size="lg"
        className="w-full"
        asChild
      >
        <Link href="/signup">{tier.cta}</Link>
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* ─── Hero ─── */}
      <Hero />

      {/* ─── Scenarios ─── */}
      {scenarios.map((scenario) => (
        <section key={scenario.id} className="flex min-h-[100dvh] items-center justify-center px-6">
          <blockquote className="max-w-3xl text-xl leading-relaxed text-terminal sm:text-2xl md:text-3xl">
            &ldquo;{scenario.text}&rdquo;
          </blockquote>
        </section>
      ))}

      {/* ─── What your WOPR Bot can do ─── */}
      <section className="mx-auto max-w-4xl px-6 py-32">
        <div className="mb-4 flex items-center gap-3">
          <Zap className="size-5 text-terminal" />
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-terminal">
            Under the hood
          </p>
        </div>
        <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Your WOPR Bot talks everywhere. Thinks with anything.
        </h2>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          WOPR is an AI agent platform with a plugin ecosystem. Bring your own API keys or use ours
          &mdash; either way, you stay in control.
        </p>
        <p className="mb-16 max-w-2xl text-muted-foreground">
          Pick a channel. Pick a brain. Your bot handles the rest.
        </p>

        <div className="flex flex-col gap-16">
          <FeatureGrid title="Channels" items={channels} />
          <FeatureGrid title="Providers" items={providers} />
          <FeatureGrid title="Capabilities" items={capabilities} />
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="mx-auto max-w-4xl px-6 py-32">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Five bucks. Unlimited bots.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Your WOPR Bot is a supercomputer. You control what it spends. No surprise bills.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Credits in, credits out. You&apos;re always in control.
        </p>

        <Link
          href="/pricing"
          className="text-sm text-terminal underline underline-offset-4 hover:text-terminal-dim"
        >
          See full pricing
        </Link>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-8 px-6 text-center">
        <h2 className="max-w-3xl text-2xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          Did you get your WOPR Bot yet?
        </h2>

        <Button variant="terminal" size="lg" asChild>
          <Link href="/signup">Get yours</Link>
        </Button>

        <span className="mt-8 text-sm text-muted-foreground opacity-60">wopr.bot</span>
      </section>

      {/* ─── Footer ─── */}
      <footer className="flex justify-center gap-6 px-6 pb-8 text-sm text-muted-foreground">
        <Link href="/pricing" className="underline underline-offset-4 hover:text-foreground">
          Pricing
        </Link>
        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
          Terms
        </Link>
        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
          Privacy
        </Link>
        <Link href="/docs" className="underline underline-offset-4 hover:text-foreground">
          Docs
        </Link>
        <a
          href="https://github.com/wopr-network"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
