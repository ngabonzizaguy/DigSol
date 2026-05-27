import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapTestimonials, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { Testimonial } from "@/lib/supabase/types";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const rows = (data ?? []) as Testimonial[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Testimonials"
        description="Client quotes shown across the site."
        newHref="/admin/testimonials/new"
        newLabel="New testimonial"
      />
      <ContentList
        items={mapTestimonials(rows)}
        filters={[STATUS_FILTER]}
        projectColumnLabel="Person"
        detailColumnLabel="Quote"
        showSegmentColumn={false}
        emptyTitle="No testimonials yet"
      />
    </div>
  );
}
