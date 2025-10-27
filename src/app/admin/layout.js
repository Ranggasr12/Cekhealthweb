"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Box, Flex, VStack, Text, Link, Button, Spinner } from "@chakra-ui/react";
import { FiHome, FiFileText, FiVideo, FiHelpCircle, FiActivity, FiLogOut } from "react-icons/fi";
import NextLink from "next/link";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const menu = [
    { name: "Dashboard", icon: FiHome, href: "/admin" },
    { name: "Kelola Makalah", icon: FiFileText, href: "/admin/makalah" },
    { name: "Kelola Video", icon: FiVideo, href: "/admin/video" },
    { name: "Kelola Pertanyaan", icon: FiHelpCircle, href: "/admin/pertanyaan" },
    { name: "Hasil Diagnosa", icon: FiActivity, href: "/admin/diagnosa" },
  ];

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.push('/');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("Auth error:", error);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <Flex h="100vh" bg="gray.100" justify="center" align="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" />
          <Text>Memeriksa akses admin...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" bg="gray.100">
      {/* Sidebar */}
      <VStack
        w="260px"
        bg="gray.900"
        color="white"
        p={5}
        spacing={5}
        align="stretch"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          ADMIN PANEL
        </Text>

        {menu.map((item) => (
          <Link
            as={NextLink}
            href={item.href}
            key={item.name}
            _hover={{ textDecoration: "none", bg: "gray.700" }}
            p={3}
            borderRadius="md"
            display="flex"
            alignItems="center"
            gap={3}
          >
            <item.icon /> {item.name}
          </Link>
        ))}

        <Button
          onClick={handleLogout}
          mt="auto"
          colorScheme="red"
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<FiLogOut />}
        >
          Logout
        </Button>
      </VStack>

      {/* Konten halaman */}
      <Box flex="1" p={6} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}