"use client";

import Link from "next/link";
import { NAV } from "@/lib/nav";
import { colors as c, fonts } from "@/lib/theme";

export default function SiteFooter({ settings }) {
  const s = settings || {};
  const contactos = [
    s.instagram && { label: "Instagram", href: s.instagram, icon: "📸" },
    s.youtube && { label: "YouTube", href: s.youtube, icon: "▶️" },
    s.telegram_community && { label: "Comunidad chatUSB", href: s.telegram_community, icon: "💬" },
    s.email && { label: "Correo", href: `mailto:${s.email}`, icon: "✉️" },
  ].filter(Boolean);

  return (
    <footer
      className="grain"
      style={{
        position: "relative",
        overflow: "hidden",
        background: c.negro,
        color: "#fff",
        fontFamily: fonts.sans,
        marginTop: 40,
      }}
    >
      <div style={glow(c.cian, "20%", -80, 300)} />
      <div style={glow(c.fuccia, undefined, -60, 200, "10%")} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 28px 28px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: 32,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/artboard01_hardbackground.png" alt="Saberes Científicos" style={{ width: 64, height: 64, objectFit: "contain" }} />
            <div>
              <p style={{ fontWeight: 800, fontSize: 16 }}>Saberes Científicos</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Divulgación · Orientación · Comunidad
              </p>
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginTop: 16, maxWidth: 360 }}>
            Servicio Comunitario adscrito a la Universidad Simón Bolívar. Te acompañamos en cada paso del camino hacia la universidad.
          </p>
        </div>

        <div>
          <p style={footerTitle}>Secciones</p>
          {NAV.map((item) => {
            const href = item.href || item.children?.[0]?.href || "#";
            return (
              <Link key={item.label} href={href} style={footerLink}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div>
          <p style={footerTitle}>Contáctanos</p>
          {contactos.map((ct) => (
            <a key={ct.label} href={ct.href} target="_blank" rel="noopener noreferrer" style={footerLink}>
              {ct.icon} {ct.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: fonts.mono }}>
          © {new Date().getFullYear()} Saberes Científicos · Universidad Simón Bolívar · Servicio Comunitario ED-2301
        </p>
      </div>
    </footer>
  );
}

const footerTitle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: 14,
};
const footerLink = {
  display: "block",
  fontSize: 13.5,
  color: "rgba(255,255,255,0.65)",
  padding: "5px 0",
};
function glow(color, left, bottom, size, right) {
  return {
    position: "absolute",
    bottom,
    left,
    right,
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    opacity: 0.06,
    filter: "blur(80px)",
  };
}
