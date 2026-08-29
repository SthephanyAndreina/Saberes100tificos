"use client";

import { useMemo, useState } from "react";
import { colors as c, fonts } from "@/lib/theme";

// Detecta la extensión del archivo (PDF, DOCX…) a partir de la URL para
// mostrar una etiqueta clara en cada guía.
function fileKind(url = "") {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".pdf")) return "PDF";
  if (clean.endsWith(".docx") || clean.endsWith(".doc")) return "DOCX";
  return null;
}

export default function ResourcesBrowser({ resources = [], categories = [] }) {
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState(null); // slug de la categoría activa

  const catBySlug = useMemo(() => {
    const m = {};
    categories.forEach((cat) => { m[cat.slug] = cat; });
    return m;
  }, [categories]);

  const catById = useMemo(() => {
    const m = {};
    categories.forEach((cat) => { m[cat.id] = cat; });
    return m;
  }, [categories]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return resources.filter((r) => {
      if (activeCat && (catById[r.category_id]?.slug !== activeCat)) return false;
      if (!term) return true;
      const cat = catById[r.category_id];
      const haystack = [r.title, r.description, cat?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [q, activeCat, resources, catById]);

  const guias = filtered.filter((r) => r.type === "guide_pdf");
  const videos = filtered.filter((r) => r.type === "video_link");
  const activeCatObj = activeCat ? catBySlug[activeCat] : null;

  return (
    <div style={{ fontFamily: fonts.sans }}>
      {/* Buscador */}
      <div style={{ position: "relative", maxWidth: 520, margin: "0 auto 22px" }}>
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar recursos de ejem: Trigonometría..."
          style={{
            width: "100%",
            padding: "14px 18px 14px 46px",
            borderRadius: 14,
            border: "1.5px solid #e2e2e2",
            fontSize: 15,
            fontFamily: fonts.sans,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = c.naranja; e.currentTarget.style.boxShadow = `0 0 0 3px ${c.naranja}22`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e2e2"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* Filtro por categorías principales */}
      {categories.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 30 }}>
          <Chip
            label="Todo el contenido"
            color={c.negro}
            active={activeCat === null}
            onClick={() => setActiveCat(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={cat.color || c.cian}
              active={activeCat === cat.slug}
              onClick={() => setActiveCat(activeCat === cat.slug ? null : cat.slug)}
            />
          ))}
        </div>
      )}

      {(q || activeCatObj) && (
        <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginBottom: 24 }}>
          {filtered.length} recurso{filtered.length === 1 ? "" : "s"}
          {activeCatObj ? ` en ${activeCatObj.name}` : ""}
          {q ? ` para “${q}”` : ""}
        </p>
      )}

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "48px 0", fontSize: 15 }}>
          {q || activeCatObj
            ? "No se encontraron recursos con esa búsqueda."
            : "Pronto subiremos guías de estudio y videos."}
        </p>
      ) : (
        <>
          <Grupo titulo="📚 Guías de estudio" items={guias} cta="Abrir guía ↗" color={c.cian} catById={catById} showKind vacio="Sin guías para esta búsqueda." />
          {guias.length > 0 && videos.length > 0 && <div style={{ height: 40 }} />}
          <Grupo titulo="▶️ Videos" items={videos} cta="Ver video ↗" color={c.fuccia} catById={catById} vacio="Sin videos para esta búsqueda." />
        </>
      )}
    </div>
  );
}

function Chip({ label, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 16px",
        borderRadius: 50,
        border: `1.5px solid ${active ? color : "#e2e2e2"}`,
        background: active ? color : "#fff",
        color: active ? "#fff" : "#444",
        fontSize: 13.5,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: fonts.sans,
        transition: "all 0.2s",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "rgba(255,255,255,0.85)" : color }} />
      {label}
    </button>
  );
}

function Grupo({ titulo, items, cta, color, catById, showKind, vacio }) {
  if (items.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 14 }}>{titulo}</h2>
        <p style={{ color: "#999", fontSize: 14.5, padding: "6px 0" }}>{vacio}</p>
      </div>
    );
  }
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 18 }}>{titulo}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {items.map((r) => {
          const cat = catById[r.category_id];
          const kind = showKind ? fileKind(r.url) : null;
          return (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", flexDirection: "column", borderRadius: 18, border: "1.5px solid #ececec", background: "#fff", padding: "22px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {cat && (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", background: cat.color || color, borderRadius: 50, padding: "3px 11px" }}>
                    {cat.name}
                  </span>
                )}
                {kind && (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#666", background: "#f0f0f0", borderRadius: 50, padding: "3px 11px" }}>
                    {kind}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{r.title}</h3>
              {r.description && <p style={{ fontSize: 14, lineHeight: 1.65, color: "#666" }}>{r.description}</p>}
              <span style={{ display: "inline-block", marginTop: "auto", paddingTop: 14, fontSize: 13, fontWeight: 700, color }}>{cta}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
