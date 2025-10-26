import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Box, Input, Button, Heading, useToast } from "@chakra-ui/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return toast({ title: error.message, status: "error" });

    // Tambahkan sebagai user biasa
    await supabase.from("profiles").insert({ id: data.user.id, role: "user" });

    toast({ title: "Pendaftaran berhasil!", status: "success" });
  };

  return (
    <Box maxW="md" mx="auto" mt="100px">
      <Heading mb={4}>Register</Heading>
      <Input placeholder="Email" mb={3} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" mb={3} onChange={(e) => setPassword(e.target.value)} />
      <Button colorScheme="green" onClick={handleRegister}>Register</Button>
    </Box>
  );
}
