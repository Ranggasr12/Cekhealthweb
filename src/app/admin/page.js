"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, 
  Spinner, Text, Container, Button, VStack
} from "@chakra-ui/react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
      
    } catch (error) {
      console.error("Auth error:", error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" />
          <Text mt={4}>Loading admin dashboard...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <Heading mb={6}>Dashboard Admin</Heading>
      <Text mb={6}>Selamat datang, {user?.email}!</Text>

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        <Stat bg="white" p={4} borderRadius="lg" shadow="md">
          <StatLabel>Total Makalah</StatLabel>
          <StatNumber>—</StatNumber>
        </Stat>

        <Stat bg="white" p={4} borderRadius="lg" shadow="md">
          <StatLabel>Total Video</StatLabel>
          <StatNumber>—</StatNumber>
        </Stat>

        <Stat bg="white" p={4} borderRadius="lg" shadow="md">
          <StatLabel>Riwayat Diagnosa</StatLabel>
          <StatNumber>—</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}