import { AdminPageHeader, AdminPageStack } from "@/components/admin/shared/admin-page-stack";
import { PageSectionsEditor } from "@/components/admin/page-sections/page-sections-editor";
import { loadPageSectionsForAdmin } from "@/app/(admin)/admin/(protected)/page-sections/actions";

export const metadata = { title: "Page sections" };
export const dynamic = "force-dynamic";

export default async function PageSectionsAdminPage() {
  const { store, persistState } = await loadPageSectionsForAdmin();

  return (
    <AdminPageStack>
      <AdminPageHeader
        title="Page sections"
        description="Show or hide blocks and edit section copy. Fields are pre-filled from the live site (including former static copy) so you can edit safely."
      />
      <PageSectionsEditor initialStore={store} persistState={persistState} />
    </AdminPageStack>
  );
}
