"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MakalahAdmin() {
  const [makalah, setMakalah] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("makalah").select("*");
    setMakalah(data);
  }

  async function del(id) {
    await supabase.from("makalah").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <a href="/admin/makalah/tambah">
        <button>Tambah Makalah</button>
      </a>

      {makalah.map((m) => (
        <div key={m.id}>
          <h3>{m.judul}</h3>
          <p>{m.deskripsi}</p>
          <a href={m.file_url} target="_blank">Download</a>
          <button onClick={() => del(m.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
