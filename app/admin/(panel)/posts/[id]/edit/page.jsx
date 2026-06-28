import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/admin/PostForm";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const supabase = createClient();
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("categories").select("id, name, slug, color").order("sort_order", { ascending: true }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <PageTitle title="Editar artículo" />
      <PostForm post={post} categories={categories || []} />
    </div>
  );
}
