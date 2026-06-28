"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Uploader from "./Uploader";
import { Label, Input, Button, Banner, admin } from "./ui";
import { fonts } from "@/lib/theme";

export default function CarrerasManager({ carreras = [] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pensum, setPensum] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function add(e) {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Escribe el nombre de la carrera."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("carreras").insert({
        name: name.trim(),
        pensum_url: pensum || null,
        sort_order: carreras.length + 1,
      });
      if (error) throw error;
      setName(""); setPensum("");
      router.refresh();
    } catch (ex) {
      setErr(ex?.message || "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ fontFamily: fonts.sans, display: "flex", flexDirection: "column", gap: 20 }}>
      <form onSubmit={add} style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontWeight: 800, marginBottom: 14, color: admin.text }}>Añadir carrera</p>
        {err && <div style={{ marginBottom: 12 }}><Banner kind="error">{err}</Banner></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Label>Nombre de la carrera</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Licenciatura en Química" />
          </div>
          <div>
            <Label>Pensum (PDF, opcional)</Label>
            {pensum ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: admin.primary }}>✓ PDF subido</span>
                <Button type="button" variant="ghost" onClick={() => setPensum("")}>Cambiar</Button>
              </div>
            ) : (
              <Uploader bucket="documents" folder="pensum" accept="application/pdf" label="Subir pensum (PDF)" onUploaded={(u) => setPensum(u)} />
            )}
          </div>
          <div><Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Añadir carrera"}</Button></div>
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {carreras.length === 0 ? (
          <p style={{ color: admin.muted, fontSize: 14 }}>No hay carreras todavía.</p>
        ) : (
          carreras.map((car) => <CarreraRow key={car.id} car={car} />)
        )}
      </div>
    </div>
  );
}

function CarreraRow({ car }) {
  const router = useRouter();
  const [name, setName] = useState(car.name);
  const [busy, setBusy] = useState(false);

  async function saveName() {
    if (name === car.name || !name.trim()) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("carreras").update({ name: name.trim() }).eq("id", car.id);
      router.refresh();
    } finally { setBusy(false); }
  }

  async function setPensum(url) {
    const supabase = createClient();
    await supabase.from("carreras").update({ pensum_url: url }).eq("id", car.id);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar "${car.name}"?`)) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("carreras").delete().eq("id", car.id);
      router.refresh();
    } finally { setBusy(false); }
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName} style={{ flex: 1, minWidth: 180 }} />
      {car.pensum_url ? (
        <a href={car.pensum_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: admin.primary }}>Ver pensum ↗</a>
      ) : (
        <span style={{ fontSize: 12.5, color: admin.muted }}>Sin pensum</span>
      )}
      <Uploader bucket="documents" folder="pensum" accept="application/pdf" label={car.pensum_url ? "Reemplazar" : "Subir pensum"} onUploaded={setPensum} />
      <Button type="button" variant="danger" disabled={busy} onClick={remove}>🗑️</Button>
    </div>
  );
}
