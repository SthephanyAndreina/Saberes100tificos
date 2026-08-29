"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CONTENT_SCHEMA, SETTINGS_SCHEMA } from "@/lib/content";
import { Label, Input, Textarea, Button, Banner, admin } from "./ui";
import TiptapEditor from "./TiptapEditor";
import { fonts } from "@/lib/theme";

export default function ContentManager({ content = {}, settings = {} }) {
  return (
    <div style={{ fontFamily: fonts.sans, display: "flex", flexDirection: "column", gap: 14 }}>
      <SettingsCard settings={settings} />
      {CONTENT_SCHEMA.map((block) => (
        <ContentBlock key={block.key} block={block} initial={content[block.key] || {}} />
      ))}
    </div>
  );
}

function ContentBlock({ block, initial }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function set(field, v) {
    setValues((prev) => ({ ...prev, [field]: v }));
  }

  async function save() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: block.key, value: values, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
      setMsg("Guardado ✓");
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch (ex) {
      setErr(ex?.message || "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.border}`, borderRadius: 14, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: fonts.sans }}
      >
        <span style={{ fontWeight: 800, fontSize: 15, color: admin.text }}>{block.label}</span>
        <span style={{ color: admin.muted }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {block.fields.map((f) => (
            <div key={f.name}>
              <Label>{f.label}</Label>
              {f.type === "rich" ? (
                <>
                  <TiptapEditor
                    value={values[f.name] ?? ""}
                    onChange={(html) => set(f.name, html)}
                    placeholder="Escribe aquí. Puedes usar listas con viñetas o numeradas."
                  />
                  
                </>
              ) : f.type === "textarea" ? (
                <Textarea value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
              ) : (
                <Input value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
              )}
            </div>
          ))}
          {err && <Banner kind="error">{err}</Banner>}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button type="button" onClick={save} disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</Button>
            {msg && <span style={{ color: "#1c7a3f", fontSize: 13, fontWeight: 700 }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsCard({ settings }) {
  const router = useRouter();
  const [values, setValues] = useState(settings || {});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function set(name, v) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function save() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .upsert({ id: 1, data: values, updated_at: new Date().toISOString() }, { onConflict: "id" });
      if (error) throw error;
      setMsg("Guardado ✓");
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch (ex) {
      setErr(ex?.message || "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${admin.primary}40`, borderRadius: 14, padding: 20 }}>
      <p style={{ fontWeight: 800, fontSize: 15, color: admin.text, marginBottom: 4 }}>🔗 Enlaces y redes</p>
      <p style={{ fontSize: 13, color: admin.muted, marginBottom: 16 }}>Estos enlaces se usan en el menú, el pie de página y la sección de contacto.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {SETTINGS_SCHEMA.map((f) => (
          <div key={f.name}>
            <Label>{f.label}</Label>
            <Input value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
          </div>
        ))}
      </div>
      {err && <div style={{ marginTop: 12 }}><Banner kind="error">{err}</Banner></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
        <Button type="button" onClick={save} disabled={busy}>{busy ? "Guardando…" : "Guardar enlaces"}</Button>
        {msg && <span style={{ color: "#1c7a3f", fontSize: 13, fontWeight: 700 }}>{msg}</span>}
      </div>
    </div>
  );
}
