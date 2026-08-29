import Link from "next/link";
import SectionHero from "@/components/ui/SectionHero";
import RichContent from "@/components/ui/RichContent";
import { getContent } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sobre la USB · Saberes Científicos" };

export default async function UsbPage() {
  const content = await getContent("usb");
  const bloques = [
    { label: "Nuestra Casa de Estudios", text: content.resena, icon: "🏛️" },
    { label: "Conexión con Saberes Científicos", text: content.ubicacion, icon: "🔗" },
    { label: "Vida Universitaria y Oportunidades", text: content.historia, icon: "🎓" },
  ];
  return (
    <>
      <SectionHero kicker="Universidad Simón Bolívar" title={content.title} accent={c.cian} />
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "56px 28px 72px", fontFamily: fonts.sans }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bloques.map((b) => (
            <div key={b.label} style={{ display: "flex", gap: 18, alignItems: "flex-start", borderRadius: 18, border: "1.5px solid #ececec", background: "#fff", padding: "24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{b.icon}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{b.label}</h3>
                <RichContent html={b.text} />
              </div>
            </div>
          ))}
        </div>

        {/* Accesos rápidos */}
        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
          <Link
            href="/orientacion-vocacional/carreras"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 14, padding: "14px 26px", fontSize: 14.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${c.magenta}, ${c.fuccia})`, boxShadow: `0 6px 24px ${c.magenta}44` }}
          >
            🎓 Carreras y Pensum de la USB →
          </Link>
        </div>
      </section>
    </>
  );
}
