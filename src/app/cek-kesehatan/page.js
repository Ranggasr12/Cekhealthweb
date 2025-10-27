"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function CekKesehatan() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  async function loadQuestions() {
    let { data } = await supabase
      .from("questions")
      .select("id, question_text, answers(id, answer_text, score)");
    setQuestions(data || []);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function handleSelect(question_id, score) {
    setAnswers({ ...answers, [question_id]: score });
  }

  function submit() {
    router.push(`/cek-kesehatan/hasil?data=${JSON.stringify(answers)}`);
  }

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <Heading mb={6}>Cek Kesehatan</Heading>

      <VStack spacing={6} align="stretch">
        {questions.map((q) => (
          <Box key={q.id} p={4} borderWidth="1px" rounded="md">
            <Text fontWeight="bold" mb={3}>{q.question_text}</Text>
            <RadioGroup onChange={(v) => handleSelect(q.id, parseInt(v))}>
              <Stack direction="column">
                {q.answers.map((a) => (
                  <Radio key={a.id} value={a.score}>{a.answer_text}</Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        ))}
      </VStack>

      <Button mt={8} colorScheme="purple" onClick={submit}>
        Lihat Hasil
      </Button>
    </Box>
  );
}
