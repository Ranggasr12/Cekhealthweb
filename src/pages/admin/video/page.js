"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VideoAdmin() {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("video").select("*").order("id", { ascending: false });
    setVideo(data);
  }

  async function del(id) {
    await supabase.from("video").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <a href="/admin/video/tambah">
        <button style={{ marginBottom: 20 }}>➕ Tambah Video</button>
      </a>

      {video.map((v) => (
        <div key={v.id} style={{
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 12
        }}>
          <h3>{v.judul}</h3>
          <p>{v.deskripsi}</p>

          {v.youtube_url && (
            <p>🎥 <a href={v.youtube_url} target="_blank">Lihat di YouTube</a></p>
          )}

          {v.file_url && (
            <video src={v.file_url} width="300" controls />
          )}

          <button onClick={() => del(v.id)} style={{ marginTop: 10, color: "red" }}>
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}
