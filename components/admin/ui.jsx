"use client";

import { colors as c, fonts, admin } from "@/lib/theme";

// Reexportamos la paleta para los componentes cliente que la importan desde aquí.
export { admin };

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: 13, fontWeight: 700, color: admin.text, marginBottom: 6, fontFamily: fonts.sans }}>
      {children}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "11px 13px",
        borderRadius: 10,
        border: `1.5px solid ${admin.border}`,
        fontSize: 14.5,
        fontFamily: fonts.sans,
        outline: "none",
        background: "#fff",
        color: admin.text,
        ...(props.style || {}),
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = admin.primary)}
      onBlur={(e) => (e.currentTarget.style.borderColor = admin.border)}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "11px 13px",
        borderRadius: 10,
        border: `1.5px solid ${admin.border}`,
        fontSize: 14.5,
        fontFamily: fonts.sans,
        outline: "none",
        background: "#fff",
        color: admin.text,
        resize: "vertical",
        minHeight: 90,
        lineHeight: 1.6,
        ...(props.style || {}),
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = admin.primary)}
      onBlur={(e) => (e.currentTarget.style.borderColor = admin.border)}
    />
  );
}

export function Button({ children, variant = "primary", style, ...rest }) {
  const variants = {
    primary: { background: admin.primary, color: "#fff", border: "none" },
    dark: { background: c.negro, color: "#fff", border: "none" },
    ghost: { background: "#fff", color: admin.text, border: `1.5px solid ${admin.border}` },
    danger: { background: "#fff", color: admin.danger, border: `1.5px solid ${admin.danger}55` },
  };
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        opacity: rest.disabled ? 0.6 : 1,
        fontFamily: fonts.sans,
        ...variants[variant],
        ...(style || {}),
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: admin.panel, border: `1px solid ${admin.border}`, borderRadius: 16, padding: 24, ...(style || {}) }}>
      {children}
    </div>
  );
}

export function Banner({ kind = "info", children }) {
  if (!children) return null;
  const palette = {
    info: { bg: "#eef6f7", color: "#0b6b74", border: "#bfe3e6" },
    error: { bg: "#fdecef", color: "#b3243c", border: "#f5c2cc" },
    success: { bg: "#eafaef", color: "#1c7a3f", border: "#bfe8cd" },
  }[kind];
  return (
    <div style={{ background: palette.bg, color: palette.color, border: `1px solid ${palette.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 13.5, fontWeight: 600, fontFamily: fonts.sans }}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: admin.text, fontFamily: fonts.sans }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: admin.muted, marginTop: 4, fontFamily: fonts.sans }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
