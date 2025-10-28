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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login berhasil!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        title: "Login gagal",
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
    <Container maxW="md" py={20}>
      <Box p={8} shadow="md" borderWidth={1} borderRadius={8}>
        <Heading mb={6} textAlign="center" color="purple.600">
          Login
        </Heading>
        
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
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="purple"
              width="full"
              size="lg"
              isLoading={loading}
              loadingText="Sedang login..."
              mt={4}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Text mt={6} textAlign="center">
          Belum punya akun?{' '}
          <Link color="purple.500" href="/register" fontWeight="bold">
            Daftar di sini
          </Link>
        </Text>
      </Box>
    </Container>
  );
}