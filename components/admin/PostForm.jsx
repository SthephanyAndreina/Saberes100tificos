"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TiptapEditor from "./TiptapEditor";
import Uploader from "./Uploader";
import { Label, Input, Textarea, Button, Banner, admin } from "./ui";
import { slugify } from "@/lib/slug";
import { fonts } from "@/lib/theme";

export default function PostForm({ post, categories = [] }) {
  const router = useRouter();
  const editing = Boolean(post?.id);

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [categoryId, setCategoryId] = useState(post?.category_id || categories[0]?.id || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [tags, setTags] = useState((post?.tags || []).join(", "));
  const [cover, setCover] = useState(post?.cover_url || "");
  const [content, setContent] = useState(post?.content_html || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function onTitle(v) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function save(e, publish) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) {
      setErr("El título es obligatorio.");
      return;
    }
    const nextStatus = publish === undefined ? status : publish ? "published" : "draft";
    const finalSlug = slugify(slug || title);
    setBusy(true);
    try {
      const supabase = createClient();
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content_html: content,
        cover_url: cover || null,
        category_id: categoryId || null,
        tags: tags
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean),
        status: nextStatus,
        updated_at: new Date().toISOString(),
      };
      if (nextStatus === "published") {
        payload.published_at = post?.published_at || new Date().toISOString();
      }
      let error;
      if (editing) {
        ({ error } = await supabase.from("posts").update(payload).eq("id", post.id));
      } else {
        ({ error } = await supabase.from("posts").insert(payload));
      }
      if (error) throw error;
      router.push("/admin/posts");
      router.refresh();
    } catch (ex) {
      setErr(traducir(ex));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => save(e)} style={{ fontFamily: fonts.sans }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <Link href="/admin/posts" style={{ fontSize: 13.5, fontWeight: 600, color: admin.muted }}>← Volver a artículos</Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="button" variant="ghost" disabled={busy} onClick={(e) => save(e, false)}>Guardar borrador</Button>
          <Button type="button" disabled={busy} onClick={(e) => save(e, true)}>{busy ? "Guardando…" : "Publicar"}</Button>
        </div>
      </div>

      {err && <div style={{ marginBottom: 16 }}><Banner kind="error">{err}</Banner></div>}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 22, alignItems: "start" }} className="sc-postform-grid">
        {/* Columna principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Título del artículo" style={{ fontSize: 18, fontWeight: 700 }} />
          </div>
          <div>
            <Label htmlFor="excerpt">Resumen (se muestra en las tarjetas)</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Un par de frases que resuman el artículo." style={{ minHeight: 70 }} />
          </div>
          <div>
            <Label>Contenido</Label>
            <TiptapEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Columna lateral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SideCard title="Publicación">
            <Label htmlFor="status">Estado</Label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
              <option value="draft">Borrador (no visible)</option>
              <option value="published">Publicado</option>
            </select>
          </SideCard>

          <SideCard title="Categoría (#)">
            {categories.length === 0 ? (
              <p style={{ fontSize: 13, color: admin.muted }}>
                No hay categorías. <Link href="/admin/categories" style={{ color: admin.primary }}>Crea una</Link>.
              </p>
            ) : (
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={selectStyle}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </SideCard>

          <SideCard title="Etiquetas">
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ciencia, biología, usb" />
            <p style={{ fontSize: 11.5, color: admin.muted, marginTop: 6 }}>Sepáralas con comas. Ayudan al buscador.</p>
          </SideCard>

          <SideCard title="Enlace (slug)">
            <Input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="mi-articulo" />
            <p style={{ fontSize: 11.5, color: admin.muted, marginTop: 6, wordBreak: "break-all" }}>/blog/{slugify(slug || title) || "…"}</p>
          </SideCard>

          <SideCard title="Imagen de portada">
            {cover ? (
              <div>
                <img src={cover} alt="" style={{ width: "100%", borderRadius: 10, marginBottom: 10 }} />
                <Button type="button" variant="danger" onClick={() => setCover("")} style={{ width: "100%" }}>Quitar portada</Button>
              </div>
            ) : (
              <Uploader bucket="covers" folder="cover" label="Subir portada" onUploaded={(url) => setCover(url)} />
            )}
          </SideCard>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sc-postform-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

function SideCard({ title, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: admin.muted, marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: `1.5px solid ${admin.border}`,
  fontSize: 14,
  background: "#fff",
  color: admin.text,
  fontFamily: fonts.sans,
};

function traducir(ex) {
  const msg = ex?.message || "";
  if (ex?.code === "23505" || /duplicate key/i.test(msg)) return "Ya existe un artículo con ese enlace (slug). Cambia el slug.";
  if (/row-level security/i.test(msg)) return "No tienes permisos para guardar. ¿Tu usuario está en la tabla admins?";
  return msg || "No se pudo guardar el artículo.";
}
