"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Button, Input, Textarea, Heading, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function TambahMakalah() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !file) {
      toast({ title: "Judul dan File wajib diisi!", status: "error" });
      return;
    }

    // Upload ke Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("dokumen-makalah")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Gagal upload file!", status: "error" });
      return;
    }

    const fileURL = supabase.storage
      .from("dokumen-makalah")
      .getPublicUrl(fileName).data.publicUrl;

    await supabase.from("makalah").insert([
      { title, description, file_url: fileURL }
    ]);

    toast({ title: "Makalah berhasil ditambahkan!", status: "success" });
    router.push("/admin/makalah");
  };

  return (
    <Box bg="white" p={6} shadow="md" borderRadius="md" maxW="600px">
      <Heading size="lg" mb={4}>Tambah Makalah</Heading>

      <VStack spacing={4}>
        <Input
          placeholder="Judul Makalah"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Deskripsi (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <Button colorScheme="blue" w="full" onClick={handleSubmit}>
          Simpan
        </Button>
      </VStack>
    </Box>
  );
}
