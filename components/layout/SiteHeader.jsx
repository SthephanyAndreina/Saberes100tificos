"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { colors as c, fonts } from "@/lib/theme";

export default function SiteHeader({ settings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const [mobileSub, setMobileSub] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menús al navegar.
  useEffect(() => {
    setMobileOpen(false);
    setOpenDrop(null);
    setMobileSub(null);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Apertura/cierre de los desplegables de escritorio con un pequeño retraso al
  // cerrar, para que el cursor pueda viajar del botón al submenú sin que se cierre.
  const closeTimer = useRef(null);
  const openMenu = (label) => {
    clearTimeout(closeTimer.current);
    setOpenDrop(label);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDrop(null), 180);
  };

  // Cierra el menú móvil al instante al tocar un enlace (feedback inmediato,
  // aunque la página tarde en cargar la primera vez en modo desarrollo).
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSub(null);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(8,16,20,0.92)" : "rgba(8,16,20,0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        fontFamily: fonts.sans,
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Marca */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <img
            src="/artboard01_hardbackground.png"
            alt="Saberes Científicos"
            style={{ width: 46, height: 46, objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Saberes
            <br />
            Científicos
          </span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="sc-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV.map((item) => {
            const active = item.href
              ? isActive(item.href)
              : item.children?.some((ch) => isActive(ch.href));
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={navLinkStyle(active)}
                  onMouseEnter={(e) => hoverOn(e, active)}
                  onMouseLeave={(e) => hoverOff(e, active)}
                >
                  {item.label}
                </Link>
              );
            }
            const open = openDrop === item.label;
            return (
              <div
                key={item.label}
                style={{ position: "relative" }}
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenDrop(open ? null : item.label)}
                  style={{ ...navLinkStyle(active), background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  {item.label}
                  <span style={{ fontSize: 9, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                </button>
                {open && (
                  // Envoltorio con paddingTop: actúa de "puente" invisible para que el
                  // cursor pase del botón al submenú sin cruzar un hueco vacío.
                  <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 60 }}>
                    <div
                      style={{
                        minWidth: 250,
                        padding: 8,
                        borderRadius: 14,
                        background: "#fff",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {item.children.map((ch) => (
                        <Link
                          key={ch.href}
                          href={ch.href}
                          onClick={() => setOpenDrop(null)}
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: isActive(ch.href) ? c.cian : "#222",
                            background: isActive(ch.href) ? `${c.cian}12` : "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = `${c.cian}12`)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = isActive(ch.href) ? `${c.cian}12` : "transparent")}
                        >
                          {ch.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Hamburguesa (solo móvil) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            aria-label="Menú"
            className="sc-burger"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              color: "#fff",
              width: 42,
              height: 40,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div
          className="sc-mobile-nav"
          style={{
            padding: "8px 16px 18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          {NAV.map((item) => {
            if (!item.children) {
              return (
                <Link key={item.label} href={item.href} onClick={closeMobile} style={mobileLink(isActive(item.href))}>
                  {item.label}
                </Link>
              );
            }
            const expanded = mobileSub === item.label;
            const parentActive = item.children.some((ch) => isActive(ch.href));
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setMobileSub(expanded ? null : item.label)}
                  style={{ ...mobileLink(parentActive), display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: parentActive ? "rgba(255,255,255,0.06)" : "transparent", border: "none", cursor: "pointer", fontFamily: fonts.sans }}
                >
                  {item.label}
                  <span style={{ fontSize: 11, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {expanded &&
                  item.children.map((ch) => (
                    <Link key={ch.href} href={ch.href} onClick={closeMobile} style={mobileLink(isActive(ch.href), true)}>
                      {ch.label}
                    </Link>
                  ))}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .sc-desktop-nav { display: none !important; }
          .sc-burger { display: inline-flex !important; }
        }
        @media (min-width: 1101px) {
          .sc-mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function navLinkStyle(active) {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: active ? "#fff" : "rgba(255,255,255,0.72)",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    whiteSpace: "nowrap",
    transition: "color 0.2s, background 0.2s",
  };
}
function hoverOn(e, active) {
  if (!active) e.currentTarget.style.color = "#fff";
  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
}
function hoverOff(e, active) {
  if (!active) {
    e.currentTarget.style.color = "rgba(255,255,255,0.72)";
    e.currentTarget.style.background = "transparent";
  }
}
function mobileLink(active, sub = false) {
  return {
    display: "block",
    padding: sub ? "9px 12px 9px 24px" : "11px 12px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: active ? c.verdeLima : "rgba(255,255,255,0.85)",
    background: active ? "rgba(255,255,255,0.06)" : "transparent",
  };
}
