"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box, Container, Heading, FormControl, FormLabel, Input,
  Button, VStack, Text, useToast
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        status: "error",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        toast({
          title: "Registrasi berhasil!",
          description: "Silakan login dengan akun Anda",
          status: "success",
          duration: 4000,
        });
        
        // Redirect to login page
        router.push("/login");
      }

    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registrasi gagal",
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
          Daftar Akun
        </Heading>

        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                minLength={6}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Konfirmasi Password</FormLabel>
              <Input 
                name="confirmPassword" 
                type="password" 
                value={form.confirmPassword} 
                onChange={handleChange}
                placeholder="Ulangi password"
              />
            </FormControl>

            <Button type="submit" colorScheme="purple" width="full" isLoading={loading}>
              Daftar
            </Button>
          </VStack>
        </form>

        <Text mt={4} textAlign="center">
          Sudah punya akun?{" "}
          <Link href="/login" style={{ color: "purple", fontWeight: "bold" }}>
            Login di sini
          </Link>
        </Text>
      </Box>
    </Container>
  );
}