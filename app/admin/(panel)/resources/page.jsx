import { createClient } from "@/lib/supabase/server";
import ResourcesManager from "@/components/admin/ResourcesManager";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const supabase = createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageTitle title="Recursos" subtitle="Guías de estudio en PDF y enlaces a videos para la sección Recursos." />
      <ResourcesManager resources={resources || []} />
    </div>
  );
}
