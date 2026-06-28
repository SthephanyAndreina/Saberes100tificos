export const metadata = {
  title: "Administración · Saberes Científicos",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <div style={{ minHeight: "100vh", background: "#f5f6f8" }}>{children}</div>;
}
