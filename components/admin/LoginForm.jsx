"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Label, Input, Button, Banner, admin } from "./ui";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!isSupabaseConfigured) {
      setErr("Supabase aún no está configurado. Revisa el archivo SETUP.md.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const redirect = params.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch (ex) {
      setErr(traducirError(ex?.message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: admin.text, marginBottom: 18 }}>Iniciar sesión</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {err && <Banner kind="error">{err}</Banner>}
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="tu@correo.com" />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
        </div>
        <Button type="submit" disabled={busy} style={{ width: "100%", marginTop: 4 }}>
          {busy ? "Entrando…" : "Entrar"}
        </Button>
        <Link href="/admin/reset" style={{ fontSize: 13, color: admin.primary, fontWeight: 600, textAlign: "center" }}>
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
}

function traducirError(msg = "") {
  if (/invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
  if (/email not confirmed/i.test(msg)) return "Tu correo aún no ha sido confirmado.";
  return msg || "No se pudo iniciar sesión.";
}
