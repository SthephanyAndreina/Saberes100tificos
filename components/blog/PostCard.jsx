"use client";

import Link from "next/link";
import { colors as c, fonts } from "@/lib/theme";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export default function PostCard({ post }) {
  const color = post.category?.color || c.cian;
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        borderRadius: 22,
        overflow: "hidden",
        border: "1.5px solid #e8e8e8",
        background: "#fff",
        fontFamily: fonts.sans,
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 20px 56px ${color}26`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
      }}
    >
      {post.cover_url ? (
        <div style={{ height: 168, backgroundImage: `url(${post.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      ) : (
        <div style={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      )}
      <div style={{ padding: "22px 22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {post.category && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: color, borderRadius: 50, padding: "5px 12px" }}>
              {post.category.name}
            </span>
          )}
          <span style={{ fontSize: 12, color: "#999", fontFamily: fonts.mono }}>{formatDate(post.published_at)}</span>
        </div>
        <h3 style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.3, marginBottom: 10, color: c.negro }}>{post.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {post.tags.slice(0, 4).map((t) => (
              <span key={t} style={{ fontSize: 11, color: color, background: `${color}12`, borderRadius: 6, padding: "3px 8px", fontWeight: 600 }}>#{t}</span>
            ))}
          </div>
        )}
        <span style={{ display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 700, color }}>Leer artículo →</span>
      </div>
    </Link>
  );
}
