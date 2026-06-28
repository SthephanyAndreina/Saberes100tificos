import SectionHero from "@/components/ui/SectionHero";
import Gallery from "@/components/gallery/Gallery";
import { getContent, getGallery } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Taller de orientación vocacional · Saberes Científicos" };

export default async function TallerPage() {
  const [content, { images }] = await Promise.all([
    getContent("taller"),
    getGallery("taller-orientacion"),
  ]);
  return (
    <>
      <SectionHero kicker="Actividades" title={content.title} accent={c.naranja} />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 28px 16px", fontFamily: fonts.sans }}>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#444" }}>{content.descripcion}</p>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 28px 72px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 18, fontFamily: fonts.sans }}>Galería del taller</h2>
        <Gallery images={images} emptyText="Pronto subiremos fotos de nuestros talleres." />
      </section>
    </>
  );
}
