import SectionHero from "@/components/ui/SectionHero";
import Gallery from "@/components/gallery/Gallery";
import RichContent from "@/components/ui/RichContent";
import { getContent, getGallery, getSettings } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "¿Quiénes somos? · Saberes Científicos" };

export default async function QuienesSomosPage() {
  const [content, { images }, settings] = await Promise.all([
    getContent("quienes_somos"),
    getGallery("quienes-somos"),
    getSettings(),
  ]);

  const bloques = [
    { label: "Misión", text: content.mision, color: c.cian },
    { label: "Nuestra Visión", text: content.objetivo, color: c.magenta },
    { label: "¿Qué hacemos?", text: content.adscripcion, color: c.naranja, rich: true },
  ];

  return (
    <>
      <SectionHero kicker="Servicio Comunitario" title={content.title} intro={content.intro} accent={c.cian} />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 28px", fontFamily: fonts.sans }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {bloques.map((b) => (
            <div key={b.label} style={{ borderRadius: 20, border: "1.5px solid #ececec", background: "#fff", padding: "26px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 40, height: 4, borderRadius: 4, background: b.color, marginBottom: 14 }} />
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{b.label}</h3>
              {b.rich ? (
                <RichContent html={b.text} style={{ fontSize: 14.5 }} />
              ) : (
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#555" }}>{b.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Servicio Comunitario */}
        <div
          style={{
            marginTop: 36,
            borderRadius: 22,
            padding: "30px 28px",
            background: `linear-gradient(135deg, ${c.negro}, #10242a)`,
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>¿Eres estudiante de la USB?</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", marginTop: 8 }}>
              ¿Quieres tomar Saberes Científicos como tu proyecto de Servicio Comunitario?
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", marginTop: 10 }}>
              ⏰ <strong>Duración:</strong> 120 horas reglamentarias.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", marginTop: 4 }}>
              🎯 <strong>Dirigido a:</strong> Estudiantes de cualquier carrera apasionados por la divulgación científica.
            </p>
          </div>
          <a
            href={settings.google_form || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderRadius: 14, padding: "14px 24px", fontSize: 14, fontWeight: 700, color: c.negro, background: c.verdeLima, whiteSpace: "nowrap" }}
          >
            Quiero participar →
          </a>
        </div>

        {/* Galería */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 18 }}>Galería de fotos</h2>
          <Gallery images={images} emptyText="Pronto compartiremos fotos de nuestro equipo y actividades." />
        </div>
      </section>
    </>
  );
}
