"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hero } from "./hero";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* --- Hero --- */}
      <Hero />

      {/* --- The Proof --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.blockquote
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="border-l-2 border-terminal/40 pl-6 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Every commit to this codebase was planned, written, reviewed, and shipped by WOPR
            agents. Every sprint. Every Linear issue. Every architecture decision. We are the proof
            of concept.
          </motion.blockquote>
        </div>
      </section>

      {/* --- The One Story --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-2xl font-bold leading-tight tracking-tight text-terminal sm:text-3xl md:text-4xl"
          >
            &ldquo;It called me on my drive home to talk about a revenue stream it created.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* --- Three Audiences --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl space-y-12">
          {[
            {
              label: "For operators",
              text: "You don\u2019t need a team. You need a WOPR.",
            },
            {
              label: "For thinkers",
              text: "This is what AI autonomy looks like in production today. Not hypothetical. Running.",
            },
            {
              label: "For creators",
              text: "You do the work you love. WOPR does everything else.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-terminal/60">
                {item.label}
              </p>
              <p className="mt-2 text-lg text-foreground md:text-xl">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Starting at $5/month.
            </p>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Less than Netflix. For something that runs your business.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Credits for hosted capabilities (voice, image generation, compute). Plugins are free.
              Always.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">Get in touch</p>
          <a
            href="mailto:hello@wopr.network"
            className="mt-2 inline-block text-lg text-terminal underline underline-offset-4 hover:text-terminal-dim"
          >
            hello@wopr.network
          </a>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <span className="text-lg font-semibold tracking-tight text-foreground">WOPR Bot</span>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>
          </div>
          <span className="text-xs text-muted-foreground opacity-40">wopr.bot</span>
        </div>
      </footer>
    </div>
  );
}
