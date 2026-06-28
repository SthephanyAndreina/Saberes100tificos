// Convierte un texto en un "slug" apto para URLs (sin acentos ni símbolos).
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(text) {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(DIACRITICS, "") // quitar acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
