import SectionHero from "@/components/ui/SectionHero";
import ResourcesBrowser from "@/components/recursos/ResourcesBrowser";
import { getContent, getResources, getResourceCategories } from "@/lib/queries";
import { colors as c } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Recursos · Saberes Científicos" };

export default async function RecursosPage() {
  const [content, resources, categories] = await Promise.all([
    getContent("recursos"),
    getResources(),
    getResourceCategories(),
  ]);

  return (
    <>
      <SectionHero kicker="Material de apoyo" title={content.title} intro={content.intro} accent={c.naranja} />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 28px 72px" }}>
        <ResourcesBrowser resources={resources} categories={categories} />
      </section>
    </>
  );
}
