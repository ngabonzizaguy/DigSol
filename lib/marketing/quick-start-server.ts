import "server-only";
import { cache } from "react";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_QUICK_START_CONFIG,
  parseQuickStartConfig,
  type QuickStartConfig,
} from "@/lib/marketing/quick-start-config";

export const getQuickStartConfig = cache(async (): Promise<QuickStartConfig> => {
  try {
    const settings = await getSiteSettings();
    return parseQuickStartConfig(settings.integrations);
  } catch {
    return DEFAULT_QUICK_START_CONFIG;
  }
});

export type QuickStartService = {
  slug: string;
  title: string;
  short: string;
};

export const getQuickStartServices = cache(async (): Promise<QuickStartService[]> => {
  try {
    const supabase = createPublicClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("services")
      .select("slug, title, short")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    const config = await getQuickStartConfig();
    if (config.service_slugs.length > 0) {
      const allow = new Set(config.service_slugs);
      return data.filter((s) => allow.has(s.slug));
    }
    return data as QuickStartService[];
  } catch {
    return [];
  }
});
