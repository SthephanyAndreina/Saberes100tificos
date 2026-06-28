import { colors as c, fonts } from "@/lib/theme";

// Banda de encabezado para páginas internas (componente presentacional).
export default function SectionHero({ kicker, title, intro, accent = c.cian }) {
  return (
    <section
      className="grain"
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${c.negro} 0%, #10242a 100%)`,
        color: "#fff",
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -90,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: accent,
          opacity: 0.16,
          filter: "blur(80px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "56px 28px" }}>
        {kicker && (
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, fontFamily: fonts.mono }}>
            {kicker}
          </p>
        )}
        <h1 style={{ marginTop: 10, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {intro && (
          <p style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", maxWidth: 680 }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
