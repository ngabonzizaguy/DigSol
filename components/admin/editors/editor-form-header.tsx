import type { ReactNode } from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { StatusBadge } from "@/components/admin/ui/badge";

import type { ContentStatus } from "@/lib/supabase/types";



export function EditorFormHeader({

  backHref,

  backLabel,

  title,

  status,

  actions,

}: {

  backHref: string;

  backLabel: string;

  title: string;

  status?: ContentStatus;

  actions: ReactNode;

}) {

  return (

    <header className="space-y-3">

      <div className="flex items-center justify-between gap-2">

        <Link

          href={backHref}

          className="flex min-w-0 items-center gap-1 text-[12px] text-admin-fg-subtle hover:text-admin-fg"

        >

          <ArrowLeft className="size-3 shrink-0" />

          <span className="truncate">{backLabel}</span>

        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">{actions}</div>

      </div>

      <div className="flex min-w-0 items-center gap-2 border-t border-admin-border-soft pt-3 md:border-0 md:pt-0">

        <h1

          className="min-w-0 flex-1 truncate text-[16px] font-semibold tracking-tight text-admin-fg md:text-[18px]"

          title={title}

        >

          {title}

        </h1>

        {status ? (

          <span className="shrink-0">

            <StatusBadge status={status} />

          </span>

        ) : null}

      </div>

    </header>

  );

}

