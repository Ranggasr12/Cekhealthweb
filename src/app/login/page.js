"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box, Container, Heading, FormControl, FormLabel, Input,
  Button, VStack, Text, useToast
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      const user = authData?.user;
      if (!user) throw new Error("User not found");

    const userId = authData.user?.id; 

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', userId)
  .single();


      toast({
        title: "Login berhasil!",
        status: "success",
        duration: 2000,
      });

      if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (error) {
      toast({
        title: "Login gagal",
        description: error.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Heading mb={6} textAlign="center" color="purple.600">
          Login
        </Heading>

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" value={form.password} onChange={handleChange} />
            </FormControl>

            <Button type="submit" colorScheme="purple" width="full" isLoading={loading}>
              Login
            </Button>
          </VStack>
        </form>

        <Text mt={4} textAlign="center">
          Belum punya akun?{" "}
          <Link href="/register" style={{ color: "purple", fontWeight: "bold" }}>
            Daftar di sini
          </Link>
        </Text>
      </Box>
    </Container>
  );
}
