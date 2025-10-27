"use client";
import { useEffect, useState } from "react";
import { Box, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const { data, error } = await supabase.from("questions").select("*");
    setQuestions(data);
  }

  async function deleteQuestion(id) {
    await supabase.from("questions").delete().eq("id", id);
    fetchQuestions();
  }

  if (!questions) return <Spinner />;

  return (
    <Box p={6}>
      <Heading mb={4}>Daftar Pertanyaan</Heading>
      <Link href="/admin/questions/add">
        <Button colorScheme="blue" mb={4}>Tambah Pertanyaan</Button>
      </Link>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Kategori</Th>
            <Th>Pertanyaan</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map(q => (
            <Tr key={q.id}>
              <Td>{q.category}</Td>
              <Td>{q.question}</Td>
              <Td>
                <Link href={`/admin/questions/edit/${q.id}`}>
                  <Button size="sm" colorScheme="yellow" mr={2}>Edit</Button>
                </Link>
                <Button size="sm" colorScheme="red" onClick={() => deleteQuestion(q.id)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
