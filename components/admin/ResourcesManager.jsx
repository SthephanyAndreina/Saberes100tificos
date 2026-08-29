"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Uploader from "./Uploader";
import { Label, Input, Textarea, Button, Banner, admin } from "./ui";
import { fonts } from "@/lib/theme";

const GUIDE_ACCEPT =
  "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx";

export default function ResourcesManager({ resources = [], categories = [] }) {
  const router = useRouter();
  const [type, setType] = useState("guide_pdf");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function add(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) { setErr("Escribe un título."); return; }
    if (!url.trim()) { setErr(type === "guide_pdf" ? "Sube la guía (PDF o DOCX)." : "Pega el enlace del video."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("resources").insert({
        type,
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId || null,
        url: url.trim(),
        sort_order: resources.length + 1,
      });
      if (error) throw error;
      setTitle(""); setDescription(""); setCategoryId(""); setUrl("");
      router.refresh();
    } catch (ex) {
      setErr(ex?.message || "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(r) {
    if (!window.confirm(`¿Eliminar "${r.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("resources").delete().eq("id", r.id);
    router.refresh();
  }

  const guias = resources.filter((r) => r.type === "guide_pdf");
  const videos = resources.filter((r) => r.type === "video_link");

  return (
    <div style={{ fontFamily: fonts.sans, display: "flex", flexDirection: "column", gap: 22 }}>
      <form onSubmit={add} style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontWeight: 800, marginBottom: 14, color: admin.text }}>Añadir recurso</p>
        {err && <div style={{ marginBottom: 12 }}><Banner kind="error">{err}</Banner></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={radio(type === "guide_pdf")}>
              <input type="radio" checked={type === "guide_pdf"} onChange={() => { setType("guide_pdf"); setUrl(""); }} /> 📄 Guía de estudio (PDF o DOCX)
            </label>
            <label style={radio(type === "video_link")}>
              <input type="radio" checked={type === "video_link"} onChange={() => { setType("video_link"); setUrl(""); }} /> ▶️ Video (enlace)
            </label>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Guía de trigonometría" />
          </div>
          <div>
            <Label>Categoría de estudio</Label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={selectStyle}>
              <option value="">Sin categoría</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            {categories.length === 0 && (
              <p style={{ fontSize: 12, color: admin.muted, marginTop: 6 }}>Crea categorías arriba para poder clasificar los recursos.</p>
            )}
          </div>
          <div>
            <Label>Descripción (opcional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 60 }} />
          </div>
          <div>
            <Label>{type === "guide_pdf" ? "Archivo (PDF o DOCX)" : "Enlace del video"}</Label>
            {type === "guide_pdf" ? (
              url ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: admin.primary, wordBreak: "break-all" }}>✓ Archivo subido</span>
                  <Button type="button" variant="ghost" onClick={() => setUrl("")}>Cambiar</Button>
                </div>
              ) : (
                <Uploader bucket="documents" folder="guias" accept={GUIDE_ACCEPT} label="Subir PDF o DOCX" onUploaded={(u) => setUrl(u)} />
              )
            ) : (
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" />
            )}
          </div>
          <div><Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Añadir recurso"}</Button></div>
        </div>
      </form>

      <ResourceList title="📄 Guías de estudio" items={guias} categories={categories} onRemove={remove} />
      <ResourceList title="▶️ Videos" items={videos} categories={categories} onRemove={remove} />
    </div>
  );
}

function ResourceList({ title, items, categories, onRemove }) {
  return (
    <div>
      <p style={{ fontWeight: 800, color: admin.text, marginBottom: 10 }}>{title}</p>
      {items.length === 0 ? (
        <p style={{ color: admin.muted, fontSize: 13.5 }}>Nada todavía.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((r) => (
            <ResourceRow key={r.id} r={r} categories={categories} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceRow({ r, categories, onRemove }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(r.category_id || "");
  const [busy, setBusy] = useState(false);

  async function changeCategory(value) {
    setCategoryId(value);
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("resources").update({ category_id: value || null }).eq("id", r.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, padding: "12px 14px", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <p style={{ fontWeight: 700, color: admin.text }}>{r.title}</p>
        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: admin.primary, wordBreak: "break-all" }}>{r.url}</a>
      </div>
      <select value={categoryId} onChange={(e) => changeCategory(e.target.value)} disabled={busy} style={{ ...selectStyle, width: "auto", minWidth: 150 }}>
        <option value="">Sin categoría</option>
        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
      <Button type="button" variant="danger" onClick={() => onRemove(r)}>🗑️</Button>
    </div>
  );
}

const radio = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "9px 14px",
  borderRadius: 10,
  border: `1.5px solid ${active ? admin.primary : admin.border}`,
  background: active ? `${admin.primary}10` : "#fff",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
});

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
