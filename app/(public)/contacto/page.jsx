import SectionHero from "@/components/ui/SectionHero";
import { getContent, getSettings } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contáctanos · Saberes Científicos" };

export default async function ContactoPage() {
  const [content, settings] = await Promise.all([getContent("contacto"), getSettings()]);

  const canales = [
    settings.instagram && { label: "Instagram", desc: "Síguenos y entérate de todo.", href: settings.instagram, icon: "📸", color: c.fuccia, cta: "Abrir Instagram" },
    settings.telegram_community && { label: "Comunidad chatUSB", desc: "Te acompañamos en cada paso del camino a la universidad.", href: settings.telegram_community, icon: "💬", color: c.cian, cta: "Unirme al grupo" },
    settings.youtube && { label: "YouTube", desc: "Videos de divulgación y orientación.", href: settings.youtube, icon: "▶️", color: c.naranja, cta: "Ver canal" },
    settings.email && { label: "Correo", desc: settings.email, href: `mailto:${settings.email}`, icon: "✉️", color: c.magenta, cta: "Enviar correo" },
  ].filter(Boolean);

  return (
    <>
      <SectionHero kicker="Sé parte de la comunidad" title={content.title} intro={content.intro} accent={c.fuccia} />
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 28px 72px", fontFamily: fonts.sans }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {canales.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", borderRadius: 20, border: "1.5px solid #ececec", background: "#fff", padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <span style={{ fontSize: 34 }}>{ch.icon}</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 12 }}>{ch.label}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "#666", marginTop: 6 }}>{ch.desc}</p>
              <span style={{ display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 700, color: ch.color }}>{ch.cta} →</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
