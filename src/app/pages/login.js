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
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Harap isi email dan password',
        status: 'warning',
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      console.log("🔐 Login attempt...", { 
        email: email.trim(),
        passwordLength: password.length 
      });

      setDebugInfo('Mencoba login...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Convert to lowercase
        password: password.trim(),
      });

      if (error) {
        console.error("❌ Login error:", error);
        setDebugInfo(`Error: ${error.message}`);
        
        // Handle specific errors
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: 'Login Gagal',
            description: 'Email atau password salah. Pastikan akun sudah terdaftar.',
            status: 'error',
            duration: 5000,
          });
          return;
        }
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: 'Email Belum Diverifikasi',
            description: 'Silakan cek email Anda untuk verifikasi akun',
            status: 'warning',
            duration: 5000,
          });
          return;
        }
        
        if (error.message.includes("Too many requests")) {
          toast({
            title: 'Terlalu Banyak Percobaan',
            description: 'Tunggu beberapa saat sebelum mencoba lagi',
            status: 'warning',
            duration: 5000,
          });
          return;
        }
        
        throw error;
      }

      console.log("✅ Login successful:", data);
      setDebugInfo('Login berhasil! Mengarahkan...');

      toast({
        title: 'Login Berhasil!',
        description: 'Selamat datang di CekHealth',
        status: 'success',
        duration: 3000,
      });

      // Redirect to appropriate page based on user role
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error("❌ Login failed:", error);
      setDebugInfo(`Login gagal: ${error.message}`);
      
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

  const handleDemoLogin = async () => {
    setEmail('demo@cekhealth.com');
    setPassword('demopassword123');
    
    toast({
      title: 'Demo credentials diisi',
      description: 'Klik Login untuk mencoba',
      status: 'info',
      duration: 3000,
    });
  };

  const handleTestAdminLogin = async () => {
    setEmail('admin@cekhealth.com');
    setPassword('admin123');
    
    toast({
      title: 'Admin credentials diisi',
      description: 'Klik Login untuk mencoba',
      status: 'info',
      duration: 3000,
    });
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

        {/* Demo Buttons - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <VStack spacing={2} w="100%">
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={handleDemoLogin}
              w="100%"
            >
              Isi Demo User
            </Button>
            <Button
              size="sm"
              colorScheme="green"
              variant="outline"
              onClick={handleTestAdminLogin}
              w="100%"
            >
              Isi Demo Admin
            </Button>
          </VStack>
        )}

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
                    placeholder="Masukkan password"
                    autoComplete="current-password"
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

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Memproses..."
                isDisabled={!email || !password}
                bgGradient="linear(to-r, purple.500, pink.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                }}
              >
                {loading ? <Spinner size="sm" /> : 'Masuk'}
              </Button>
            </VStack>
          </form>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <Alert status="info" mt={4} size="sm">
              <AlertIcon />
              <Text fontSize="sm">{debugInfo}</Text>
            </Alert>
          )}

          <Text mt={4} textAlign="center">
            Belum punya akun?{' '}
            <Link href="/register" color="purple.500" fontWeight="bold">
              Daftar di sini
            </Link>
          </Text>

          <Text mt={2} textAlign="center" fontSize="sm" color="gray.500">
            Lupa password?{' '}
            <Link 
              href="#" 
              color="purple.400"
              onClick={() => toast({
                title: 'Fitur Reset Password',
                description: 'Fitur reset password sedang dalam pengembangan',
                status: 'info',
                duration: 3000,
              })}
            >
              Reset di sini
            </Link>
          </Text>
        </Box>

        {/* Demo Accounts Info */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Akun Demo:</Text>
            <Text fontSize="sm">Admin: admin@cekhealth.com / admin123</Text>
            <Text fontSize="sm">User: demo@cekhealth.com / demopassword123</Text>
          </Box>
        </Alert>
      </VStack>
    </Container>
  );
}