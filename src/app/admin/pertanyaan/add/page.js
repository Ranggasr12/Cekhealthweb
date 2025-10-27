"use client";
import { useState } from "react";
import { Box, Input, Select, Heading, Button, Textarea } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddQuestion() {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("yesno");
  const [options, setOptions] = useState("");

  const router = useRouter();

  async function save() {
    await supabase.from("questions").insert({
      category,
      question,
      type,
      options: type === "choice" ? options.split(",") : null
    });

    router.push("/admin/questions");
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Tambah Pertanyaan</Heading>

      <Input placeholder="Kategori" mb={3} value={category} onChange={e => setCategory(e.target.value)} />

      <Textarea placeholder="Teks Pertanyaan" mb={3} value={question} onChange={e => setQuestion(e.target.value)} />

      <Select mb={3} value={type} onChange={e => setType(e.target.value)}>
        <option value="yesno">Yes / No</option>
        <option value="choice">Pilihan Ganda</option>
        <option value="scale">Skala (1–5)</option>
      </Select>

      {type === "choice" && (
        <Input placeholder="Opsi (pisahkan dengan koma)" mb={3} value={options} onChange={e => setOptions(e.target.value)} />
      )}

      <Button colorScheme="blue" onClick={save}>Simpan</Button>
    </Box>
  );
}
