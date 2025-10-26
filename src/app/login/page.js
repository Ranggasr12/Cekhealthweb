"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Box, Heading, Input, Button, VStack, useToast } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login gagal", description: error.message, status: "error" });
      return;
    }
    toast({ title: "Berhasil login", status: "success" });
    router.push("/admin"); // arahkan ke dashboard admin atau halaman utama
  };

  return (
    <Box p={8} maxW="sm" mx="auto" mt={16} boxShadow="lg" borderRadius="xl">
      <Heading mb={6} textAlign="center">Login</Heading>
      <VStack spacing={4}>
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="purple" width="full" onClick={handleLogin}>Login</Button>
        <Button variant="link" onClick={() => router.push("/register")}>
          Belum punya akun? Daftar di sini
        </Button>
      </VStack>
    </Box>
  );
}
