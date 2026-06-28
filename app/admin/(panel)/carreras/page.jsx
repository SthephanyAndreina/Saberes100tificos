import { createClient } from "@/lib/supabase/server";
import CarrerasManager from "@/components/admin/CarrerasManager";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminCarrerasPage() {
  const supabase = createClient();
  const { data: carreras } = await supabase
    .from("carreras")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageTitle title="Carreras de la USB" subtitle="Lista de carreras y su pensum en PDF para la sección de Orientación vocacional." />
      <CarrerasManager carreras={carreras || []} />
    </div>
  );
}
