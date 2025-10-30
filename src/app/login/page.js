"use client";

import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Link,
  useToast,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

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
        
        // Handle specific errors
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: 'Email Belum Diverifikasi',
            description: 'Silakan cek email Anda untuk verifikasi akun',
            status: 'error',
            duration: 5000,
          });
          return;
        }
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: 'Login Gagal',
            description: 'Email atau password salah',
            status: 'error',
            duration: 5000,
          });
          return;
        }
        
        throw error;
      }

      console.log("✅ Login successful:", data);

      toast({
        title: 'Login Berhasil!',
        description: 'Selamat datang di CekHealth',
        status: 'success',
        duration: 3000,
      });

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();

    } catch (error) {
      console.error("❌ Login failed:", error);
      toast({
        title: 'Login Gagal',
        description: error.message || 'Terjadi kesalahan saat login',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="xl" color="purple.600" mb={2}>
            Masuk ke Akun
          </Heading>
          <Text color="gray.600">
            Masuk untuk mengakses dashboard CekHealth
          </Text>
        </Box>

        <Box w="100%" maxW="400px">
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  size="lg"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  size="lg"
                  autoComplete="current-password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Masuk..."
              >
                Masuk
              </Button>
            </VStack>
          </form>

          <Text mt={4} textAlign="center">
            Belum punya akun?{' '}
            <Link href="/register" color="purple.500" fontWeight="bold">
              Daftar di sini
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}