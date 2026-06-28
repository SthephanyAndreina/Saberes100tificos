import SectionHero from "@/components/ui/SectionHero";
import { getContent, getResources } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Recursos · Saberes Científicos" };

export default async function RecursosPage() {
  const [content, resources] = await Promise.all([getContent("recursos"), getResources()]);
  const guias = resources.filter((r) => r.type === "guide_pdf");
  const videos = resources.filter((r) => r.type === "video_link");

  return (
    <>
      <SectionHero kicker="Material de apoyo" title={content.title} intro={content.intro} accent={c.naranja} />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 28px 72px", fontFamily: fonts.sans }}>
        <Grupo titulo="📚 Guías de estudio" items={guias} cta="Abrir PDF ↗" color={c.cian} vacio="Pronto subiremos guías de estudio." />
        <div style={{ height: 40 }} />
        <Grupo titulo="▶️ Videos" items={videos} cta="Ver video ↗" color={c.fuccia} vacio="Pronto compartiremos enlaces a videos." />
      </section>
    </>
  );
}

function Grupo({ titulo, items, cta, color, vacio }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 18 }}>{titulo}</h2>
      {items.length === 0 ? (
        <p style={{ color: "#999", fontSize: 15, padding: "12px 0" }}>{vacio}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {items.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", borderRadius: 18, border: "1.5px solid #ececec", background: "#fff", padding: "22px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{r.title}</h3>
              {r.description && <p style={{ fontSize: 14, lineHeight: 1.65, color: "#666" }}>{r.description}</p>}
              <span style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 700, color }}>{cta}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
