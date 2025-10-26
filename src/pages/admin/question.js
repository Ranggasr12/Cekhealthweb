import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box, Heading, Input, Textarea, Button, VStack, Table, Thead, Tbody, Tr, Th, Td, useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ensureAdmin } from "@/utils/checkAdmin";

export default function AdminQuestions() {
  const [question, setQuestion] = useState("");
  const [list, setList] = useState([]);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const ok = await ensureAdmin();
      if (!ok.ok) return router.push("/login");
      await loadList();
    })();
  }, []);

  async function loadList() {
    const { data, error } = await supabase.from("questions").select("*").order("created_at", { ascending: false });
    if (error) return toast({ title: "Gagal memuat", status: "error" });
    setList(data || []);
  }

  async function handleCreate() {
    if (!question) return toast({ title: "Isi pertanyaan", status: "warning" });
    const { error } = await supabase.from("questions").insert([{ question }]);
    if (error) return toast({ title: "Gagal", description: error.message, status: "error" });
    toast({ title: "Tersimpan", status: "success" });
    setQuestion("");
    await loadList();
  }

  async function handleDelete(row) {
    const { error } = await supabase.from("questions").delete().eq("id", row.id);
    if (error) return toast({ title: "Gagal hapus", description: error.message, status: "error" });
    toast({ title: "Terhapus", status: "success" });
    await loadList();
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Kelola Pertanyaan</Heading>

      <VStack align="stretch" mb={6}>
        <Input placeholder="Masukkan pertanyaan" value={question} onChange={e => setQuestion(e.target.value)} />
        <Button colorScheme="purple" onClick={handleCreate}>Tambah Pertanyaan</Button>
      </VStack>

      <Heading size="md" mb={3}>Daftar Pertanyaan</Heading>
      <Table>
        <Thead><Tr><Th>Pertanyaan</Th><Th>Tgl</Th><Th>Aksi</Th></Tr></Thead>
        <Tbody>
          {list.map(q => (
            <Tr key={q.id}>
              <Td>{q.question}</Td>
              <Td>{new Date(q.created_at).toLocaleString()}</Td>
              <Td><Button size="sm" colorScheme="red" onClick={() => handleDelete(q)}>Hapus</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
