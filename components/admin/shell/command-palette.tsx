"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { adminNav } from "@/lib/admin/nav";

type CommandPaletteContextValue = {
  open: () => void;
  close: () => void;
};
const CommandPaletteContext = React.createContext<CommandPaletteContextValue>({
  open: () => {},
  close: () => {},
});

export function useCommandPalette() {
  return React.useContext(CommandPaletteContext);
}

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ open, close }}>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-[12vh]" onClick={close}>
          <div
            className="w-[560px] max-w-[90vw] overflow-hidden rounded-xl border border-admin-border bg-admin-surface shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Admin command palette" className="flex flex-col">
              <Command.Input
                placeholder="Type a command or search…"
                className="h-11 w-full border-b border-admin-border-soft bg-transparent px-4 text-[13px] text-admin-fg placeholder:text-admin-fg-subtle outline-none"
              />
              <Command.List className="max-h-[60vh] overflow-y-auto p-2 text-[13px]">
                <Command.Empty className="px-3 py-6 text-center text-admin-fg-subtle">No results found.</Command.Empty>
                {adminNav.map((group) => (
                  <Command.Group
                    key={group.label}
                    heading={group.label}
                    className="mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-admin-fg-subtle"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.href}
                          value={`${group.label} ${item.label}`}
                          onSelect={() => {
                            router.push(item.href);
                            close();
                          }}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-admin-fg-muted data-[selected=true]:bg-admin-hover data-[selected=true]:text-admin-fg"
                        >
                          <Icon className="size-3.5" />
                          {item.label}
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
                <Command.Group
                  heading="Quick actions"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-admin-fg-subtle"
                >
                  <Command.Item
                    onSelect={() => {
                      router.push("/admin/services/new");
                      close();
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 data-[selected=true]:bg-admin-hover"
                  >
                    + New service
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/admin/work/new");
                      close();
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 data-[selected=true]:bg-admin-hover"
                  >
                    + New case study
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/admin/insights/new");
                      close();
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 data-[selected=true]:bg-admin-hover"
                  >
                    + New insight
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      ) : null}
    </CommandPaletteContext.Provider>
  );
}
