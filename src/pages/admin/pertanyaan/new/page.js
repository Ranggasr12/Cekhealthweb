"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Input, Button, Select, Textarea, VStack } from "@chakra-ui/react";

export default function NewPertanyaan() {
  const router = useRouter();
  const [pertanyaan, setPertanyaan] = useState("");
  const [kategori, setKategori] = useState("");
  const [tipeJawaban, setTipeJawaban] = useState("pilihan");
  const [pilihan, setPilihan] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await supabase.from("pertanyaan").insert({
      pertanyaan,
      kategori,
      tipe_jawaban: tipeJawaban,
      pilihan: tipeJawaban === "pilihan" ? pilihan.split(",").map((s) => s.trim()) : null
    });

    router.push("/admin/pertanyaan");
  }

  return (
    <VStack spacing={4} maxW="600px">
      <Textarea placeholder="Tulis pertanyaan" value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} required />

      <Input placeholder="Kategori (opsional)" value={kategori} onChange={(e) => setKategori(e.target.value)} />

      <Select value={tipeJawaban} onChange={(e) => setTipeJawaban(e.target.value)}>
        <option value="pilihan">Jawaban Pilihan</option>
        <option value="input">Jawaban Teks Bebas</option>
      </Select>

      {tipeJawaban === "pilihan" && (
        <Input placeholder='Masukkan pilihan, pisahkan dengan koma (contoh: Ya, Tidak, Kadang)'
          value={pilihan} onChange={(e) => setPilihan(e.target.value)} />
      )}

      <Button colorScheme="purple" w="full" onClick={handleSubmit}>Simpan</Button>
    </VStack>
  );
}

