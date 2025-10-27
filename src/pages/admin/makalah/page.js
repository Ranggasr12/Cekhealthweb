"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Button, Table, Thead, Tr, Th, Td, Tbody, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function MakalahPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from("makalah").select("*").then(({ data }) => setData(data));
  }, []);

  return (
    <Box>
      <Heading mb={4}>Kelola Makalah</Heading>

      <Button as={Link} href="/admin/makalah/tambah" colorScheme="blue" mb={4}>
        + Tambah Makalah
      </Button>
      <Button colorScheme="red" size="sm" onClick={() => supabase.from("makalah").delete().eq("id", row.id).then(()=>location.reload())}>
  Hapus
</Button>

      <Table bg="white" borderRadius="md" shadow="md">
        <Thead>
          <Tr>
            <Th>Judul</Th>
            <Th>File</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.id}>
              <Td>{row.title}</Td>
              <Td><a href={row.file_url} target="_blank">Lihat</a></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
