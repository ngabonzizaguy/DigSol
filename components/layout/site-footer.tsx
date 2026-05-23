import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { footerNav } from "@/lib/content/nav";
import { site } from "@/lib/site";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(5,_1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-[20px] tracking-tight text-ink">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-ink text-on-dark font-sans text-[12px] font-semibold">
                DS
              </span>
              <span>DigSolutions</span>
            </Link>
            <p className="mt-4 text-[14px] text-muted leading-relaxed max-w-sm">
              {site.description}
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
            <p className="mt-2 text-[12px] text-muted-soft">
              Quiet, monthly insights. No spam. Unsubscribe in one click.
            </p>
          </div>

          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-body hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-[13px] text-muted">
          <p>
            &copy; {new Date().getFullYear()} {site.legal}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${site.email}`} className="hover:text-ink transition">{site.email}</a>
            <span aria-hidden className="text-hairline-strong">·</span>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-ink transition">{site.phone}</a>
          </div>
          <div className="flex items-center gap-3">
            <a href={site.social.linkedin} aria-label="LinkedIn" className="text-muted hover:text-ink transition">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={site.social.x} aria-label="X" className="text-muted hover:text-ink transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href={site.social.instagram} aria-label="Instagram" className="text-muted hover:text-ink transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={site.social.youtube} aria-label="YouTube" className="text-muted hover:text-ink transition">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
