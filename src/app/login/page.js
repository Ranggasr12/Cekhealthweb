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
      console.log("🔄 Starting login process...");
      
      // 1. Sign in user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (authError) {
        console.error("❌ Auth error:", authError);
        throw authError;
      }

      const user = authData.user;
      console.log("✅ Login successful, user ID:", user.id);
      console.log("📧 User email:", user.email);

      // 2. Check user role from profiles table
      console.log("🔄 Checking user profile...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      console.log("📊 Profile response:", { profile, profileError });

      let userRole = 'user'; // Default role

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log("ℹ️ Profile doesn't exist, creating default profile...");
          
          // Create default profile
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: user.email?.split('@')[0] || 'User',
                role: 'user'
              }
            ]);

          if (createError) {
            console.error("❌ Error creating profile:", createError);
          } else {
            console.log("✅ Default profile created");
          }
        } else {
          console.error("❌ Other profile error:", profileError);
        }
      } else if (profile) {
        userRole = profile.role || 'user';
        console.log("🎯 User role found:", userRole);
      }

      console.log("🎯 Final user role before redirect:", userRole);

      toast({
        title: "Login berhasil!",
        status: "success",
        duration: 2000,
      });

      // 3. Redirect based on role
      if (userRole === 'admin') {
        console.log("🔄 Redirecting to ADMIN dashboard...");
        router.push("/admin");
      } else {
        console.log("🔄 Redirecting to USER dashboard...");
        router.push("/");
      }

    } catch (error) {
      console.error("❌ Login failed:", error);
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
              <Input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange}
                placeholder="ranggaputra1221@gmail.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange}
                placeholder="••••••••"
              />
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