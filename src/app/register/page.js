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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Password dan konfirmasi password tidak cocok',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password minimal 6 karakter',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Register attempt...", { email });

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("❌ Registration error:", error);
        throw error;
      }

      console.log("✅ Registration successful:", data);

      toast({
        title: 'Registrasi Berhasil!',
        description: 'Silakan cek email Anda untuk verifikasi',
        status: 'success',
        duration: 5000,
      });

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error("❌ Registration failed:", error);
      toast({
        title: 'Registrasi Gagal',
        description: error.message,
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
            Daftar Akun
          </Heading>
          <Text color="gray.600">
            Buat akun baru untuk mengakses CekHealth
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            Setelah registrasi, silakan cek email untuk verifikasi akun
          </Text>
        </Alert>

        <Box w="100%" maxW="400px">
          <form onSubmit={handleRegister}>
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
                  placeholder="Minimal 6 karakter"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Konfirmasi Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  size="lg"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="100%"
                isLoading={loading}
              >
                Daftar
              </Button>
            </VStack>
          </form>

          <Text mt={4} textAlign="center">
            Sudah punya akun?{' '}
            <Link href="/login" color="purple.500" fontWeight="bold">
              Login di sini
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}