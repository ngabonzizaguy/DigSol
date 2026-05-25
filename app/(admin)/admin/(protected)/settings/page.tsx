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
      <SettingsForm settings={settingsForForm} effectivePricing={effectivePricing} />
    </AdminPageStack>
  );
}
