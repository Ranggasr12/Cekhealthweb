"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td,
  Heading, Flex, useToast
} from "@chakra-ui/react";
import Link from "next/link";

export default function VideoAdmin() {
  const [videos, setVideos] = useState([]);
  const toast = useToast();

  const load = async () => {
    const { data } = await supabase.from("video").select("*").order("id", { ascending: false });
    setVideos(data || []);
  };

  const deleteVideo = async (id) => {
    await supabase.from("video").delete().eq("id", id);
    toast({ title: "Video dihapus!", status: "success" });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <Box bg="gray.800" color="white" p={6} borderRadius="lg" shadow="lg">
      <Flex justify="space-between" mb={4}>
        <Heading size="lg">Kelola Video</Heading>
        <Link href="/admin/video/tambah">
          <Button colorScheme="purple">Tambah Video</Button>
        </Link>
      </Flex>

      <Table variant="simple" color="white">
        <Thead bg="gray.700">
          <Tr>
            <Th color="white">Judul</Th>
            <Th color="white">Tipe</Th>
            <Th color="white">Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {videos.map((v) => (
            <Tr key={v.id}>
              <Td>{v.title}</Td>
              <Td>{v.source_type === "file" ? "File" : "YouTube"}</Td>
              <Td>
                <Flex gap={3}>
                  <Link href={`/admin/video/edit/${v.id}`}>
                    <Button size="sm" colorScheme="blue">Edit</Button>
                  </Link>
                  <Button size="sm" colorScheme="red" onClick={() => deleteVideo(v.id)}>Hapus</Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
