import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AdminPageHeader, AdminPageStack } from "@/components/admin/shared/admin-page-stack";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import {
  getEffectivePricingForAdmin,
  getResolvedSiteSettingsForAdmin,
  settingsPricingRowsFromResolved,
} from "@/lib/admin/resolve-public-content";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, effectivePricing] = await Promise.all([
    getResolvedSiteSettingsForAdmin(),
    getEffectivePricingForAdmin(),
  ]);

  const settingsForForm = {
    ...settings,
    pricing_tiers: settingsPricingRowsFromResolved(settings),
  };

  return (
    <AdminPageStack>
      <AdminPageHeader
        title="Site settings"
        description="Values match what visitors see until you save changes. Empty database fields are filled from the live site defaults."
      />
      <div className="flex flex-wrap items-center gap-3 text-[12px]">
        <Link
          href="/admin/ai"
          className="inline-flex items-center gap-1.5 rounded-full border border-admin-border-soft bg-admin-surface px-3 py-1.5 text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
        >
          <Sparkles className="size-3.5" /> AI features
        </Link>
        <Link
          href="/admin/account"
          className="inline-flex items-center gap-1.5 rounded-full border border-admin-border-soft bg-admin-surface px-3 py-1.5 text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
        >
          My account
        </Link>
      </div>
      <SettingsForm settings={settingsForForm} effectivePricing={effectivePricing} />
    </AdminPageStack>
  );
}
