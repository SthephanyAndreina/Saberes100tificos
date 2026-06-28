"use client";

import { useState, useEffect } from "react";
import { colors as c, fonts } from "@/lib/theme";

export default function Gallery({ images = [], emptyText = "Pronto subiremos fotos de esta sección." }) {
  const [active, setActive] = useState(null); // índice de la imagen abierta

  useEffect(() => {
    function onKey(e) {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  if (!images.length) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: 18, border: "1.5px dashed #d8d8d8", color: "#999", fontFamily: fonts.sans }}>
        <p style={{ fontSize: 30, marginBottom: 8 }}>🖼️</p>
        <p style={{ fontSize: 15 }}>{emptyText}</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fonts.sans }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {images.map((img, i) => (
          <button
            key={img.id || i}
            type="button"
            onClick={() => setActive(i)}
            style={{
              border: "none",
              padding: 0,
              cursor: "pointer",
              borderRadius: 14,
              overflow: "hidden",
              aspectRatio: "1 / 1",
              background: "#eee",
              position: "relative",
            }}
          >
            <img
              src={img.image_url}
              alt={img.caption || ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(8,12,16,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button type="button" onClick={() => setActive(null)} style={lightboxBtn({ top: 18, right: 18 })} aria-label="Cerrar">✕</button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + images.length) % images.length); }} style={lightboxBtn({ left: 18 })} aria-label="Anterior">‹</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % images.length); }} style={lightboxBtn({ right: 18 })} aria-label="Siguiente">›</button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1000, maxHeight: "86vh", textAlign: "center" }}>
            <img src={images[active].image_url} alt={images[active].caption || ""} style={{ maxWidth: "100%", maxHeight: "78vh", borderRadius: 14, objectFit: "contain" }} />
            {images[active].caption && (
              <figcaption style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 12 }}>{images[active].caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}

function lightboxBtn(pos) {
  return {
    position: "absolute",
    top: pos.top ?? "50%",
    transform: pos.top ? "none" : "translateY(-50%)",
    left: pos.left,
    right: pos.right,
    width: 46,
    height: 46,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 101,
  };
}
