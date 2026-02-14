/**
 * WOPR Bot Brand Bible
 *
 * The rulebook. Every pixel, every word, every interaction on wopr.bot
 * references this file. Nothing ships without it.
 */

// ---------------------------------------------------------------------------
// Product Name
// ---------------------------------------------------------------------------

export const PRODUCT_NAME = "WOPR Bot" as const;
export const BRAND_NAME = "WOPR" as const;
export const DOMAIN = "wopr.bot" as const;
export const TAGLINE = "What would you do with your own WOPR Bot?" as const;
export const PRICE = "$5/month" as const;

export const nameRules = {
  correct: ["WOPR Bot", "your WOPR Bot", "Get your WOPR Bot", "a WOPR Bot", "wopr.bot"],
  incorrect: [
    "WOPR",
    "the WOPR platform",
    "WOPR AI",
    "WOPR service",
    "WOPR tool",
    "Wopr Bot",
    "wopr bot",
  ],
} as const;

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

export const colors = {
  /** Pure black. The void. Default background. */
  black: "#000000",
  /** Terminal green. The primary brand color. Use for text, borders, accents. */
  green: "#00FF41",
  /** Dimmed green for secondary/muted elements. */
  greenDim: "#00CC33",
  /** Faint green for hover states and subtle backgrounds. */
  greenFaint: "#00FF4110",
  /** Green at 20% opacity for borders and dividers. */
  greenBorder: "#00FF4133",
  /** Pure white. Body text on dark backgrounds. */
  white: "#FFFFFF",
  /** Muted white for secondary text. */
  gray: "#A0A0A0",
  /** Dark gray for disabled/placeholder text. */
  grayDim: "#666666",
  /** Near-black for card/surface backgrounds. */
  surface: "#0A0A0A",
  /** Slightly lighter surface for elevated cards. */
  surfaceElevated: "#111111",
  /** Error/destructive red. Terminal-style. */
  red: "#FF3333",
  /** Warning amber. */
  amber: "#FFAA00",
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: "'JetBrains Mono', monospace",
  scale: {
    /** Hero headline. One per viewport. */
    hero: { size: "3rem", lineHeight: "1.1", weight: "700", tracking: "-0.02em" },
    /** Page title. */
    h1: { size: "2.25rem", lineHeight: "1.2", weight: "700", tracking: "-0.02em" },
    /** Section heading. */
    h2: { size: "1.5rem", lineHeight: "1.3", weight: "600", tracking: "-0.01em" },
    /** Card heading. */
    h3: { size: "1.125rem", lineHeight: "1.4", weight: "600", tracking: "0" },
    /** Body text. */
    body: { size: "1rem", lineHeight: "1.6", weight: "400", tracking: "0" },
    /** Secondary/label text. */
    small: { size: "0.875rem", lineHeight: "1.5", weight: "400", tracking: "0" },
    /** Tiny text, badges, metadata. */
    xs: { size: "0.75rem", lineHeight: "1.4", weight: "500", tracking: "0.02em" },
    /** Code/terminal output. Same font, just used for semantic distinction. */
    mono: { size: "0.875rem", lineHeight: "1.6", weight: "400", tracking: "0" },
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing & Layout
// ---------------------------------------------------------------------------

export const layout = {
  /** Maximum content width for marketing pages. */
  maxWidth: "64rem",
  /** One idea per viewport. Generous vertical rhythm. */
  sectionPadding: "8rem",
  /** Border radius: sharp, not rounded. Terminal aesthetic. */
  radius: "0.25rem",
  /** No radius at all. For inputs and terminal elements. */
  radiusNone: "0",
} as const;

// ---------------------------------------------------------------------------
// Voice Guide
// ---------------------------------------------------------------------------

export const voice = {
  rules: [
    "Short sentences. If it needs a comma, it needs two sentences.",
    "No corporate language. Ever.",
    "Confident, not humble.",
    "The price is the punchline.",
    "Show, don't list.",
    "Internet-native. Write for screenshots and group chats.",
    "Sell the outcome, not the tool.",
  ],
  bannedWords: [
    "leverage",
    "empower",
    "solution",
    "unlock",
    "seamless",
    "robust",
    "platform",
    "synergy",
    "paradigm",
    "ecosystem",
    "holistic",
    "scalable",
    "disrupt",
    "innovate",
    "democratize",
    "next-gen",
    "cutting-edge",
    "game-changer",
  ],
  notAllowed: [
    "We're thrilled to announce...",
    "We're excited to share...",
    "Our powerful platform...",
    "Seamless integration...",
    "Leverage the power of...",
    "Unlock your potential...",
    "Empowering developers...",
    "Robust and scalable...",
  ],
} as const;

// ---------------------------------------------------------------------------
// Do / Don't Copy Examples
// ---------------------------------------------------------------------------

export const copyExamples = [
  {
    do: "Get your WOPR Bot.",
    dont: "Try our AI platform today.",
    rule: "Confident, not humble.",
  },
  {
    do: "Your WOPR Bot runs while you sleep.",
    dont: "Our always-on solution ensures 24/7 uptime.",
    rule: "Short sentences. No corporate language.",
  },
  {
    do: "Build a company. $5/month.",
    dont: "Leverage our powerful tools to unlock business potential.",
    rule: "Sell the outcome. Price is the punchline.",
  },
  {
    do: "WOPR Bot writes your code. Ships your product. Answers your DMs.",
    dont: "WOPR enables seamless automation across multiple workflows.",
    rule: "Show, don't list.",
  },
  {
    do: "What would you do with your own WOPR Bot?",
    dont: "Discover the possibilities of AI-powered automation.",
    rule: "Sell the outcome, not the tool.",
  },
  {
    do: "One bot. Everything handled.",
    dont: "Our comprehensive solution covers all your needs.",
    rule: "Short sentences.",
  },
  {
    do: "Your WOPR Bot doesn't take lunch breaks.",
    dont: "Benefit from continuous AI processing capabilities.",
    rule: "Internet-native.",
  },
  {
    do: "Replace yourself at your job. Keep the paycheck.",
    dont: "Optimize your workflow with intelligent automation.",
    rule: "Sell the outcome.",
  },
  {
    do: "WOPR Bot. Not WOPR. Not the WOPR platform.",
    dont: "Powered by the WOPR platform.",
    rule: "Product name is WOPR Bot.",
  },
  {
    do: "Five bucks. Unlimited bots.",
    dont: "Starting at just $5 per month with our flexible pricing.",
    rule: "The price is the punchline.",
  },
  {
    do: "Ship it. Your WOPR Bot already did.",
    dont: "Accelerate your deployment pipeline with our robust tooling.",
    rule: "Confident. No corporate language.",
  },
  {
    do: "wopr.bot",
    dont: "Visit us at wopr.bot to learn more about our offerings.",
    rule: "Internet-native. The URL is the noun.",
  },
] as const;

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export const animation = {
  /** Terminal typing effect speed in ms per character. */
  typingSpeed: 50,
  /** Cursor blink interval in ms. */
  cursorBlink: 530,
  /** That's it. No parallax. No floating elements. No scroll-jacking. */
  allowed: ["typing-effect", "cursor-blink"],
  banned: ["parallax", "floating-elements", "scroll-jacking", "hover-bounce"],
} as const;

// ---------------------------------------------------------------------------
// Imagery Rules
// ---------------------------------------------------------------------------

export const imagery = {
  allowed: ["screenshots of real things people built", "terminal output", "code"],
  banned: [
    "stock photos",
    "illustrations of diverse teams collaborating",
    "abstract gradient blobs",
    "generic tech imagery",
    "AI-generated art",
  ],
} as const;
