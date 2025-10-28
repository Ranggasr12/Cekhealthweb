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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 Login attempt...", { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("❌ Login error:", error);
        
        // Handle email not verified
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Email belum diverifikasi. Silakan cek email Anda.");
        }
        
        throw error;
      }

      console.log("✅ Login successful:", data.user.id);

      toast({
        title: "Login Berhasil!",
        description: `Selamat datang ${data.user.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");

    } catch (error) {
      console.error("❌ Login failed:", error);
      
      toast({
        title: "Login Gagal",
        description: error.message,
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
              Login
            </Heading>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Pastikan email sudah diverifikasi sebelum login
              </Text>
            </Alert>

            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    size="lg"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Logging in..."
                >
                  Login
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Belum punya akun?{" "}
              <Link href="/register" color="purple.600" fontWeight="bold">
                Daftar di sini
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}