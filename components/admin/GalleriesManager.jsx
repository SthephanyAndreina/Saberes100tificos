"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Uploader from "./Uploader";
import { Input, Button, Banner, admin } from "./ui";
import { fonts } from "@/lib/theme";

export default function GalleriesManager({ galleries = [] }) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(galleries[0]?.key || "");
  const [err, setErr] = useState("");

  const active = galleries.find((g) => g.key === activeKey) || galleries[0];
  const images = active?.images || [];

  async function onUploaded(url) {
    setErr("");
    try {
      const supabase = createClient();
      const maxOrder = images.reduce((m, im) => Math.max(m, im.sort_order || 0), 0);
      const { error } = await supabase.from("gallery_images").insert({
        gallery_id: active.id,
        image_url: url,
        sort_order: maxOrder + 1,
      });
      if (error) throw error;
      router.refresh();
    } catch (ex) {
      setErr(ex?.message || "No se pudo guardar la imagen.");
    }
  }

  if (!active) {
    return <p style={{ color: admin.muted, fontFamily: fonts.sans }}>No hay galerías configuradas. Ejecuta el esquema SQL.</p>;
  }

  return (
    <div style={{ fontFamily: fonts.sans }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {galleries.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActiveKey(g.key)}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: `1.5px solid ${g.key === active.key ? admin.primary : admin.border}`,
              background: g.key === active.key ? `${admin.primary}12` : "#fff",
              color: g.key === active.key ? admin.primary : admin.text,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            {g.title} ({g.images?.length || 0})
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: 20, marginBottom: 18 }}>
        <p style={{ fontWeight: 800, color: admin.text, marginBottom: 4 }}>{active.title}</p>
        <p style={{ fontSize: 13, color: admin.muted, marginBottom: 14 }}>{active.description}</p>
        <Uploader bucket="gallery" folder={active.key} label="Subir foto a esta galería" onUploaded={onUploaded} />
      </div>

      {err && <div style={{ marginBottom: 14 }}><Banner kind="error">{err}</Banner></div>}

      {images.length === 0 ? (
        <p style={{ color: admin.muted, fontSize: 14 }}>Esta galería aún no tiene fotos.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {images.map((img, i) => (
            <ImageCard key={img.id} img={img} images={images} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageCard({ img, images, index }) {
  const router = useRouter();
  const [caption, setCaption] = useState(img.caption || "");
  const [busy, setBusy] = useState(false);

  async function saveCaption() {
    if (caption === (img.caption || "")) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("gallery_images").update({ caption }).eq("id", img.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("gallery_images").delete().eq("id", img.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function move(dir) {
    const other = images[index + dir];
    if (!other) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("gallery_images").update({ sort_order: other.sort_order }).eq("id", img.id);
      await supabase.from("gallery_images").update({ sort_order: img.sort_order }).eq("id", other.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ aspectRatio: "4 / 3", background: "#eee", backgroundImage: `url(${img.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ padding: 10 }}>
        <Input value={caption} onChange={(e) => setCaption(e.target.value)} onBlur={saveCaption} placeholder="Texto (opcional)" style={{ fontSize: 13, padding: "8px 10px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={() => move(-1)} disabled={busy || index === 0} style={miniBtn}>↑</button>
            <button type="button" onClick={() => move(1)} disabled={busy || index === images.length - 1} style={miniBtn}>↓</button>
          </div>
          <button type="button" onClick={remove} disabled={busy} style={{ ...miniBtn, color: admin.danger }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

const miniBtn = {
  width: 34,
  height: 32,
  borderRadius: 8,
  border: `1px solid ${admin.border}`,
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
};
