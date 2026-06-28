import { createClient } from "@/lib/supabase/server";
import GalleriesManager from "@/components/admin/GalleriesManager";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminGalleriesPage() {
  const supabase = createClient();
  const { data: galleries } = await supabase
    .from("galleries")
    .select("*, images:gallery_images(*)")
    .order("created_at", { ascending: true });

  // Ordenar imágenes por sort_order dentro de cada galería.
  (galleries || []).forEach((g) => {
    g.images = (g.images || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  });

  return (
    <div>
      <PageTitle title="Galerías de fotos" subtitle="Sube y organiza las fotos de cada sección. Se actualizan en la web al instante." />
      <GalleriesManager galleries={galleries || []} />
    </div>
  );
}
