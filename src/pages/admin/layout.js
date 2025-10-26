export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{
        width: "230px",
        background: "#1a1a1a",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Admin Panel</h2>
        <a href="/admin" style={{ display: "block", marginBottom: "10px" }}>Dashboard</a>
        <a href="/admin/makalah" style={{ display: "block", marginBottom: "10px" }}>Makalah</a>
        <a href="/admin/video" style={{ display: "block", marginBottom: "10px" }}>Video</a>
        <a href="/admin/pertanyaan" style={{ display: "block", marginBottom: "10px" }}>Pertanyaan</a>
      </aside>

      <main style={{ flex: 1, padding: "30px" }}>
        {children}
      </main>
    </div>
  );
}
