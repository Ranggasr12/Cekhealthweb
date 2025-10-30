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
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast({
        title: 'Password tidak cocok',
        description: 'Password dan konfirmasi password harus sama',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password terlalu pendek',
        description: 'Password minimal 6 karakter',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: 'Email tidak valid',
        description: 'Format email harus benar',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Register attempt...", { email: email.trim() });

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: email.split('@')[0]
          }
        },
      });

      if (error) {
        console.error("❌ Registration error:", error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Email sudah terdaftar',
            description: 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.',
            status: 'error',
            duration: 5000,
          });
          return;
        }
        
        throw error;
      }

      console.log("✅ Registration response:", data);

      // Check if user was actually created
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: 'Email sudah terdaftar',
          description: 'Email ini sudah terdaftar. Silakan login.',
          status: 'warning',
          duration: 5000,
        });
        return;
      }

      toast({
        title: 'Registrasi Berhasil! 🎉',
        description: 'Silakan cek email Anda (termasuk folder spam) untuk verifikasi akun',
        status: 'success',
        duration: 7000,
      });

      // Auto-create profile
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              role: 'user',
              full_name: data.user.email.split('@')[0],
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.log('Note: Profile creation skipped (might already exist)');
          }
        } catch (profileError) {
          console.log('Note: Profile creation not critical');
        }
      }

      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after success
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      console.error("❌ Registration failed:", error);
      toast({
        title: 'Registrasi Gagal',
        description: error.message || 'Terjadi kesalahan saat registrasi',
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
            Daftar Akun Baru
          </Heading>
          <Text color="gray.600">
            Buat akun untuk mulai menggunakan CekHealth
          </Text>
        </Box>

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
                  autoComplete="email"
                  isDisabled={loading}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    isDisabled={loading}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Konfirmasi Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    isDisabled={loading}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Mendaftarkan..."
                isDisabled={!email || !password || !confirmPassword}
                bgGradient="linear(to-r, purple.500, pink.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                }}
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

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Informasi Penting:</Text>
            <Text fontSize="sm">• Password minimal 6 karakter</Text>
            <Text fontSize="sm">• Verifikasi email akan dikirim setelah pendaftaran</Text>
            <Text fontSize="sm">• Cek folder spam jika email tidak ditemukan</Text>
          </Box>
        </Alert>
      </VStack>
    </Container>
  );
}