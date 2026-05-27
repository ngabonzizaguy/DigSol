/**
 * Quick Start configuration — shape stored under `site_settings.integrations.quick_start`
 * and merged with sensible defaults so the flow works even before the CMS surface
 * is built (Phase C).
 */

import { z } from "zod";

export const QS_CONFIG_KEY = "quick_start" as const;

export type QuickStartCopyBlock = {
  title: string;
  body?: string;
};

export type QuickStartCopy = {
  welcome: QuickStartCopyBlock;
  about: QuickStartCopyBlock;
  needs: QuickStartCopyBlock;
  details: QuickStartCopyBlock;
  budget: QuickStartCopyBlock;
  contact: QuickStartCopyBlock;
  review: QuickStartCopyBlock;
  success: QuickStartCopyBlock;
};

export type BudgetPreset = { min: number; max: number; label: string };

export type QuickStartConfig = {
  enabled: boolean;
  copy: QuickStartCopy;
  service_slugs: string[]; // empty = show all live services
  budget_presets: {
    rwf: BudgetPreset[];
    usd: BudgetPreset[];
  };
  budget_bounds: {
    rwf: { min: number; max: number; step: number };
    usd: { min: number; max: number; step: number };
  };
  whatsapp: {
    number_e164: string; // e.g. "+250788123456" — empty disables WhatsApp CTAs
    default_country: string; // ISO alpha-2
    supported_countries: string[];
  };
  reachability_windows: string[];
};

export const DEFAULT_QUICK_START_CONFIG: QuickStartConfig = {
  enabled: true,
  copy: {
    welcome: {
      title: "Let's get you to the right place.",
      body: "Tell us a little about what you need. Two minutes — no pressure, no jargon.",
    },
    about: {
      title: "Who should we be talking to?",
      body: "Just the basics so we can reach you the way you prefer.",
    },
    needs: {
      title: "What do you need help with?",
      body: "Pick a service we already offer, or describe something custom.",
    },
    details: {
      title: "A little more context.",
      body: "Optional. Skip any of this if you're still figuring it out.",
    },
    budget: {
      title: "What's your budget range?",
      body: "Helps us recommend something realistic. Pick a range or tell us you're not sure yet.",
    },
    contact: {
      title: "How should we reach you?",
      body: "Choose the channel that works best and when you'd like to hear from us.",
    },
    review: {
      title: "Quick look before you send.",
      body: "Edit anything that's off, then we'll get back to you within one business day.",
    },
    success: {
      title: "Thanks — we've got it.",
      body: "We'll reach out within one business day. You'll get a confirmation email shortly.",
    },
  },
  service_slugs: [],
  budget_presets: {
    rwf: [
      { min: 500_000, max: 2_000_000, label: "500K – 2M RWF" },
      { min: 2_000_000, max: 5_000_000, label: "2M – 5M RWF" },
      { min: 5_000_000, max: 15_000_000, label: "5M – 15M RWF" },
      { min: 15_000_000, max: 50_000_000, label: "15M+ RWF" },
    ],
    usd: [
      { min: 500, max: 2_000, label: "$500 – $2K" },
      { min: 2_000, max: 5_000, label: "$2K – $5K" },
      { min: 5_000, max: 15_000, label: "$5K – $15K" },
      { min: 15_000, max: 50_000, label: "$15K+" },
    ],
  },
  budget_bounds: {
    rwf: { min: 100_000, max: 100_000_000, step: 100_000 },
    usd: { min: 100, max: 100_000, step: 100 },
  },
  whatsapp: {
    number_e164: "",
    default_country: "RW",
    supported_countries: ["RW", "KE", "UG", "TZ", "US", "GB"],
  },
  reachability_windows: [
    "Weekdays 9–12 (CAT)",
    "Weekdays 13–17 (CAT)",
    "Evenings (after 17:00 CAT)",
    "Anytime — surprise us",
  ],
};

// Zod schema for admin updates
const copyBlockSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().max(600).optional(),
});

export const quickStartConfigSchema = z.object({
  enabled: z.boolean(),
  copy: z.object({
    welcome: copyBlockSchema,
    about: copyBlockSchema,
    needs: copyBlockSchema,
    details: copyBlockSchema,
    budget: copyBlockSchema,
    contact: copyBlockSchema,
    review: copyBlockSchema,
    success: copyBlockSchema,
  }),
  service_slugs: z.array(z.string()).default([]),
  budget_presets: z.object({
    rwf: z.array(z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative(), label: z.string() })),
    usd: z.array(z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative(), label: z.string() })),
  }),
  budget_bounds: z.object({
    rwf: z.object({ min: z.number().int().nonnegative(), max: z.number().int().positive(), step: z.number().int().positive() }),
    usd: z.object({ min: z.number().int().nonnegative(), max: z.number().int().positive(), step: z.number().int().positive() }),
  }),
  whatsapp: z.object({
    number_e164: z.string().regex(/^(\+\d{6,15})?$/u, "Use E.164 format (e.g. +250788123456) or leave blank"),
    default_country: z.string().length(2),
    supported_countries: z.array(z.string().length(2)),
  }),
  reachability_windows: z.array(z.string().min(1)),
});

export function parseQuickStartConfig(integrations: Record<string, unknown> | null | undefined): QuickStartConfig {
  const raw = integrations?.[QS_CONFIG_KEY];
  if (!raw || typeof raw !== "object") return DEFAULT_QUICK_START_CONFIG;
  const result = quickStartConfigSchema.safeParse(raw);
  if (!result.success) {
    // Merge what we can; fall back to defaults for invalid shape.
    return mergeWithDefaults(raw as Partial<QuickStartConfig>);
  }
  return result.data;
}

function mergeWithDefaults(partial: Partial<QuickStartConfig>): QuickStartConfig {
  return {
    ...DEFAULT_QUICK_START_CONFIG,
    ...partial,
    copy: { ...DEFAULT_QUICK_START_CONFIG.copy, ...(partial.copy ?? {}) },
    budget_presets: { ...DEFAULT_QUICK_START_CONFIG.budget_presets, ...(partial.budget_presets ?? {}) },
    budget_bounds: { ...DEFAULT_QUICK_START_CONFIG.budget_bounds, ...(partial.budget_bounds ?? {}) },
    whatsapp: { ...DEFAULT_QUICK_START_CONFIG.whatsapp, ...(partial.whatsapp ?? {}) },
    reachability_windows: partial.reachability_windows ?? DEFAULT_QUICK_START_CONFIG.reachability_windows,
  };
}
