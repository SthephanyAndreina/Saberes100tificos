"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { colors as c, fonts } from "@/lib/theme";

const heroBg = "/jardines.jpg";
const chatUsbLogo = "/arbboard05_chatUSB.png";

const cards = [
  { title: "Orientación académica", text: "Dudas sobre ingreso a la universidad, vida estudiantil, carreras y decisiones académicas explicadas con lenguaje claro.", accent: c.cian, icon: "🎓", num: "01" },
  { title: "Investigar mejor", text: "Apoyo para formular preguntas, buscar fuentes confiables y desarrollar ideas propias sin depender ciegamente de la IA.", accent: c.naranja, icon: "🔬", num: "02" },
  { title: "Acompañamiento continuo", text: "Las dudas más importantes suelen aparecer después de las charlas. chatUSB mantiene el contacto cuando realmente se necesita.", accent: c.fuccia, icon: "🤝", num: "03" },
];

const explora = [
  { title: "Divulgación", text: "Artículos de ciencia para despertar la curiosidad.", href: "/divulgacion", color: c.cian, icon: "🔬" },
  { title: "Orientación vocacional", text: "Mecanismos de ingreso a la USB y elección de carrera.", href: "/orientacion-vocacional/articulos", color: c.magenta, icon: "🧭" },
  { title: "Recursos", text: "Guías de estudio y videos.", href: "/recursos", color: c.naranja, icon: "📚" },
  { title: "Blog completo", text: "Todo el contenido en orden cronológico.", href: "/blog", color: c.fuccia, icon: "📝" },
];

export default function InicioContent({ hero, settings, latestPosts = [] }) {
  const [loaded, setLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stagger = (i) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${120 + i * 110}ms`,
  });

  const telegram = settings?.telegram_community || "#";

  return (
    <div style={{ fontFamily: fonts.sans, color: c.negro, overflow: "hidden" }}>
      {/* HERO */}
      <header
        className="grain"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(135deg, rgba(6,14,18,0.80) 0%, rgba(8,26,30,0.64) 35%, rgba(8,24,30,0.60) 100%), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 48, alignItems: "center", padding: "64px 0 56px" }} className="sc-hero-grid">
            <div>
              <div style={stagger(0)}>
                <span style={badgeStyle}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.verdeLima, display: "inline-block" }} />
                  {hero?.badge}
                </span>
              </div>
              <h1 style={{ marginTop: 22, fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", letterSpacing: "-0.02em", ...stagger(1) }}>
                {hero?.title}
              </h1>
              <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", maxWidth: 540, ...stagger(2) }}>
                {hero?.subtitle}
              </p>
              <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 14, ...stagger(3) }}>
                <a href={telegram} target="_blank" rel="noopener noreferrer" style={primaryBtn}>
                  Entrar al grupo de Telegram →
                </a>
                <Link href="/blog" style={ghostBtn}>Ver contenidos</Link>
              </div>
            </div>

            <div style={{ position: "relative", ...stagger(4) }}>
              <div style={heroCard}>
                <div style={{ textAlign: "center" }}>
                  <img src={chatUsbLogo} alt="ChatUSB" style={{ width: 120, height: 120, margin: "0 auto", objectFit: "contain", display: "block" }} />
                  <p style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Canal de orientación en Telegram</p>
                </div>
                <div style={{ marginTop: 22, borderRadius: 20, background: "#fff", padding: 22, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.cian }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: c.cian, fontFamily: fonts.mono }}>Comunidad</p>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444" }}>
                    Un canal complementario para atender preguntas cuando realmente surgen: después de las charlas, durante una tarea o al pensar en el futuro universitario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 0", background: "rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", animation: "marquee 25s linear infinite", whiteSpace: "nowrap" }}>
            {Array(2).fill("MICROSCOPÍA ✦ DIFRACCIÓN DE RAYOS X ✦ ORIENTACIÓN VOCACIONAL ✦ DIVULGACIÓN CIENTÍFICA ✦ CIENCIAS NATURALES ✦ INVESTIGACIÓN ESCOLAR ✦ USB ✦ ").map((t, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", fontFamily: fonts.mono, paddingRight: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      </header>

      {/* QUÉ HACEMOS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 28px" }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <p style={kicker(c.magenta)}>Qué hacemos</p>
          <h2 style={h2Style}>
            La ciencia necesita espacios{" "}
            <span style={{ background: `linear-gradient(135deg, ${c.cian}, ${c.magenta})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>cercanos y continuos</span>.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {cards.map((card, i) => (
            <article
              key={card.title}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: "relative", borderRadius: 24, background: hoveredCard === i ? c.negro : "#fff",
                color: hoveredCard === i ? "#fff" : c.negro, border: `1.5px solid ${hoveredCard === i ? c.negro : "#e8e8e8"}`,
                padding: "34px 26px", transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                transform: hoveredCard === i ? "translateY(-6px)" : "none",
                boxShadow: hoveredCard === i ? `0 20px 60px ${card.accent}33` : "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: card.accent, opacity: hoveredCard === i ? 0.15 : 0.06, transition: "opacity 0.4s" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 34 }}>{card.icon}</span>
                  <span style={{ fontSize: 40, fontWeight: 900, fontFamily: fonts.mono, color: hoveredCard === i ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>{card.num}</span>
                </div>
                <div style={{ width: 40, height: 4, borderRadius: 4, background: card.accent, marginBottom: 16 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{card.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: hoveredCard === i ? "rgba(255,255,255,0.7)" : "#666" }}>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EXPLORA SECCIONES */}
      <section style={{ background: c.cream, borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 28px" }}>
          <p style={kicker(c.cian)}>Explora</p>
          <h2 style={{ ...h2Style, marginBottom: 36 }}>Navega por nuestras secciones</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {explora.map((e) => (
              <Link key={e.title} href={e.href} style={exploreCard(e.color)}
                onMouseEnter={(ev) => { ev.currentTarget.style.transform = "translateY(-5px)"; ev.currentTarget.style.boxShadow = `0 18px 44px ${e.color}26`; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.transform = "none"; ev.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
                <span style={{ fontSize: 30 }}>{e.icon}</span>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginTop: 12 }}>{e.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#666", marginTop: 6 }}>{e.text}</p>
                <span style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: e.color }}>Ver más →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ÚLTIMOS ARTÍCULOS */}
      {latestPosts.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <p style={kicker(c.naranja)}>Lo más reciente</p>
              <h2 style={h2Style}>Últimos artículos del blog</h2>
            </div>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: c.fuccia, borderBottom: `2px solid ${c.fuccia}`, paddingBottom: 2 }}>Ver todo el blog ↗</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {latestPosts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ borderRadius: 20, overflow: "hidden", border: "1.5px solid #e8e8e8", background: "#fff", display: "block" }}>
                {p.cover_url ? (
                  <div style={{ height: 150, backgroundImage: `url(${p.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : (
                  <div style={{ height: 6, background: p.category?.color || c.cian }} />
                )}
                <div style={{ padding: "20px 22px" }}>
                  {p.category && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: p.category.color || c.cian, borderRadius: 50, padding: "4px 12px" }}>{p.category.name}</span>}
                  <h3 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3, margin: "12px 0 8px" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#666" }}>{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 860px) {
          .sc-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const badgeStyle = { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 50, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", padding: "8px 18px", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" };
const primaryBtn = { borderRadius: 16, padding: "14px 26px", fontSize: 14, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${c.fuccia}, ${c.magenta})`, boxShadow: `0 6px 28px ${c.fuccia}55` };
const ghostBtn = { borderRadius: 16, padding: "14px 26px", fontSize: 14, fontWeight: 700, color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)" };
const heroCard = { position: "relative", borderRadius: 28, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.01)", backdropFilter: "blur(2px)", padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" };
const kicker = (color) => ({ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color, fontFamily: fonts.mono });
const h2Style = { marginTop: 12, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.02em" };
const exploreCard = (color) => ({ display: "block", borderRadius: 20, background: "#fff", border: "1.5px solid #e8e8e8", padding: "26px 22px", transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" });
