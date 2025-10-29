"use client";

import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import AdminLayout from '@/components/AdminLayout';

export default function UsersManagement() {
  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading>Kelola Pengguna</Heading>
          <Text>Halaman untuk mengelola data pengguna.</Text>
        </VStack>
      </Container>
    </AdminLayout>
  );
}