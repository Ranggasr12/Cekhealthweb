"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TambahVideo() {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState(null);

  async function submit(e) {
    e.preventDefault();
    let file_url = null;

    if (file) {
      const { data: upload } = await supabase.storage
        .from("files")
        .upload(`video/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      const { data } = supabase.storage.from("files").getPublicUrl(upload.path);
      file_url = data.publicUrl;
    }

    await supabase.from("video").insert([
      { judul, deskripsi, youtube_url: youtubeUrl, file_url }
    ]);

    window.location.href = "/admin/video";
  }

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"12px", maxWidth:"400px" }}>
      <input placeholder="Judul" required onChange={(e) => setJudul(e.target.value)} />
      <textarea placeholder="Deskripsi" required onChange={(e) => setDeskripsi(e.target.value)} />

      <input placeholder="Link YouTube (opsional)" onChange={(e) => setYoutubeUrl(e.target.value)} />

      <label>Upload File Video (opsional)</label>
      <input type="file" accept="video/mp4" onChange={(e) => setFile(e.target.files[0])} />

      <button type="submit" style={{ marginTop: 10 }}>Simpan</button>
    </form>
  );
}
