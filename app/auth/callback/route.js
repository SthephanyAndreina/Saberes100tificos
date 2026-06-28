import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// Procesa el enlace del correo (recuperación de contraseña / confirmación) y
// crea la sesión. Acepta los dos formatos posibles de Supabase:
//   - flujo PKCE:      ?code=...
//   - flujo token_hash: ?token_hash=...&type=recovery
// Luego redirige al destino (?next=...).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/admin";

  if (isSupabaseConfigured) {
    const supabase = createClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } else if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=enlace`);
}
