import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageTitle } from "@/components/admin/ui";
import { colors as c, admin } from "@/lib/theme";

export const dynamic = "force-dynamic";

async function count(supabase, table, filter) {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = filter(q);
    const { count } = await q;
    return count || 0;
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const [posts, drafts, cats, images, carreras] = await Promise.all([
    count(supabase, "posts", (q) => q.eq("status", "published")),
    count(supabase, "posts", (q) => q.eq("status", "draft")),
    count(supabase, "categories"),
    count(supabase, "gallery_images"),
    count(supabase, "carreras"),
  ]);

  const stats = [
    { label: "Artículos publicados", value: posts, color: c.cian },
    { label: "Borradores", value: drafts, color: c.naranja },
    { label: "Categorías", value: cats, color: c.magenta },
    { label: "Fotos en galerías", value: images, color: c.fuccia },
  ];

  const acciones = [
    { href: "/admin/posts/new", title: "Escribir un artículo", desc: "Crea un nuevo post con el editor visual.", icon: "✍️" },
    { href: "/admin/galleries", title: "Subir fotos", desc: "Añade imágenes a las galerías.", icon: "🖼️" },
    { href: "/admin/content", title: "Editar textos", desc: "Cambia textos y enlaces del sitio.", icon: "✏️" },
    { href: "/admin/carreras", title: "Gestionar carreras", desc: "Carreras y sus pensum en PDF.", icon: "🎓" },
  ];

  return (
    <div>
      <PageTitle title="Bienvenid@ 👋" subtitle="Gestiona todo el contenido de Saberes Científicos en un solo sitio" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ width: 34, height: 4, borderRadius: 4, background: s.color, marginBottom: 12 }} />
            <p style={{ fontSize: 30, fontWeight: 900, color: admin.text }}>{s.value}</p>
            <p style={{ fontSize: 13, color: admin.muted, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 800, color: admin.text, marginBottom: 14 }}>Acciones rápidas</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {acciones.map((a) => (
          <Link key={a.href} href={a.href} style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: "20px 22px", display: "block" }}>
            <span style={{ fontSize: 26 }}>{a.icon}</span>
            <p style={{ fontSize: 15.5, fontWeight: 800, color: admin.text, marginTop: 10 }}>{a.title}</p>
            <p style={{ fontSize: 13, color: admin.muted, marginTop: 4, lineHeight: 1.5 }}>{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
