import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { colors as c, fonts } from "@/lib/theme";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Artículo no encontrado" };
  return { title: `${post.title} · Saberes Científicos`, description: post.excerpt };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const color = post.category?.color || c.cian;

  return (
    <article style={{ fontFamily: fonts.sans }}>
      <header
        className="grain"
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${c.negro} 0%, #10242a 100%)`,
          color: "#fff",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "48px 28px 44px" }}>
          <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>← Volver al blog</Link>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {post.category && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: color, borderRadius: 50, padding: "5px 14px" }}>
                {post.category.name}
              </span>
            )}
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: fonts.mono }}>{formatDate(post.published_at)}</span>
          </div>
          <h1 style={{ marginTop: 14, fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}>{post.excerpt}</p>
          )}
          <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Por {post.author || "Saberes Científicos"}</p>
        </div>
      </header>

      {post.cover_url && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 28px" }}>
          <img
            src={post.cover_url}
            alt={post.title}
            style={{ width: "100%", borderRadius: 20, marginTop: -28, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", display: "block" }}
          />
        </div>
      )}

      <div
        className="prose"
        style={{ maxWidth: 720, margin: "0 auto", padding: "44px 28px 72px" }}
        dangerouslySetInnerHTML={{ __html: post.content_html || "" }}
      />

      {post.tags?.length > 0 && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 28px 56px", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {post.tags.map((t) => (
            <span key={t} style={{ fontSize: 13, color, background: `${color}12`, borderRadius: 8, padding: "5px 12px", fontWeight: 600 }}>#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}
