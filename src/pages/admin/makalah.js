"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import {
  Table, Thead, Tbody, Tr, Th, Td, Button,
  Input, Radio, RadioGroup, Stack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@chakra-ui/react";

export default function MakalahAdmin() {
  const [data, setData] = useState([]);
  const [judul, setJudul] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("upload"); // upload | link
  const [edit, setEdit] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function load() {
    const { data } = await supabase.from("makalah").select("*");
    setData(data || []);
  }

  useEffect(() => { load(); }, []);

  function add() {
    setEdit(null);
    setJudul("");
    setLink("");
    setFile(null);
    setMode("upload");
    onOpen();
  }

  async function save() {
    let file_url = link;

    if (mode === "upload" && file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from("makalah").upload(fileName, file);

      if (!error) {
        const publicUrl = supabase.storage.from("makalah").getPublicUrl(fileName).data.publicUrl;
        file_url = publicUrl;
      }
    }

    if (edit) {
      await supabase.from("makalah").update({ judul, file_url }).eq("id", edit);
    } else {
      await supabase.from("makalah").insert([{ judul, file_url }]);
    }

    load();
    onClose();
  }

  async function del(id) {
    await supabase.from("makalah").delete().eq("id", id);
    load();
  }

  function openEdit(m) {
    setEdit(m.id);
    setJudul(m.judul);
    setLink(m.file_url);
    setMode("link");
    onOpen();
  }

  return (
    <AdminLayout>
      <Button colorScheme="purple" onClick={add}>+ Tambah Makalah</Button>

      <Table mt={6} bg="white" shadow="md" rounded="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>#</Th>
            <Th>Judul</Th>
            <Th>File/Link</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((m, i) => (
            <Tr key={m.id}>
              <Td>{i + 1}</Td>
              <Td>{m.judul}</Td>
              <Td>
                <a href={m.file_url} target="_blank" rel="noreferrer" style={{ color: "blue" }}>
                  Buka
                </a>
              </Td>
              <Td>
                <Button size="sm" colorScheme="yellow" onClick={() => openEdit(m)}>Edit</Button>{" "}
                <Button size="sm" colorScheme="red" onClick={() => del(m.id)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{edit ? "Edit Makalah" : "Tambah Makalah"}</ModalHeader>
          <ModalBody>
            <Input placeholder="Judul Makalah" mb={3} value={judul} onChange={e => setJudul(e.target.value)} />

            <RadioGroup value={mode} onChange={setMode} mb={4}>
              <Stack direction="row">
                <Radio value="upload">Upload File</Radio>
                <Radio value="link">Link</Radio>
              </Stack>
            </RadioGroup>

            {mode === "upload" && (
              <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
            )}

            {mode === "link" && (
              <Input placeholder="URL File / Google Drive" value={link} onChange={e => setLink(e.target.value)} />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" onClick={save}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}
