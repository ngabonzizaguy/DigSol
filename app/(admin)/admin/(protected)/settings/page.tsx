import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import type { SiteSettings } from "@/lib/supabase/types";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const settings = (data ?? { id: 1, brand: {}, contact: {}, social: {}, seo_defaults: {}, pricing_tiers: [], integrations: {}, updated_at: new Date().toISOString() }) as SiteSettings;
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Site settings</h1>
        <p className="text-[13px] text-admin-fg-subtle">Brand, contact, social, SEO defaults, and pricing.</p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
