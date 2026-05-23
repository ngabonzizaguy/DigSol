"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { primaryNav } from "@/lib/content/nav";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between gap-6 rounded-full transition-all duration-500 ease-expo",
            scrolled ? "glass px-4 py-2" : "px-2 py-2"
          )}
        >
          <Link href="/" className="flex items-center gap-2 font-display text-[20px] tracking-tight text-ink">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-ink text-on-dark font-sans text-[12px] font-semibold">
              DS
            </span>
            <span>DigSolutions</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {primaryNav.map((item) => {
              const hasChildren = !!item.children?.length;
              const isActive = hovered === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setHovered(item.label)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium text-ink/85 hover:text-ink transition"
                  >
                    {item.label}
                    {hasChildren && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                  </Link>
                  <AnimatePresence>
                    {hasChildren && isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                      >
                        <div className="glass min-w-[420px] rounded-2xl p-3 shadow-lift">
                          <ul className="grid gap-1">
                            {item.children!.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-xl px-3 py-2.5 transition hover:bg-white/60"
                                >
                                  <p className="text-[14px] font-medium text-ink">{child.label}</p>
                                  {"description" in child && child.description && (
                                    <p className="mt-0.5 text-[12.5px] text-muted leading-snug">{child.description}</p>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button href="/contact" variant="ghost" size="sm">Contact</Button>
            <Button href="/book-consultation" size="sm">Book consultation</Button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-hairline-strong bg-surface-card"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mx-auto max-w-[1240px] px-6 mt-2"
          >
            <div className="glass rounded-2xl p-4">
              <nav className="grid gap-1">
                {primaryNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-white/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button href="/contact" variant="outline" size="sm" className="w-full">
                  Contact
                </Button>
                <Button href="/book-consultation" size="sm" className="w-full">
                  Book consultation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
