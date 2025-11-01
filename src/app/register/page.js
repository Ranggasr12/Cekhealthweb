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
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !fullName) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password harus minimal 6 karakter",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "Anda harus menyetujui syarat dan ketentuan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Attempting registration...");

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );

      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName.trim()
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        full_name: fullName.trim(),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log("✅ Registration successful:", user.email);
      
      toast({
        title: "Registrasi Berhasil!",
        description: "Akun Anda telah berhasil dibuat. Silakan login.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("❌ Registration error:", error);
      
      let errorMessage = "Registrasi gagal. Silakan coba lagi.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email sudah terdaftar. Silakan login.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Format email tidak valid.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password terlalu lemah.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Koneksi internet bermasalah. Silakan coba lagi.";
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
              Daftar
            </Heading>
            <Text color="gray.600">
              Buat akun baru untuk mengakses layanan kesehatan
            </Text>
          </Box>

          <Card w="full" shadow="md">
            <CardBody>
              <VStack as="form" spacing={6} onSubmit={handleRegister}>
                {/* Full Name Input */}
                <FormControl isRequired>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    size="lg"
                    autoComplete="name"
                  />
                </FormControl>

                {/* Email Input */}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
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
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
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

                {/* Confirm Password Input */}
                <FormControl isRequired>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password Anda"
                      autoComplete="new-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        _hover={{ bg: "transparent" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Terms Checkbox */}
                <FormControl isRequired>
                  <Checkbox
                    isChecked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    colorScheme="purple"
                  >
                    Saya menyetujui{" "}
                    <Link href="/terms" color="purple.500" fontWeight="medium">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" color="purple.500" fontWeight="medium">
                      Kebijakan Privasi
                    </Link>
                  </Checkbox>
                </FormControl>

                {/* Register Button */}
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="purple"
                  isLoading={loading}
                  loadingText="Mendaftarkan..."
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.2s"
                >
                  Daftar
                </Button>

                {/* Login Link */}
                <HStack justify="center" spacing={1}>
                  <Text color="gray.600">Sudah punya akun?</Text>
                  <Link 
                    href="/login" 
                    color="purple.500"
                    fontWeight="medium"
                    _hover={{ color: "purple.600", textDecoration: "underline" }}
                  >
                    Login di sini
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