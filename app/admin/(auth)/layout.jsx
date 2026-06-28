import { fonts } from "@/lib/theme";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: fonts.sans,
        background: "linear-gradient(135deg, #0D0D0D 0%, #10242a 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img src="/artboard01_hardbackground.png" alt="Saberes Científicos" style={{ width: 70, height: 70, objectFit: "contain" }} />
          <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginTop: 8 }}>Saberes Científicos</p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Panel de administración</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
