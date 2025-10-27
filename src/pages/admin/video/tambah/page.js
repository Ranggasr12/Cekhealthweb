"use client";
import {
  Box,
  Button,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function QuestionCRUD() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [answers, setAnswers] = useState([{ answer_text: "", score: 0 }]);

  async function loadData() {
    let { data: cat } = await supabase.from("categories").select("*");
    setCategories(cat || []);

    let { data: q } = await supabase
      .from("questions")
      .select("id, question_text, category_id, categories(name)");
    setQuestions(q || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateAnswer(index, key, value) {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
  }

  function addAnswerField() {
    setAnswers([...answers, { answer_text: "", score: 0 }]);
  }

  async function addQuestion() {
    if (!newQuestion || !selectedCategory) return;

    const { data: qInserted, error } = await supabase
      .from("questions")
      .insert([{ question_text: newQuestion, category_id: selectedCategory }])
      .select("id")
      .single();

    if (error) return toast({ title: "Gagal menambahkan pertanyaan", status: "error" });

    for (const ans of answers) {
      if (ans.answer_text.trim() === "") continue;
      await supabase.from("answers").insert([
        { question_id: qInserted.id, answer_text: ans.answer_text, score: ans.score }
      ]);
    }

    setNewQuestion("");
    setAnswers([{ answer_text: "", score: 0 }]);
    loadData();
    toast({ title: "Pertanyaan berhasil ditambahkan", status: "success" });
  }

  async function deleteQuestion(id) {
    await supabase.from("questions").delete().eq("id", id);
    loadData();
    toast({ title: "Pertanyaan dihapus", status: "info" });
  }

  return (
    <AdminLayout>
      <Box bg="white" p={6} rounded="md" shadow="md">
        <VStack spacing={4} align="stretch">
          <Select
            placeholder="Pilih Kategori"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>

          <Textarea
            placeholder="Tulis pertanyaan..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />

          <Box>
            {answers.map((ans, i) => (
              <HStack key={i} mb={2}>
                <Input
                  placeholder="Jawaban..."
                  value={ans.answer_text}
                  onChange={(e) => updateAnswer(i, "answer_text", e.target.value)}
                />
                <Input
                  type="number"
                  width="90px"
                  value={ans.score}
                  onChange={(e) => updateAnswer(i, "score", e.target.value)}
                />
              </HStack>
            ))}
            <Button size="sm" onClick={addAnswerField}>
              + Tambah Jawaban
            </Button>
          </Box>

          <Button colorScheme="purple" onClick={addQuestion}>
            Simpan Pertanyaan
          </Button>
        </VStack>
      </Box>

      <Box mt={8} bg="white" p={6} shadow="md" rounded="md">
        <Table>
          <Thead>
            <Tr>
              <Th>Pertanyaan</Th>
              <Th>Kategori</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map((q) => (
              <Tr key={q.id}>
                <Td>{q.question_text}</Td>
                <Td>{q.categories?.name}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => deleteQuestion(q.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </AdminLayout>
  );
}
