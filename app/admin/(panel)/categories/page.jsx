import { createClient } from "@/lib/supabase/server";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageTitle title="Categorías (#)" subtitle="Las categorías agrupan los artículos. Define en qué sección aparece cada una." />
      <CategoriesManager categories={categories || []} />
    </div>
  );
}
