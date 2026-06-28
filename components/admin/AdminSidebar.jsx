"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { colors as c, fonts } from "@/lib/theme";
import { admin } from "./ui";

const LINKS = [
  { href: "/admin", label: "Panel", icon: "🏠", exact: true },
  { href: "/admin/posts", label: "Artículos", icon: "📝" },
  { href: "/admin/categories", label: "Categorías (#)", icon: "🏷️" },
  { href: "/admin/galleries", label: "Galerías de fotos", icon: "🖼️" },
  { href: "/admin/resources", label: "Recursos", icon: "📚" },
  { href: "/admin/carreras", label: "Carreras", icon: "🎓" },
  { href: "/admin/content", label: "Textos y enlaces", icon: "✏️" },
];

export default function AdminSidebar({ email }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href));

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Barra superior móvil */}
      <div className="sc-admin-topbar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: c.negro, color: "#fff", position: "sticky", top: 0, zIndex: 30 }}>
        <span style={{ fontWeight: 800, fontFamily: fonts.sans }}>Saberes · Admin</span>
        <button type="button" onClick={() => setOpen((v) => !v)} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", borderRadius: 8, width: 40, height: 36, fontSize: 18 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`sc-admin-aside ${open ? "open" : ""}`}
        style={{
          width: 248,
          flexShrink: 0,
          background: c.negro,
          color: "#fff",
          minHeight: "100vh",
          padding: "22px 16px",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          fontFamily: fonts.sans,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 18px" }}>
          <img src="/artboard01_hardbackground.png" alt="" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 14 }}>Administración</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Saberes Científicos</p>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map((l) => {
            const active = isActive(l);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: active ? "#fff" : "rgba(255,255,255,0.7)",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                <span>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/" target="_blank" style={{ display: "block", padding: "9px 12px", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
            ↗ Ver el sitio
          </Link>
          <button
            type="button"
            onClick={logout}
            style={{ width: "100%", textAlign: "left", padding: "9px 12px", fontSize: 13, color: "#ff9aa8", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: fonts.sans }}
          >
            ⎋ Cerrar sesión
          </button>
          {email && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", padding: "8px 12px 0", wordBreak: "break-all" }}>{email}</p>}
        </div>
      </aside>

      <style>{`
        @media (max-width: 820px) {
          .sc-admin-topbar { display: flex !important; }
          .sc-admin-aside {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            z-index: 40;
            min-height: 100vh;
          }
          .sc-admin-aside.open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
