"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { admin, Banner } from "./ui";
import { fonts } from "@/lib/theme";

export default function PostsTable({ posts = [] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function remove(post) {
    if (!window.confirm(`¿Eliminar el artículo "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setErr("");
    setDeletingId(post.id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      router.refresh();
    } catch (ex) {
      setErr(ex?.message || "No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: "44px 24px", textAlign: "center", fontFamily: fonts.sans }}>
        <p style={{ fontSize: 30, marginBottom: 8 }}>📝</p>
        <p style={{ fontSize: 15, color: admin.muted }}>Aún no hay artículos. Crea el primero con “Nuevo artículo”.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fonts.sans }}>
      {err && <div style={{ marginBottom: 14 }}><Banner kind="error">{err}</Banner></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ width: 8, height: 40, borderRadius: 4, background: p.category?.color || "#ccc", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: admin.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                <Badge published={p.status === "published"} />
                {p.category && <span style={{ fontSize: 12, color: admin.muted }}>{p.category.name}</span>}
                <span style={{ fontSize: 12, color: "#aaa" }}>/{p.slug}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {p.status === "published" && (
                <Link href={`/blog/${p.slug}`} target="_blank" style={iconBtn} title="Ver">👁️</Link>
              )}
              <Link href={`/admin/posts/${p.id}/edit`} style={iconBtn} title="Editar">✏️</Link>
              <button type="button" onClick={() => remove(p)} disabled={deletingId === p.id} style={{ ...iconBtn, color: admin.danger, cursor: "pointer" }} title="Eliminar">
                {deletingId === p.id ? "…" : "🗑️"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ published }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 50, background: published ? "#e7f7ec" : "#fdf1e3", color: published ? "#1c7a3f" : "#a25a12" }}>
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}

const iconBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 9,
  border: `1px solid ${admin.border}`,
  background: "#fff",
  fontSize: 15,
};
