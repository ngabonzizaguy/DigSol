export type HomeHeroContent = {
  announcement?: string;
  headline?: string;
  headline_emphasis?: string;
  subtitle?: string;
  primary_label?: string;
  primary_href?: string;
  secondary_label?: string;
  secondary_href?: string;
  footnote?: string;
};

export type HomeHeroPreviewContent = {
  eyebrow?: string;
  title?: string;
  bullets?: { text?: string }[];
  metrics?: { value?: string; label?: string }[];
};

export type HomeTrustContent = {
  label?: string;
  partners?: { name?: string }[];
  stats?: { value?: string; label?: string }[];
};

export type SectionHeadingContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export type CtaBandContent = {
  title?: string;
  subtitle?: string;
  primary_label?: string;
  primary_href?: string;
  secondary_label?: string;
  secondary_href?: string;
};
