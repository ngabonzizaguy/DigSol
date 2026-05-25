import { SectionHeading } from "@/components/marketing/section-heading";
import type { SectionHeadingContent } from "@/lib/marketing/home-content";

type Props = {
  content: SectionHeadingContent;
  align?: "left" | "center";
  className?: string;
};

/** Renders nothing if title is empty — avoids empty heading gaps. */
export function CmsSectionHeading({ content, align = "left", className }: Props) {
  const title = content.title?.trim();
  if (!title) return null;

  return (
    <SectionHeading
      eyebrow={content.eyebrow?.trim() || undefined}
      title={title}
      subtitle={content.subtitle?.trim() || undefined}
      align={align}
      className={className}
    />
  );
}
