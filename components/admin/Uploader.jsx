"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { admin } from "./ui";
import { fonts } from "@/lib/theme";

export default function Uploader({
  bucket,
  accept = "image/*",
  label = "Subir archivo",
  folder = "",
  onUploaded,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded?.(data.publicUrl, file.name);
    } catch (ex) {
      setErr(ex?.message || "No se pudo subir el archivo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ fontFamily: fonts.sans }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 10,
          border: `1.5px dashed ${admin.border}`,
          background: "#fff",
          color: admin.text,
          fontSize: 13.5,
          fontWeight: 600,
          cursor: busy ? "wait" : "pointer",
        }}
      >
        {busy ? "Subiendo…" : `⬆️ ${label}`}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      {err && <p style={{ color: admin.danger, fontSize: 12.5, marginTop: 6 }}>{err}</p>}
    </div>
  );
}
