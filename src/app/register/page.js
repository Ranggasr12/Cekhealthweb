"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box, Input, Button, Heading, VStack, FormControl, FormLabel, useToast
} from "@chakra-ui/react";

export default function RegisterPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    nomor_hp: "",
    alamat: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);

    // Cek email sudah terdaftar
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", form.email)
      .single();

    if (existing) {
      toast({ title: "Akun sudah ada", status: "error" });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { role: "user" } // default user
      }
    });

    if (error) {
      toast({ title: error.message, status: "error" });
      setLoading(false);
      return;
    }

    // Simpan data ke tabel profiles
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        nama: form.nama,
        nomor_hp: form.nomor_hp,
        alamat: form.alamat,
      }
    ]);

    toast({ title: "Register berhasil. Silakan login.", status: "success" });
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">Register</Heading>

      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Nama</FormLabel>
          <Input name="nama" onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Nomor HP</FormLabel>
          <Input name="nomor_hp" onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Alamat</FormLabel>
          <Input name="alamat" onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" onChange={handleChange} />
        </FormControl>

        <Button
          w="full"
          colorScheme="purple"
          isLoading={loading}
          onClick={handleRegister}
        >
          Register
        </Button>
      </VStack>
    </Box>
  );
}
