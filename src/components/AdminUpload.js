// src/components/AdminUpload.jsx
import { useState } from "react";
import useUser from "@/lib/useuser";

export default function AdminUpload() {
  const { user } = useUser();
  const [type, setType] = useState("paper");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return alert("Login sebagai admin.");
    setLoading(true);

    try {
      if (type === "paper") {
        if (!file) throw new Error("Pilih file PDF.");
        const path = `papers/${Date.now()}_${file.name}`;
        const r = storageRef(storage, path);
        await uploadBytes(r, file);
        const url = await getDownloadURL(r);
        await addDoc(collection(db, "papers"), {
          title, description, fileUrl: url, createdAt: serverTimestamp(), createdBy: user.uid
        });
        alert("Makalah berhasil diupload.");
      }

      if (type === "video") {
        if (!videoUrl && !file) throw new Error("Masukkan URL video atau unggah file.");
        let url = videoUrl;
        if (file) {
          const path = `videos/${Date.now()}_${file.name}`;
          const r = storageRef(storage, path);
          await uploadBytes(r, file);
          url = await getDownloadURL(r);
        }
        await addDoc(collection(db, "videos"), {
          title, description, videoUrl: url, createdAt: serverTimestamp(), createdBy: user.uid
        });
        alert("Video berhasil ditambahkan.");
      }

      if (type === "question") {
        if (!text) throw new Error("Masukkan pertanyaan.");
        await addDoc(collection(db, "questions"), {
          text, options: null, answer: null, createdAt: serverTimestamp(), createdBy: user.uid
        });
        alert("Pertanyaan berhasil ditambahkan.");
      }

      setTitle(""); setDescription(""); setFile(null); setVideoUrl(""); setText("");
    } catch (err) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 720, display: "grid", gap: 8 }}>
      <label>
        Tipe:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="paper">Makalah (PDF)</option>
          <option value="video">Video (URL / Upload)</option>
          <option value="question">Pertanyaan</option>
        </select>
      </label>

      {(type === 'paper' || type === 'video') && (
        <>
          <label>
            Title:
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </label>
        </>
      )}

      {type === 'paper' && (
        <label>
          File (PDF):
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        </label>
      )}

      {type === 'video' && (
        <>
          <label>
            Video URL (YouTube) atau upload file:
            <input placeholder="https://youtube.com/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
          </label>
          <label>
            atau Upload video:
            <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
          </label>
        </>
      )}

      {type === 'question' && (
        <label>
          Pertanyaan:
          <textarea value={text} onChange={e => setText(e.target.value)} />
        </label>
      )}

      <button type="submit" disabled={loading}>{loading ? "Processing..." : "Submit"}</button>
    </form>
  );
}
