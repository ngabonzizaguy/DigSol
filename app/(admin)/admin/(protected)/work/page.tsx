import { createClient } from "@/lib/supabase/server";

import { ContentList } from "@/components/admin/content/content-list";

import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";

import { mapCaseStudies, STATUS_FILTER } from "@/lib/admin/content-list-mappers";

import type { CaseStudy } from "@/lib/supabase/types";



export const metadata = { title: "Work" };



export default async function CaseStudiesListPage() {

  const supabase = await createClient();

  const { data } = await supabase

    .from("case_studies")

    .select("*")

    .order("sort_order")

    .order("created_at", { ascending: false });

  const rows = (data ?? []) as CaseStudy[];



  return (

    <div className="w-full min-w-0 max-w-full space-y-5">

      <ContentListPageHeader

        title="Work"

        description="Client projects and case studies shown across `/work`."

        newHref="/admin/work/new"

        newLabel="New project"

      />

      <ContentList

        items={mapCaseStudies(rows)}

        filters={[

          STATUS_FILTER,

          { id: "segment", allLabel: "All segments" },

          { id: "industry", allLabel: "All industries" },

        ]}

        emptyTitle="No projects yet"

        emptyDescription="Create your first case study to populate the portfolio."

      />

    </div>

  );

}

