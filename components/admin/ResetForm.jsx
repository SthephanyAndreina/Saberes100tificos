"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Label, Input, Button, Banner, admin } from "./ui";

export default function ResetForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!isSupabaseConfigured) {
      setErr("Supabase aún no está configurado. Revisa el archivo SETUP.md.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      // El enlace va directo a la página de nueva contraseña; el navegador
      // procesa la sesión de recuperación (los datos vienen en el # de la URL,
      // que el servidor no puede leer).
      const redirectTo = `${window.location.origin}/admin/update-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMsg("Si el correo existe, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y la carpeta de spam).");
    } catch (ex) {
      setErr(traducirReset(ex?.message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: admin.text, marginBottom: 8 }}>Recuperar contraseña</h1>
      <p style={{ fontSize: 13.5, color: admin.muted, marginBottom: 18 }}>
        Te enviaremos un enlace a tu correo para crear una nueva contraseña.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {err && <Banner kind="error">{err}</Banner>}
        {msg && <Banner kind="success">{msg}</Banner>}
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="tu@correo.com" />
        </div>
        <Button type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Enviando…" : "Enviar enlace"}
        </Button>
        <Link href="/admin/login" style={{ fontSize: 13, color: admin.primary, fontWeight: 600, textAlign: "center" }}>
          ← Volver a iniciar sesión
        </Link>
      </div>
    </form>
  );
}

function traducirReset(msg = "") {
  if (/rate limit/i.test(msg))
    return "Se alcanzó el límite de correos por ahora (Supabase gratuito permite pocos por hora). Espera unos minutos e inténtalo una sola vez.";
  if (/invalid email/i.test(msg)) return "El correo no es válido.";
  return msg || "No se pudo enviar el correo.";
}
