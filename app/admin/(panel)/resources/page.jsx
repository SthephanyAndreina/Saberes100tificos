import { createClient } from "@/lib/supabase/server";
import ResourcesManager from "@/components/admin/ResourcesManager";
import ResourceCategoriesManager from "@/components/admin/ResourceCategoriesManager";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const supabase = createClient();
  const [{ data: resources }, { data: categories }] = await Promise.all([
    supabase.from("resources").select("*").order("sort_order", { ascending: true }),
    supabase.from("resource_categories").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <PageTitle title="Recursos" subtitle="Guías de estudio en PDF o DOCX y enlaces a videos para la sección Recursos." />
        <ResourceCategoriesManager categories={categories || []} />
      </div>
      <ResourcesManager resources={resources || []} categories={categories || []} />
    </div>
  );
}
