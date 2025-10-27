"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

export default function Hasil() {
  const params = useSearchParams();
  const [result, setResult] = useState(null);

  async function processResult() {
    const answers = JSON.parse(params.get("data"));
    let total = Object.values(answers).reduce((a, b) => a + b, 0);

    let { data: categories } = await supabase.from("categories").select("*");

    const diagnosis = categories.find(
      (c) => total >= c.min_score && total <= c.max_score
    );

    setResult({ total, ...diagnosis });
  }

  useEffect(() => {
    processResult();
  }, []);

  if (!result) return "Mengolah hasil...";

  return (
    <Box maxW="700px" mx="auto" p={6} textAlign="center">
      <Heading mb={3}>Hasil Pemeriksaan</Heading>
      <Text fontSize="xl" fontWeight="bold">{result.name}</Text>
      <Text mt={4}>{result.suggestion}</Text>

      <VStack mt={6}>
        {result.related_video && (
          <Button as="a" href={result.related_video} colorScheme="purple" target="_blank">
            Lihat Video Terkait
          </Button>
        )}
        {result.related_paper && (
          <Button as="a" href={result.related_paper} colorScheme="gray" target="_blank">
            Baca Makalah
          </Button>
        )}
      </VStack>

      <Button mt={8} onClick={() => window.print()} colorScheme="green">
        Download PDF
      </Button>
    </Box>
  );
}
