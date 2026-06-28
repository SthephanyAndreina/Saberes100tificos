import SectionHero from "@/components/ui/SectionHero";
import SearchablePostList from "@/components/blog/SearchablePostList";
import { getContent, getPosts } from "@/lib/queries";
import { colors as c } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Divulgación · Saberes Científicos" };

export default async function DivulgacionPage() {
  const [content, posts] = await Promise.all([
    getContent("divulgacion"),
    getPosts({ categorySlug: "ciencias" }),
  ]);
  return (
    <>
      <SectionHero kicker="#Ciencias" title={content.title} intro={content.intro} accent={c.cian} />
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 28px 72px" }}>
        <SearchablePostList
          posts={posts}
          placeholder="Buscar en artículos de #Ciencias…"
          emptyText="Aún no hay artículos de divulgación. Crea uno desde el panel /admin."
        />
      </section>
    </>
  );
}
