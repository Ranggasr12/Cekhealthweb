"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, useDisclosure
} from "@chakra-ui/react";

export default function VideoAdmin() {
  const [data, setData] = useState([]);
  const [judul, setJudul] = useState("");
  const [link, setLink] = useState("");
  const [edit, setEdit] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function load() {
    const { data } = await supabase.from("video").select("*");
    setData(data || []);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEdit(null);
    setJudul("");
    setLink("");
    onOpen();
  }

  async function save() {
    if (edit) {
      await supabase.from("video").update({ judul, link }).eq("id", edit);
    } else {
      await supabase.from("video").insert([{ judul, link }]);
    }
    load();
    onClose();
  }

  async function del(id) {
    await supabase.from("video").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <Button colorScheme="purple" onClick={openAdd}>+ Tambah Video</Button>

      <Table mt={6} bg="white" shadow="md" rounded="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>#</Th>
            <Th>Judul</Th>
            <Th>Preview</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((v, i) => (
            <Tr key={v.id}>
              <Td>{i + 1}</Td>
              <Td>{v.judul}</Td>
              <Td>
                <iframe width="180" height="100" src={v.link.replace("watch?v=", "embed/")} />
              </Td>
              <Td>
                <Button size="sm" colorScheme="yellow"
                  onClick={() => { setEdit(v.id); setJudul(v.judul); setLink(v.link); onOpen(); }}>
                  Edit
                </Button>{" "}
                <Button size="sm" colorScheme="red" onClick={() => del(v.id)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{edit ? "Edit Video" : "Tambah Video"}</ModalHeader>
          <ModalBody>
            <Input placeholder="Judul" mb={3} value={judul} onChange={e => setJudul(e.target.value)} />
            <Input placeholder="Link YouTube" value={link} onChange={e => setLink(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={save}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}
