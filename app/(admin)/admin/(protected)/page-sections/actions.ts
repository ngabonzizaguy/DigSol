"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";
import { getPageSectionsPersistState } from "@/lib/admin/resolve-public-content";
import type { PageSectionsPersistState } from "@/lib/admin/content-source-labels";
import {
  buildPageSectionsStore,
  mergePageSectionContent,
  mergePageSectionVisibility,
  toIntegrationsPageSections,
  type PageSectionsStore,
} from "@/lib/marketing/page-sections-store";

const storeSchema = z.object({
  visibility: z.record(z.string(), z.record(z.string(), z.boolean())),
  content: z.record(z.string(), z.record(z.string(), z.record(z.string(), z.unknown()))),
});

export type SavePageSectionsResult = { ok: true } | { ok: false; error: string };

export type LoadPageSectionsForAdminResult = {
  store: PageSectionsStore;
  persistState: PageSectionsPersistState;
};

export async function loadPageSectionsForAdmin(): Promise<LoadPageSectionsForAdminResult> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("integrations").eq("id", 1).maybeSingle();
  const integrations = (data?.integrations ?? {}) as Record<string, unknown>;
  return {
    store: buildPageSectionsStore(integrations),
    persistState: getPageSectionsPersistState(integrations),
  };
}

export async function savePageSections(
  _prev: SavePageSectionsResult | null,
  payload: PageSectionsStore,
): Promise<SavePageSectionsResult> {
  const parsed = storeSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Invalid section data" };

  const store: PageSectionsStore = {
    visibility: mergePageSectionVisibility(parsed.data.visibility),
    content: mergePageSectionContent(parsed.data.content),
  };

  const supabase = await createClient();
  const { data: existing } = await supabase.from("site_settings").select("integrations").eq("id", 1).maybeSingle();
  const integrations = {
    ...((existing?.integrations ?? {}) as Record<string, unknown>),
    page_sections: toIntegrationsPageSections(store),
  };

  const { error } = await supabase.from("site_settings").update({ integrations }).eq("id", 1);
  if (error) return { ok: false, error: error.message };

  await logActivity({ entity: "site_settings", entity_id: "1", action: "update:page_sections" });

  revalidatePath("/", "layout");
  revalidatePath("/admin/page-sections");
  const paths = [
    "/",
    "/solutions",
    "/industries",
    "/work",
    "/insights",
    "/about",
    "/how-we-work",
    "/contact",
    "/faq",
    "/for-smb",
    "/for-enterprise",
    "/book-consultation",
  ];
  for (const path of paths) revalidatePath(path);

  return { ok: true };
}
