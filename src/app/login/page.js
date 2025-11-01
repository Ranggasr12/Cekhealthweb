"use client";

import { useState, useEffect } from "react";
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
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Card,
  CardBody,
  HStack,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );

      const user = userCredential.user;
      
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang ${user.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error) {
      let errorMessage = "Login gagal. Silakan coba lagi.";
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Email atau password salah.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Email tidak terdaftar.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Password salah.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Terlalu banyak percobaan login. Silakan coba lagi nanti.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Format email tidak valid.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Koneksi internet bermasalah. Silakan cek koneksi Anda.";
      }

      toast({
        title: "Login Gagal",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Box minH="100vh" bg="gray.50" py={10}>
        <Container maxW="md">
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Spinner size="lg" color="purple.500" />
                <Text>Loading...</Text>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size="xl" color="purple.600" mb={2}>
              Login
            </Heading>
            <Text color="gray.600">
              Masuk ke akun Anda untuk mengakses layanan kesehatan
            </Text>
          </Box>

          <Card w="full" shadow="md">
            <CardBody>
              <VStack as="form" spacing={6} onSubmit={handleLogin}>
                {/* Email Input */}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="masukkan email Anda"
                    size="lg"
                    autoComplete="email"
                  />
                </FormControl>

                {/* Password Input */}
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: "transparent" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Login Button */}
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="purple"
                  isLoading={loading}
                  loadingText="Sedang masuk..."
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.2s"
                >
                  Masuk
                </Button>

                {/* Register Link */}
                <HStack justify="center" spacing={1}>
                  <Text color="gray.600">Belum punya akun?</Text>
                  <Link 
                    href="/register" 
                    color="purple.500"
                    fontWeight="medium"
                    _hover={{ color: "purple.600", textDecoration: "underline" }}
                  >
                    Daftar di sini
                  </Link>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}