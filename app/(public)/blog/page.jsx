import SectionHero from "@/components/ui/SectionHero";
import SearchablePostList from "@/components/blog/SearchablePostList";
import { getContent, getPosts } from "@/lib/queries";
import { colors as c } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Blog · Saberes Científicos" };

export default async function BlogPage() {
  const [content, posts] = await Promise.all([getContent("blog"), getPosts()]);
  return (
    <>
      <SectionHero kicker="Todo el contenido #" title={content.title} intro={content.intro} accent={c.fuccia} />
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 28px 72px" }}>
        <SearchablePostList
          posts={posts}
          placeholder="Buscar en todos los artículos de la web…"
          emptyText="Aún no hay artículos publicados. Crea el primero desde el panel /admin."
        />
      </section>
    </>
  );
}
