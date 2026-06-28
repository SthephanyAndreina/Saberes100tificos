import Link from "next/link";
import SectionHero from "@/components/ui/SectionHero";
import SearchablePostList from "@/components/blog/SearchablePostList";
import { getContent, getPosts, getSettings } from "@/lib/queries";
import { colors as c } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Orientación vocacional · Saberes Científicos" };

export default async function OrientacionArticulosPage() {
  const [content, posts, settings] = await Promise.all([
    getContent("orientacion"),
    getPosts({ categorySlug: "mecanismo-ingreso-usb" }),
    getSettings(),
  ]);

  return (
    <>
      <SectionHero kicker="#Mecanismo de ingreso a la USB" title={content.title} intro={content.intro} accent={c.magenta} />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 0" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            borderRadius: 20,
            padding: "24px 26px",
            background: `linear-gradient(135deg, ${c.magenta}10, ${c.fuccia}10)`,
            border: `1.5px solid ${c.magenta}22`,
          }}
        >
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: c.negro }}>¿Dudas sobre la carrera a elegir?</p>
            <p style={{ fontSize: 14, color: "#555", marginTop: 4, maxWidth: 520 }}>{content.test}</p>
          </div>
          <a
            href={settings.telegram_bot || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderRadius: 14, padding: "13px 22px", fontSize: 13.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${c.fuccia}, ${c.magenta})`, whiteSpace: "nowrap" }}
          >
            Hacer el test con chatUSB →
          </a>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/orientacion-vocacional/carreras" style={{ fontSize: 13.5, fontWeight: 700, color: c.cian }}>
            Ver lista de carreras y pensum →
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 28px 72px" }}>
        <SearchablePostList
          posts={posts}
          placeholder="Buscar en artículos de ingreso a la USB…"
          emptyText="Aún no hay artículos en esta sección. Crea uno desde el panel /admin."
        />
      </section>
    </>
  );
}
