"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Link,
  Flex,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Starting registration...", { email, fullName });

      // 1. Check if email already exists in profiles
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email);

      if (checkError) {
        console.error("❌ Check existing user error:", checkError);
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Email sudah terdaftar");
      }

      // 2. Create auth user - biarkan trigger handle profile creation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
          },
          // Opsional: disable email confirmation untuk development
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error("❌ Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Gagal membuat user auth");
      }

      console.log("✅ Auth user created:", authData.user.id);
      console.log("📧 Email confirmation sent:", authData.user.identities?.[0]?.identity_data);

      // 3. TUNGGU trigger Supabase membuat profile (tidak perlu buat manual)
      console.log("⏳ Waiting for Supabase trigger to create profile...");

      // 4. Success - tidak perlu buat profile manual
      toast({
        title: "Registrasi Berhasil!",
        description: "Silakan cek email Anda untuk verifikasi akun",
        status: "success",
        duration: 8000,
        isClosable: true,
      });

      // Redirect ke halaman sukses atau info
      setTimeout(() => {
        router.push("/register-success");
      }, 2000);

    } catch (error) {
      console.error("🎯 Registration failed:", error);
      
      let errorMessage = error.message;
      
      if (error.message.includes("duplicate key") || error.message.includes("23505")) {
        errorMessage = "Email sudah terdaftar. Silakan login atau gunakan email lain.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Email sudah terdaftar.";
      }
      
      toast({
        title: "Registrasi Gagal",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Flex direction="column" align="center" justify="center" minH="80vh">
        <Box
          w="full"
          p={8}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center" color="purple.600">
              Daftar Akun Baru
            </Heading>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Setelah registrasi, silakan cek email untuk verifikasi akun
              </Text>
            </Alert>

            <form onSubmit={handleRegister} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    size="lg"
                    minLength={6}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Mendaftarkan..."
                >
                  Daftar
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Sudah punya akun?{" "}
              <Link href="/login" color="purple.600" fontWeight="bold">
                Login di sini
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}