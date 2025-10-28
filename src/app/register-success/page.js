"use client";

import {
  Container,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  Flex,
  Link
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function RegisterSuccess() {
  const router = useRouter();

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
          textAlign="center"
        >
          <VStack spacing={6}>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Text fontWeight="bold">Registrasi Berhasil!</Text>
            </Alert>

            <Heading size="lg" color="purple.600">
              Cek Email Anda
            </Heading>

            <Text color="gray.600">
              Kami telah mengirim link verifikasi ke email Anda. 
              Silakan cek inbox (dan folder spam) untuk mengaktifkan akun.
            </Text>

            <Text fontSize="sm" color="gray.500">
              Setelah verifikasi, Anda dapat login ke akun Anda.
            </Text>

            <VStack spacing={3} w="full">
              <Button
                colorScheme="purple"
                w="full"
                onClick={() => router.push("/login")}
              >
                Ke Halaman Login
              </Button>
              
              <Button
                variant="outline"
                w="full"
                onClick={() => router.push("/")}
              >
                Kembali ke Beranda
              </Button>
            </VStack>

            <Text fontSize="sm" color="gray.500">
              Tidak menerima email?{" "}
              <Link href="/register" color="purple.600" fontWeight="bold">
                Coba daftar ulang
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}