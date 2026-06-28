import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getSettings } from "@/lib/queries";

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAFAFA" }}>
      <SiteHeader settings={settings} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
