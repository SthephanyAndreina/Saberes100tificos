import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostsTable from "@/components/admin/PostsTable";
import { PageTitle, Button } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, category:categories(name, color)")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageTitle
        title="Artículos"
        subtitle="Crea, edita y elimina los artículos del blog."
        action={
          <Link href="/admin/posts/new">
            <Button>＋ Nuevo artículo</Button>
          </Link>
        }
      />
      <PostsTable posts={posts || []} />
    </div>
  );
}
