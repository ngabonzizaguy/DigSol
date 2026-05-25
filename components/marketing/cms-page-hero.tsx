import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import type { PageHeroContent } from "@/lib/marketing/marketing-page-content";

type Props = PageHeroContent & {
  children?: React.ReactNode;
};

/** Skips rendering when headline missing — keeps layout neat. */
export function CmsPageHero({
  eyebrow,
  title,
  subtitle,
  primary_label,
  primary_href,
  secondary_label,
  secondary_href,
  children,
}: Props) {
  const headline = title?.trim();
  if (!headline) return null;

  const primary = primary_label?.trim() && primary_href?.trim();
  const secondary = secondary_label?.trim() && secondary_href?.trim();
  const actions =
    children ??
    (primary || secondary ? (
      <>
        {primary ? (
          <Button href={primary_href!} size="lg">
            {primary_label}
          </Button>
        ) : null}
        {secondary ? (
          <Button href={secondary_href!} variant="outline" size="lg">
            {secondary_label}
          </Button>
        ) : null}
      </>
    ) : null);

  return (
    <PageHero eyebrow={eyebrow?.trim() || undefined} title={headline} subtitle={subtitle?.trim() || undefined}>
      {actions}
    </PageHero>
  );
}
