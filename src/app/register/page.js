"use client";

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Link,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password minimal 6 karakter",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Create profile entry
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email.trim(),
              full_name: fullName,
              role: 'user'
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      toast({
        title: "Registrasi berhasil!",
        description: "Silakan cek email untuk verifikasi",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: "Registrasi gagal",
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
    <Container maxW="md" py={16}>
      <Box p={8} shadow="md" borderWidth={1} borderRadius={8}>
        <Heading mb={6} textAlign="center" color="purple.600">
          Daftar Akun
        </Heading>
        
        <form onSubmit={handleRegister}>
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
              width="full"
              size="lg"
              isLoading={loading}
              loadingText="Mendaftarkan..."
              mt={4}
            >
              Daftar
            </Button>
          </VStack>
        </form>

        <Text mt={6} textAlign="center">
          Sudah punya akun?{' '}
          <Link color="purple.500" href="/login" fontWeight="bold">
            Login di sini
          </Link>
        </Text>
      </Box>
    </Container>
  );
}