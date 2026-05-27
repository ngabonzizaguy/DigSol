import type { BudgetCurrency, PreferredChannel } from "@/lib/supabase/types";

export type QuickStartIntent = "find_service" | "custom_request" | "exploring";

export type QuickStartDraft = {
  step: number;
  intent: QuickStartIntent | null;
  about: {
    name: string;
    email: string;
    country_code: string;
    phone_dial_code: string;
    phone: string;
    company: string;
    role: string;
  };
  needs: {
    service_slugs: string[];
    custom_request: string;
  };
  details: {
    description: string;
    goals: string;
    timeline: string; // "asap" | "1_3" | "3_6" | "flexible" | ""
    links: string[];
  };
  // Attachments live outside the JSON-persistable draft (Files / Blobs aren't serializable).
  // They're tracked in component state alongside the draft.
  budget: {
    currency: BudgetCurrency;
    min: number;
    max: number;
    unsure: boolean;
  };
  contact: {
    channel: PreferredChannel | "";
    window: string;
  };
};

export const TOTAL_STEPS = 8;

export const initialDraft = (defaults?: {
  country_code?: string;
  currency?: BudgetCurrency;
  budgetMin?: number;
  budgetMax?: number;
}): QuickStartDraft => ({
  step: 1,
  intent: null,
  about: {
    name: "",
    email: "",
    country_code: defaults?.country_code ?? "RW",
    phone_dial_code: defaults?.country_code === "RW" || !defaults?.country_code ? "+250" : "",
    phone: "",
    company: "",
    role: "",
  },
  needs: { service_slugs: [], custom_request: "" },
  details: { description: "", goals: "", timeline: "", links: [] },
  budget: {
    currency: defaults?.currency ?? "RWF",
    min: defaults?.budgetMin ?? 500_000,
    max: defaults?.budgetMax ?? 2_000_000,
    unsure: false,
  },
  contact: { channel: "", window: "" },
});
