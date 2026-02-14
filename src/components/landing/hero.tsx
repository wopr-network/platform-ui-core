"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypingEffect } from "./typing-effect";

export function Hero() {
  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center bg-background px-6 text-center">
      <Badge variant="terminal" className="mb-8">
        Now in beta
      </Badge>

      <h1 className="max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="sr-only">What would you do with your own WOPR Bot?</span>
        <span aria-hidden="true">
          <TypingEffect text="What would you do with your own WOPR Bot?" speed={40} />
        </span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
        One bot. Everything handled. Your code. Your rules. Your WOPR Bot.
      </p>

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Button variant="terminal" size="lg" asChild>
          <Link href="/signup">Get your WOPR Bot</Link>
        </Button>
        <span className="text-sm text-muted-foreground">$5/month. That&apos;s it.</span>
      </div>

      <div className="mt-24 text-sm text-terminal opacity-60">wopr.bot</div>
    </section>
  );
}
