import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import { buildPrimaryNav, getSiteHeaderContent, headerChromeFromContent } from "@/lib/marketing/site-nav-server";

export async function MarketingSiteHeader() {
  const [header, nav, settings] = await Promise.all([
    getSiteHeaderContent(),
    buildPrimaryNav(),
    getSiteSettings(),
  ]);
  const chrome = headerChromeFromContent(header, settings.brand.name?.trim());

  return (
    <SiteHeader
      nav={nav}
      brandName={chrome.brandName}
      logoAbbr={chrome.logoAbbr}
      contactLabel={chrome.contactLabel}
      contactHref={chrome.contactHref}
      bookLabel={chrome.bookLabel}
      bookHref={chrome.bookHref}
    />
  );
}
