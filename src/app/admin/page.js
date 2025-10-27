"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, 
  Spinner, Text, Container 
} from "@chakra-ui/react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found, redirecting to login");
        router.push('/login');
        return;
      }

      console.log("User found:", user.email);

      // Check user role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      console.log("Profile check:", { profile, profileError });

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: user.email?.split('@')[0] || 'User',
              role: 'user'
            }
          ]);

        if (createError) {
          console.error("Error creating profile:", createError);
        }
        
        router.push('/');
        return;
      } else if (profileError) {
        console.error("Error fetching profile:", profileError);
        router.push('/');
        return;
      }

      if (!profile || profile.role !== 'admin') {
        console.log("User is not admin, redirecting to home");
        router.push('/');
        return;
      }

      setUser(user);
      setUserRole(profile.role);
      
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={4}>Memeriksa akses...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Dashboard Admin</Heading>
      
      <Box mb={6}>
        <Text>Selamat datang, <strong>{user?.email}</strong>! (Role: {userRole})</Text>
      </Box>

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
    </Container>
  );
}