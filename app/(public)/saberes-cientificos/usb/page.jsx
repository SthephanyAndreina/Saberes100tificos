import SectionHero from "@/components/ui/SectionHero";
import { getContent } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reseña de la USB · Saberes Científicos" };

export default async function UsbPage() {
  const content = await getContent("usb");
  const bloques = [
    { label: "Reseña", text: content.resena, icon: "🏛️" },
    { label: "Ubicación", text: content.ubicacion, icon: "📍" },
    { label: "Historia", text: content.historia, icon: "📜" },
  ];
  return (
    <>
      <SectionHero kicker="Universidad Simón Bolívar" title={content.title} accent={c.cian} />
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "56px 28px 72px", fontFamily: fonts.sans }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bloques.map((b) => (
            <div key={b.label} style={{ display: "flex", gap: 18, alignItems: "flex-start", borderRadius: 18, border: "1.5px solid #ececec", background: "#fff", padding: "24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{b.label}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#555" }}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <img src="/USB_logo.png" alt="Logo USB" style={{ width: 120, opacity: 0.85 }} />
        </div>
      </section>
    </>
  );
}
