import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { PageViewLogger } from "@/components/marketing/page-view-logger";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="relative">{children}</main>
      <SiteFooter />
      <PageViewLogger />
    </SmoothScroll>
  );
}
