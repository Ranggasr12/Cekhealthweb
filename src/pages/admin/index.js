import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <Box p={6}>
      <Heading mb={6}>Dashboard Admin</Heading>
      <VStack spacing={4} align="start">
        <Link href="/admin/makalah"><Button colorScheme="blue">Kelola Makalah</Button></Link>
        <Link href="/admin/video"><Button colorScheme="teal">Kelola Video</Button></Link>
        <Link href="/admin/question"><Button colorScheme="purple">Kelola Pertanyaan</Button></Link>
      </VStack>
    </Box>
  );
}
