"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Button, Input, Textarea, Heading, VStack } from "@chakra-ui/react";
import { useRouter, useParams } from "next/navigation";

export default function EditMakalah() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    supabase.from("makalah").select("*").eq("id", id).single().then(({ data }) => setData(data));
  }, [id]);

  const handleUpdate = async () => {
    let fileURL = data.file_url;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      await supabase.storage.from("dokumen-makalah").upload(fileName, file);
      fileURL = supabase.storage.from("dokumen-makalah").getPublicUrl(fileName).data.publicUrl;
    }

    await supabase.from("makalah").update({
      title: data.title,
      description: data.description,
      file_url: fileURL
    }).eq("id", id);

    router.push("/admin/makalah");
  };

  return (
    <Box bg="white" p={6} shadow="md" borderRadius="md" maxW="600px">
      <Heading size="lg" mb={4}>Edit Makalah</Heading>
      <VStack spacing={4}>
        <Input value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <Textarea value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button colorScheme="blue" w="full" onClick={handleUpdate}>Update</Button>
      </VStack>
    </Box>
  );
}
