import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/admin/PostForm";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, color")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageTitle title="Nuevo artículo" />
      <PostForm categories={categories || []} />
    </div>
  );
}
