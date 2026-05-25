import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { buildPageSectionsStore, type PageSectionsStore } from "@/lib/marketing/page-sections-store";

export const getPageSectionsStore = cache(async (): Promise<PageSectionsStore> => {
  try {
    const supabase = createPublicClient();
    if (!supabase) return buildPageSectionsStore(null);
    const { data } = await supabase.from("site_settings").select("integrations").eq("id", 1).maybeSingle();
    const integrations = (data?.integrations ?? {}) as Record<string, unknown>;
    return buildPageSectionsStore(integrations);
  } catch {
    return buildPageSectionsStore(null);
  }
});
