"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Label, Input, Button, Banner, admin } from "./ui";
import { slugify } from "@/lib/slug";
import { fonts } from "@/lib/theme";

// Gestión de las categorías de estudio de la sección Recursos
// (matemáticas, física, química…). Permite agregar, modificar y quitar.
export default function ResourceCategoriesManager({ categories = [] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00838F");
  const [busy, setBusy] = useState(false);

  async function add(e) {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("resource_categories").insert({
        name: name.trim(),
        slug: slugify(name),
        color,
        sort_order: categories.length + 1,
      });
      if (error) throw error;
      setName("");
      setColor("#00838F");
      router.refresh();
    } catch (ex) {
      setErr(ex?.code === "23505" ? "Ya existe una categoría con ese nombre." : ex?.message || "No se pudo crear.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ fontFamily: fonts.sans, display: "flex", flexDirection: "column", gap: 16 }}>
      <form onSubmit={add} style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontWeight: 800, marginBottom: 4, color: admin.text }}>Categorías de estudio</p>
        <p style={{ fontSize: 13, color: admin.muted, marginBottom: 14 }}>
          Sirven para ordenar los recursos por tema (matemáticas, física, química…). Los visitantes pueden filtrar por ellas y ver todo el contenido de cada categoría.
        </p>
        {err && <div style={{ marginBottom: 12 }}><Banner kind="error">{err}</Banner></div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px auto", gap: 12, alignItems: "end" }} className="sc-rcat-grid">
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Matemáticas" />
          </div>
          <div>
            <Label>Color</Label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "100%", height: 42, border: `1.5px solid ${admin.border}`, borderRadius: 10, background: "#fff", cursor: "pointer" }} />
          </div>
          <Button type="submit" disabled={busy}>{busy ? "…" : "Añadir"}</Button>
        </div>
        <style>{`@media (max-width: 620px){ .sc-rcat-grid{ grid-template-columns: 1fr !important; } }`}</style>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.length === 0 ? (
          <p style={{ color: admin.muted, fontSize: 14 }}>Aún no hay categorías. Crea la primera arriba.</p>
        ) : (
          categories.map((cat) => <CategoryRow key={cat.id} cat={cat} />)
        )}
      </div>
    </div>
  );
}

function CategoryRow({ cat }) {
  const router = useRouter();
  const [name, setName] = useState(cat.name);
  const [color, setColor] = useState(cat.color || "#00838F");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const dirty = name !== cat.name || color !== (cat.color || "#00838F");

  async function save() {
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("resource_categories").update({ name: name.trim(), slug: slugify(name), color }).eq("id", cat.id);
      if (error) throw error;
      router.refresh();
    } catch (ex) {
      setErr(ex?.code === "23505" ? "Ya existe una categoría con ese nombre." : ex?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"? Los recursos quedarán sin categoría.`)) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("resource_categories").delete().eq("id", cat.id);
      if (error) throw error;
      router.refresh();
    } catch (ex) {
      setErr(ex?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 56px auto auto", gap: 10, alignItems: "center" }} className="sc-rcat-grid">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "100%", height: 40, border: `1.5px solid ${admin.border}`, borderRadius: 10, cursor: "pointer" }} />
        <Button type="button" variant={dirty ? "primary" : "ghost"} disabled={busy || !dirty} onClick={save}>Guardar</Button>
        <Button type="button" variant="danger" disabled={busy} onClick={remove}>🗑️</Button>
      </div>
      {err && <p style={{ color: admin.danger, fontSize: 12.5, marginTop: 6 }}>{err}</p>}
    </div>
  );
}
