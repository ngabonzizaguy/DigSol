import { createClient } from "@/lib/supabase/server";
import { parseQuickStartConfig } from "@/lib/marketing/quick-start-config";
import { QuickStartEditor } from "@/components/admin/quick-start/quick-start-editor";

export const metadata = { title: "Quick Start" };
export const dynamic = "force-dynamic";

export default async function QuickStartAdminPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("integrations")
    .eq("id", 1)
    .maybeSingle();
  const config = parseQuickStartConfig((settings?.integrations as Record<string, unknown> | null) ?? {});

  const { data: services } = await supabase
    .from("services")
    .select("slug, title")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Quick Start</h1>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-admin-fg-subtle">
          Manage the welcome modal + <code>/start</code> page experience. Toggle visibility, edit copy,
          choose which services appear, configure budget presets, and set WhatsApp + reachability options.
        </p>
      </header>
      <QuickStartEditor initialConfig={config} services={services ?? []} />
    </div>
  );
}
