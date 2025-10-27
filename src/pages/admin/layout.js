"use client";
import { Box, Flex, VStack, Text, IconButton, Link } from "@chakra-ui/react";
import { FiHome, FiFileText, FiVideo, FiHelpCircle, FiActivity, FiLogOut } from "react-icons/fi";
import NextLink from "next/link";

export default function AdminLayout({ children }) {
  const menu = [
    { name: "Dashboard", icon: FiHome, href: "/admin" },
    { name: "Kelola Makalah", icon: FiFileText, href: "/admin/makalah" },
    { name: "Kelola Video", icon: FiVideo, href: "/admin/video" },
    { name: "Kelola Pertanyaan", icon: FiHelpCircle, href: "/admin/pertanyaan" },
    { name: "Hasil Diagnosa", icon: FiActivity, href: "/admin/diagnosa" },
  ];

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

        <Link
          as={NextLink}
          href="/login"
          mt="auto"
          color="red.300"
          _hover={{ color: "red.500" }}
          display="flex"
          alignItems="center"
          gap={3}
        >
          <FiLogOut /> Logout
        </Link>
      </VStack>

      {/* Konten halaman */}
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
}
