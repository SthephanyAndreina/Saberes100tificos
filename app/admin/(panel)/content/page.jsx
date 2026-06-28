import ContentManager from "@/components/admin/ContentManager";
import { PageTitle } from "@/components/admin/ui";
import { getAllContent, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [content, settings] = await Promise.all([getAllContent(), getSettings()]);

  return (
    <div>
      <PageTitle title="Textos y enlaces" subtitle="Edita los textos de cada sección y los enlaces a tus redes. Los cambios se ven al instante en la web." />
      <ContentManager content={content} settings={settings} />
    </div>
  );
}
