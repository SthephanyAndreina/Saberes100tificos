"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Label, Input, Button, Banner, admin } from "./ui";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true); // procesando el enlace del correo
  const [ready, setReady] = useState(false); // hay sesión de recuperación válida
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Al cargar, establecemos la sesión de recuperación a partir del enlace del
  // correo. Cubrimos los dos formatos: tokens en el # (implícito) o ?code (PKCE).
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }
    // Capturar el hash ANTES de que el cliente lo procese/limpie.
    const rawHash = typeof window !== "undefined" ? window.location.hash || "" : "";
    const supabase = createClient();
    let unsub = () => {};

    async function init() {
      // 1) Enlace con tokens en el hash (flujo por defecto de Supabase).
      if (rawHash.includes("access_token")) {
        const p = new URLSearchParams(rawHash.replace(/^#/, ""));
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          const { data } = await supabase.auth.setSession({ access_token, refresh_token });
          if (data?.session) setReady(true);
          // Limpiar el hash de la URL por estética/seguridad.
          window.history.replaceState(null, "", window.location.pathname);
          setChecking(false);
          return;
        }
      }

      // 2) Si no, escuchar el evento y comprobar la sesión (flujo PKCE/code).
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setReady(true);
          setChecking(false);
        }
      });
      unsub = () => sub.subscription.unsubscribe();

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
        setChecking(false);
      } else {
        setTimeout(() => setChecking(false), 1500);
      }
    }

    init();
    return () => unsub();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("¡Contraseña actualizada! Redirigiendo al panel…");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (ex) {
      setErr(traducir(ex?.message));
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <p style={{ fontSize: 15, color: admin.text, fontWeight: 600 }}>Verificando el enlace…</p>
        <p style={{ fontSize: 13, color: admin.muted, marginTop: 6 }}>Un momento, por favor.</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: admin.text, marginBottom: 8 }}>Enlace no válido</h1>
        <Banner kind="error">
          El enlace expiró o ya se usó. Solicita uno nuevo desde “¿Olvidaste tu contraseña?”.
        </Banner>
        <div style={{ marginTop: 16 }}>
          <Link href="/admin/reset" style={{ fontSize: 14, color: admin.primary, fontWeight: 700 }}>
            Solicitar un nuevo enlace →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: admin.text, marginBottom: 8 }}>Nueva contraseña</h1>
      <p style={{ fontSize: 13.5, color: admin.muted, marginBottom: 18 }}>
        Escribe tu nueva contraseña.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {err && <Banner kind="error">{err}</Banner>}
        {msg && <Banner kind="success">{msg}</Banner>}
        <div>
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
        </div>
        <div>
          <Label htmlFor="confirm">Repetir contraseña</Label>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
        </div>
        <Button type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </div>
    </form>
  );
}

function traducir(msg = "") {
  if (/auth session missing/i.test(msg) || /not authenticated/i.test(msg))
    return "El enlace expiró o no es válido. Solicita uno nuevo desde 'Recuperar contraseña'.";
  if (/should be different/i.test(msg)) return "La nueva contraseña debe ser diferente a la anterior.";
  return msg || "No se pudo actualizar la contraseña.";
}
