import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SignOutButton from "@/components/admin/SignOutButton";
import { fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  if (!isSupabaseConfigured) {
    return (
      <Centered>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Falta configurar Supabase</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>
          El panel de administración necesita las claves de Supabase. Sigue los pasos del archivo{" "}
          <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 6 }}>SETUP.md</code> y crea el archivo{" "}
          <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 6 }}>.env.local</code>.
        </p>
      </Centered>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <Centered>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Cuenta sin permisos</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 18 }}>
          Tu cuenta <strong>{user.email}</strong> inició sesión, pero todavía no está autorizada como
          administradora. Agrega tu usuario a la tabla <code>admins</code> siguiendo el archivo{" "}
          <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 6 }}>SETUP.md</code>.
        </p>
        <SignOutButton />
      </Centered>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", minHeight: "100vh", background: "#f5f6f8" }} className="sc-admin-shell">
      <AdminSidebar email={user.email} />
      <main style={{ flex: 1, minWidth: 0, padding: "28px clamp(16px, 4vw, 40px)", fontFamily: fonts.sans }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 820px) {
          .sc-admin-shell { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: fonts.sans }}>
      <div style={{ maxWidth: 520, background: "#fff", border: "1px solid #e4e6ea", borderRadius: 16, padding: 32, textAlign: "center" }}>
        {children}
      </div>
    </div>
  );
}
