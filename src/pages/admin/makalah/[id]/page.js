"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";
import { useRouter, useParams } from "next/navigation";

export default function EditMakalah() {
  const router = useRouter();
  const { id } = useParams();
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("makalah").select("*").eq("id", id).single();
      setJudul(data.judul);
      setPenulis(data.penulis);
    }
    load();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    await supabase.from("makalah").update({ judul, penulis }).eq("id", id);
    router.push("/admin/makalah");
  }

  async function handleDelete() {
    await supabase.from("makalah").delete().eq("id", id);
    router.push("/admin/makalah");
  }

  return (
    <Box maxW="500px">
      <Heading mb={6}>Edit Makalah</Heading>
      <form onSubmit={handleUpdate}>
        <VStack spacing={4}>
          <Input value={judul} onChange={(e) => setJudul(e.target.value)} />
          <Input value={penulis} onChange={(e) => setPenulis(e.target.value)} />
          <Button type="submit" colorScheme="blue" w="full">Update</Button>
          <Button onClick={handleDelete} colorScheme="red" w="full">
            Hapus
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
