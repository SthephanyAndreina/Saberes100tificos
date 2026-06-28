"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui";

export default function SignOutButton({ children = "Cerrar sesión", variant = "ghost" }) {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <Button type="button" variant={variant} onClick={logout}>
      {children}
    </Button>
  );
}
