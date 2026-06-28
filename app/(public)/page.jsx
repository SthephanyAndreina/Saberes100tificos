import InicioContent from "@/components/home/InicioContent";
import { getContent, getSettings, getPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, settings, latestPosts] = await Promise.all([
    getContent("hero"),
    getSettings(),
    getPosts({ limit: 3 }),
  ]);
  return <InicioContent hero={hero} settings={settings} latestPosts={latestPosts} />;
}
