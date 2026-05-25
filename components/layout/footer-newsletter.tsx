import { NewsletterForm } from "@/components/marketing/newsletter-form";

export type FooterNewsletterContent = {
  blurb?: string;
};

export function FooterNewsletter({ content }: { content: FooterNewsletterContent }) {
  const blurb = content.blurb?.trim();
  return (
    <div className="mt-6 max-w-md">
      <NewsletterForm />
      {blurb ? <p className="mt-2 text-[12px] text-muted-soft">{blurb}</p> : null}
    </div>
  );
}
