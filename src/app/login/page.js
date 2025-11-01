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
  Alert,
  AlertIcon,
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
        console.log("✅ User already logged in:", user.email);
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
      console.log("🔄 Attempting login with:", email);

      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );

      const user = userCredential.user;
      
      console.log("✅ Login successful:", user.email);
      
      toast({
        title: "Login Berhasil! 🎉",
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
      console.error("❌ Login error:", error.code, error.message);
      
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
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Login dengan email/password belum diaktifkan. Silakan hubungi administrator.";
        
        // Show detailed instructions
        toast({
          title: "Setup Required 🔧",
          description: "Email/Password auth perlu diaktifkan di Firebase Console",
          status: "warning",
          duration: 8000,
          isClosable: true,
        });
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
                {/* Demo Accounts Info */}
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Test Account
                    </Text>
                    <Text fontSize="sm">
                      Email: admin@cekhealth.com | Password: admin123
                    </Text>
                  </Box>
                </Alert>

                {/* Email Input */}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cekhealth.com"
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
                  loadingText="Logging in..."
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.2s"
                >
                  Login
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

          {/* Setup Instructions - Show if auth not enabled */}
          <Card w="full" bg="blue.50" borderColor="blue.200">
            <CardBody>
              <VStack align="start" spacing={3}>
                <Heading size="sm" color="blue.800">
                  Setup Instructions 🔧
                </Heading>
                <Text fontSize="sm" color="blue.700">
                  1. Buka <Link href="https://console.firebase.google.com/" color="blue.600" fontWeight="bold" isExternal>Firebase Console</Link>
                </Text>
                <Text fontSize="sm" color="blue.700">
                  2. Pilih project <strong>cekhealthweb</strong>
                </Text>
                <Text fontSize="sm" color="blue.700">
                  3. Authentication → Sign-in method → Email/Password → <strong>Enable</strong>
                </Text>
                <Text fontSize="sm" color="blue.700">
                  4. Users tab → Add user → Email: admin@cekhealth.com, Password: admin123
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}