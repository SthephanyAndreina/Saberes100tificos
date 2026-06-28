import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  // Solo corre en el panel de administración (refresca sesión y protege rutas).
  matcher: ["/admin/:path*"],
};
