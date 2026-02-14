"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypingEffect } from "./typing-effect";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <Badge variant="terminal" className="mb-8">
        Now in beta
      </Badge>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]">
        <span className="sr-only">What would you do with your own WOPR Bot?</span>
        <TypingEffect text="What would you do with your own WOPR Bot?" speed={40} />
      </h1>

      <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl">
        One bot. Everything handled. Your code. Your rules. Your WOPR Bot.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
        <Button variant="terminal" size="lg">
          Get your WOPR Bot
        </Button>
        <span className="text-muted-foreground text-sm">$5/month. That&apos;s it.</span>
      </div>

      <div className="mt-24 text-terminal font-mono text-sm opacity-60">wopr.bot</div>
    </section>
  );
}
