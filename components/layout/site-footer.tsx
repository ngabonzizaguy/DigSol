import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import { buildFooterNavWithServices } from "@/lib/marketing/site-nav-server";
import type { FooterNavColumn } from "@/lib/marketing/site-nav-server";

type SiteFooterProps = {
  newsletter?: React.ReactNode;
  footerColumns?: FooterNavColumn[];
};

export async function SiteFooter({ newsletter, footerColumns }: SiteFooterProps) {
  const [settings, columns] = await Promise.all([
    getSiteSettings(),
    footerColumns ? Promise.resolve(footerColumns) : buildFooterNavWithServices(),
  ]);
  const brand = settings.brand;
  const contact = settings.contact;
  const social = settings.social;

  const brandName = brand.name?.trim() || site.name;
  const description = brand.description?.trim() || site.description;
  const legal = brand.legal?.trim() || site.legal;
  const email = contact.email?.trim() || site.email;
  const phone = contact.phone?.trim() || site.phone;
  const linkedin = social.linkedin?.trim() || site.social.linkedin;
  const x = social.x?.trim() || site.social.x;
  const instagram = social.instagram?.trim() || site.social.instagram;
  const youtube = social.youtube?.trim() || site.social.youtube;

  return (
    <footer className="border-t border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(5,_1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-[20px] tracking-tight text-ink">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-ink text-on-dark font-sans text-[12px] font-semibold">
                DS
              </span>
              <span>{brandName}</span>
            </Link>
            <p className="mt-4 text-[14px] text-muted leading-relaxed max-w-sm">{description}</p>
            {newsletter}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-4">{column.title}</p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
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
            &copy; {new Date().getFullYear()} {legal}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${email}`} className="hover:text-ink transition">
              {email}
            </a>
            <span aria-hidden className="text-hairline-strong">
              ·
            </span>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-ink transition">
              {phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {linkedin ? (
              <a href={linkedin} aria-label="LinkedIn" className="text-muted hover:text-ink transition">
                <Linkedin className="h-4 w-4" />
              </a>
            ) : null}
            {x ? (
              <a href={x} aria-label="X" className="text-muted hover:text-ink transition">
                <Twitter className="h-4 w-4" />
              </a>
            ) : null}
            {instagram ? (
              <a href={instagram} aria-label="Instagram" className="text-muted hover:text-ink transition">
                <Instagram className="h-4 w-4" />
              </a>
            ) : null}
            {youtube ? (
              <a href={youtube} aria-label="YouTube" className="text-muted hover:text-ink transition">
                <Youtube className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
