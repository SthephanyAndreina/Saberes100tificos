"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Uploader from "./Uploader";
import { Label, Input, Textarea, Button, Banner, admin } from "./ui";
import { fonts } from "@/lib/theme";

export default function ResourcesManager({ resources = [] }) {
  const router = useRouter();
  const [type, setType] = useState("guide_pdf");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function add(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) { setErr("Escribe un título."); return; }
    if (!url.trim()) { setErr(type === "guide_pdf" ? "Sube el PDF de la guía." : "Pega el enlace del video."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("resources").insert({
        type,
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        sort_order: resources.length + 1,
      });
      if (error) throw error;
      setTitle(""); setDescription(""); setUrl("");
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
              <input type="radio" checked={type === "guide_pdf"} onChange={() => { setType("guide_pdf"); setUrl(""); }} /> 📄 Guía de estudio (PDF)
            </label>
            <label style={radio(type === "video_link")}>
              <input type="radio" checked={type === "video_link"} onChange={() => { setType("video_link"); setUrl(""); }} /> ▶️ Video (enlace)
            </label>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Guía de matemáticas básicas" />
          </div>
          <div>
            <Label>Descripción (opcional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 60 }} />
          </div>
          <div>
            <Label>{type === "guide_pdf" ? "Archivo PDF" : "Enlace del video"}</Label>
            {type === "guide_pdf" ? (
              url ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: admin.primary, wordBreak: "break-all" }}>✓ PDF subido</span>
                  <Button type="button" variant="ghost" onClick={() => setUrl("")}>Cambiar</Button>
                </div>
              ) : (
                <Uploader bucket="documents" folder="guias" accept="application/pdf" label="Subir PDF" onUploaded={(u) => setUrl(u)} />
              )
            ) : (
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" />
            )}
          </div>
          <div><Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Añadir recurso"}</Button></div>
        </div>
      </form>

      <ResourceList title="📄 Guías de estudio" items={guias} onRemove={remove} />
      <ResourceList title="▶️ Videos" items={videos} onRemove={remove} />
    </div>
  );
}

function ResourceList({ title, items, onRemove }) {
  return (
    <div>
      <p style={{ fontWeight: 800, color: admin.text, marginBottom: 10 }}>{title}</p>
      {items.length === 0 ? (
        <p style={{ color: admin.muted, fontSize: 13.5 }}>Nada todavía.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: admin.text }}>{r.title}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: admin.primary, wordBreak: "break-all" }}>{r.url}</a>
              </div>
              <Button type="button" variant="danger" onClick={() => onRemove(r)}>🗑️</Button>
            </div>
          ))}
        </div>
      )}
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
