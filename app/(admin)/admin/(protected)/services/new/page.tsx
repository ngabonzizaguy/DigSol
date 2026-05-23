import { ServiceEditor } from "@/components/admin/editors/service-editor";

export const metadata = { title: "New service" };

export default function NewServicePage() {
  return <ServiceEditor mode="create" />;
}
