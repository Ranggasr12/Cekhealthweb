"use client";
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export default function AdminDashboard() {
  return (
    <Box>
      <Heading mb={6}>Dashboard Admin</Heading>

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
