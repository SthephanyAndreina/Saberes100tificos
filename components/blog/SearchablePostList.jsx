"use client";

import { useMemo, useState } from "react";
import PostCard from "./PostCard";
import { colors as c, fonts } from "@/lib/theme";

export default function SearchablePostList({ posts = [], placeholder = "Buscar artículos por palabra…", emptyText = "Aún no hay artículos en esta sección." }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.excerpt,
        p.category?.name,
        (p.tags || []).join(" "),
        // Texto plano del contenido para buscar también dentro del artículo.
        (p.content_html || "").replace(/<[^>]+>/g, " "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [q, posts]);

  return (
    <div style={{ fontFamily: fonts.sans }}>
      <div style={{ position: "relative", maxWidth: 520, margin: "0 auto 36px" }}>
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
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
          onFocus={(e) => { e.currentTarget.style.borderColor = c.cian; e.currentTarget.style.boxShadow = `0 0 0 3px ${c.cian}22`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e2e2"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {q && (
        <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginBottom: 24 }}>
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"} para “{q}”
        </p>
      )}

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "48px 0", fontSize: 15 }}>
          {q ? "No se encontraron artículos con esa búsqueda." : emptyText}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 22 }}>
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
