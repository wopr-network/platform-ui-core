import { describe, expect, it } from "vitest";
import {
  animation,
  BRAND_NAME,
  colors,
  copyExamples,
  DOMAIN,
  imagery,
  layout,
  nameRules,
  PRICE,
  PRODUCT_NAME,
  TAGLINE,
  typography,
  voice,
} from "../lib/brand";

describe("Brand Bible", () => {
  describe("Product identity", () => {
    it("defines product name as WOPR Bot", () => {
      expect(PRODUCT_NAME).toBe("WOPR Bot");
    });

    it("defines brand name as WOPR", () => {
      expect(BRAND_NAME).toBe("WOPR");
    });

    it("defines domain as wopr.bot", () => {
      expect(DOMAIN).toBe("wopr.bot");
    });

    it("has a tagline that asks a question", () => {
      expect(TAGLINE).toContain("WOPR Bot");
      expect(TAGLINE).toContain("?");
    });

    it("defines the price point", () => {
      expect(PRICE).toBe("$5/month");
    });
  });

  describe("Name rules", () => {
    it("has correct name forms", () => {
      expect(nameRules.correct).toContain("WOPR Bot");
      expect(nameRules.correct).toContain("your WOPR Bot");
    });

    it("flags incorrect name forms", () => {
      expect(nameRules.incorrect).toContain("the WOPR platform");
      expect(nameRules.incorrect).toContain("WOPR AI");
    });

    it("does not allow bare WOPR as product name", () => {
      expect(nameRules.incorrect).toContain("WOPR");
    });
  });

  describe("Color palette", () => {
    it("has black as primary background", () => {
      expect(colors.black).toBe("#000000");
    });

    it("defines terminal green as primary brand color", () => {
      expect(colors.green).toMatch(/^#00FF/i);
    });

    it("has white for text contrast", () => {
      expect(colors.white).toBe("#FFFFFF");
    });

    it("defines all required palette colors", () => {
      const required = [
        "black",
        "green",
        "greenDim",
        "greenFaint",
        "greenBorder",
        "white",
        "gray",
        "grayDim",
        "surface",
        "surfaceElevated",
        "red",
        "amber",
      ] as const;
      for (const key of required) {
        expect(colors[key]).toBeDefined();
        expect(colors[key]).toMatch(/^#[0-9A-Fa-f]+$/);
      }
    });
  });

  describe("Typography", () => {
    it("uses a monospace font family", () => {
      expect(typography.fontFamily).toContain("monospace");
    });

    it("specifies JetBrains Mono", () => {
      expect(typography.fontFamily).toContain("JetBrains Mono");
    });

    it("defines all scale levels", () => {
      const levels = ["hero", "h1", "h2", "h3", "body", "small", "xs", "mono"] as const;
      for (const level of levels) {
        expect(typography.scale[level]).toBeDefined();
        expect(typography.scale[level].size).toBeDefined();
        expect(typography.scale[level].lineHeight).toBeDefined();
        expect(typography.scale[level].weight).toBeDefined();
      }
    });
  });

  describe("Layout", () => {
    it("uses sharp border radius", () => {
      expect(Number.parseFloat(layout.radius)).toBeLessThanOrEqual(0.25);
    });

    it("has generous section padding", () => {
      expect(Number.parseFloat(layout.sectionPadding)).toBeGreaterThanOrEqual(6);
    });
  });

  describe("Voice guide", () => {
    it("has 7 voice rules", () => {
      expect(voice.rules).toHaveLength(7);
    });

    it("bans corporate language", () => {
      expect(voice.bannedWords).toContain("leverage");
      expect(voice.bannedWords).toContain("empower");
      expect(voice.bannedWords).toContain("seamless");
      expect(voice.bannedWords).toContain("robust");
    });

    it("bans specific phrases", () => {
      expect(voice.notAllowed.length).toBeGreaterThan(0);
      for (const phrase of voice.notAllowed) {
        expect(typeof phrase).toBe("string");
        expect(phrase.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Copy examples", () => {
    it("has at least 10 do/dont pairs", () => {
      expect(copyExamples.length).toBeGreaterThanOrEqual(10);
    });

    it("each example has do, dont, and rule", () => {
      for (const example of copyExamples) {
        expect(example.do).toBeDefined();
        expect(example.dont).toBeDefined();
        expect(example.rule).toBeDefined();
        expect(typeof example.do).toBe("string");
        expect(typeof example.dont).toBe("string");
        expect(typeof example.rule).toBe("string");
      }
    });

    it("includes WOPR Bot name usage examples", () => {
      const hasNameExample = copyExamples.some(
        (e) => e.do.includes("WOPR Bot") || e.rule.includes("WOPR Bot"),
      );
      expect(hasNameExample).toBe(true);
    });
  });

  describe("Animation", () => {
    it("allows only typing effect and cursor blink", () => {
      expect(animation.allowed).toContain("typing-effect");
      expect(animation.allowed).toContain("cursor-blink");
      expect(animation.allowed).toHaveLength(2);
    });

    it("bans parallax and scroll-jacking", () => {
      expect(animation.banned).toContain("parallax");
      expect(animation.banned).toContain("scroll-jacking");
    });
  });

  describe("Imagery", () => {
    it("bans stock photos", () => {
      expect(imagery.banned).toContain("stock photos");
    });

    it("allows screenshots of real things", () => {
      const hasScreenshots = imagery.allowed.some((a) => a.includes("screenshot"));
      expect(hasScreenshots).toBe(true);
    });
  });
});
