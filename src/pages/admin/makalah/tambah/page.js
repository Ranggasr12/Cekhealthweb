"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TambahMakalah() {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);

  async function submit(e) {
    e.preventDefault();

    const { data: upload } = await supabase.storage
      .from("files")
      .upload(`makalah/${file.name}`, file);

    await supabase.from("makalah").insert([
      { judul, deskripsi, file_url: upload.fullPath }
    ]);

    window.location.href = "/admin/makalah";
  }

  return (
    <form onSubmit={submit}>
      <input placeholder="Judul" onChange={(e) => setJudul(e.target.value)} />
      <textarea placeholder="Deskripsi" onChange={(e) => setDeskripsi(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button>Simpan</button>
    </form>
  );
}
