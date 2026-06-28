// Tokens de diseño compartidos por todo el sitio.
// Extraídos del componente original para mantener una sola fuente de verdad.

export const colors = {
  negro: "#0D0D0D",
  cian: "#00838F",
  naranja: "#FCA210",
  magenta: "#9C27B0",
  fuccia: "#D00487",
  verdeLima: "#DAFF21",
  amarilloLimon: "#F4FF21",
  blanco: "#FAFAFA",
  cream: "#F7F5F0",
};

// Alias corto, igual al que usaba el componente original (`c`).
export const c = colors;

export const fonts = {
  sans: "'Outfit', 'Segoe UI', sans-serif",
  mono: "'Space Mono', monospace",
};

export const maxWidth = 1200;

// Paleta del panel de administración. Vive aquí (módulo neutral) para que tanto
// los componentes de servidor como los de cliente puedan usarla.
export const admin = {
  bg: "#f5f6f8",
  panel: "#ffffff",
  border: "#e4e6ea",
  text: "#1c2430",
  muted: "#6b7480",
  primary: colors.cian,
  danger: "#d1455b",
};
