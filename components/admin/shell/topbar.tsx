"use client";

import Link from "next/link";
import { ChevronRight, Command, ExternalLink, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/admin/theme-provider";
import { Button } from "@/components/admin/ui/button";
import { useCommandPalette } from "@/components/admin/shell/command-palette";
import { useSidebar } from "@/components/admin/shell/sidebar-context";

export function AdminTopbar({
  user,
  integrationMode,
}: {
  user: { email: string; role: string; name?: string | null } | null;
  integrationMode?: { aiMock?: boolean; emailMock?: boolean };
}) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { open } = useCommandPalette();
  const { collapsed, toggleCollapsed, openMobile } = useSidebar();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-admin-border bg-admin-bg/80 px-3 backdrop-blur md:px-4">
      <button
        type="button"
        aria-label="Open menu"
        onClick={openMobile}
        className="grid size-8 place-items-center rounded-md text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg md:hidden"
      >
        <Menu className="size-4" />
      </button>

      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleCollapsed}
        className="hidden size-8 place-items-center rounded-md text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg md:grid"
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </button>

      <nav className="hidden min-w-0 items-center gap-1 text-[12px] text-admin-fg-subtle sm:flex">
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          return (
            <span key={href} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className="size-3" /> : null}
              {isLast ? (
                <span className="truncate font-medium text-admin-fg">{seg}</span>
              ) : (
                <Link href={href} className="hover:text-admin-fg">
                  {seg}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        {integrationMode?.aiMock ? (
          <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300 sm:inline">
            AI mock
          </span>
        ) : null}
        {integrationMode?.emailMock ? (
          <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300 sm:inline">
            Email mock
          </span>
        ) : null}
        <button
          onClick={open}
          className="hidden h-7 items-center gap-2 rounded-md border border-admin-border bg-admin-surface px-2 text-[12px] text-admin-fg-subtle hover:bg-admin-hover md:flex"
        >
          <Command className="size-3" />
          <span>Search</span>
          <kbd className="ml-2 rounded border border-admin-border bg-admin-bg px-1 py-0 font-mono text-[9px]">⌘K</kbd>
        </button>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </Button>

        <Link
          href="/"
          target="_blank"
          className="hidden h-7 items-center gap-1.5 rounded-md border border-admin-border px-2 text-[12px] text-admin-fg-muted hover:bg-admin-hover sm:flex"
        >
          <ExternalLink className="size-3" />
          <span className="hidden md:inline">View site</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 rounded-full border border-admin-border bg-admin-surface px-2 py-1">
            <span className="grid size-5 place-items-center rounded-full bg-admin-accent text-[10px] font-bold text-admin-accent-fg">
              {user.email.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-[12px] font-medium text-admin-fg sm:inline">
              {user.name ?? user.email.split("@")[0]}
            </span>
            <span className="hidden rounded bg-admin-border-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-admin-fg-subtle sm:inline">
              {user.role}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
