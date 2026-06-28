import Link from "next/link";
import SectionHero from "@/components/ui/SectionHero";
import { getContent, getCarreras } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

export const metadata = { title: "Carreras de la USB · Saberes Científicos" };

export default async function CarrerasPage() {
  const [content, carreras] = await Promise.all([getContent("carreras"), getCarreras()]);
  return (
    <>
      <SectionHero kicker="Orientación vocacional" title={content.title} intro={content.intro} accent={c.magenta} />
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "56px 28px 72px", fontFamily: fonts.sans }}>
        {carreras.length === 0 ? (
          <p style={{ color: "#999", fontSize: 15, textAlign: "center", padding: "32px 0" }}>
            Pronto publicaremos la lista de carreras con sus pensum.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {carreras.map((car) => {
              const inner = (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    borderRadius: 14,
                    border: "1.5px solid #ececec",
                    background: "#fff",
                    padding: "18px 22px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: c.negro }}>{car.name}</span>
                  {car.pensum_url ? (
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.magenta, whiteSpace: "nowrap" }}>Pensum (PDF) ↗</span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>Pensum próximamente</span>
                  )}
                </div>
              );
              return car.pensum_url ? (
                <a key={car.id} href={car.pensum_url} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={car.id}>{inner}</div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <Link href="/orientacion-vocacional/articulos" style={{ fontSize: 13.5, fontWeight: 700, color: c.cian }}>
            ← Volver a artículos de orientación
          </Link>
        </div>
      </section>
    </>
  );
}
