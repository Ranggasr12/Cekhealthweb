import { Box, Flex, VStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function AdminLayout({ children }) {
  return (
    <Flex minH="100vh" bg="#F7F7F7">
      {/* Sidebar */}
      <VStack
        w="230px"
        bg="#1A202C"
        color="white"
        p={5}
        align="flex-start"
        spacing={4}
      >
        <Text fontSize="2xl" fontWeight="bold">CekHealth Admin</Text>

        <Link as={NextLink} href="/admin">Dashboard</Link>
        <Link as={NextLink} href="/admin/makalah">Makalah</Link>
        <Link as={NextLink} href="/admin/video">Video</Link>
        <Link as={NextLink} href="/admin/pertanyaan">Pertanyaan</Link>
      </VStack>

      {/* Content */}
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
}
