"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function KuesionerPage() {
  const router = useRouter();
  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("pertanyaan").select("*");
      setPertanyaan(data);
    }
    load();
  }, []);

  async function submit() {
    let totalSkor = 0;
    pertanyaan.forEach((p) => {
      const j = jawaban[p.id];
      if (j === "Ya") totalSkor += p.skor_ya;
      if (j === "Tidak") totalSkor += p.skor_tidak;
    });

    router.push(`/kuesioner/hasil?skor=${totalSkor}`);
  }

  return (
    <VStack align="start" spacing={6}>
      {pertanyaan.map((p) => (
        <div key={p.id}>
          <Text fontWeight="bold">{p.pertanyaan}</Text>

          <RadioGroup onChange={(v)=> setJawaban({...jawaban, [p.id]: v})}>
            <Stack direction="row">
              {p.pilihan?.map((opt)=>(
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        </div>
      ))}

      <Button colorScheme="green" onClick={submit}>Lihat Hasil</Button>
    </VStack>
  );
}
