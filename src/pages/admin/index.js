import { Box, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import AdminLayout from "../../components/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <SimpleGrid columns={3} spacing={6}>
        <Stat bg="white" p={5} rounded="lg" shadow="md">
          <StatLabel>Total Makalah</StatLabel>
          <StatNumber>12</StatNumber>
        </Stat>
        <Stat bg="white" p={5} rounded="lg" shadow="md">
          <StatLabel>Total Video</StatLabel>
          <StatNumber>8</StatNumber>
        </Stat>
        <Stat bg="white" p={5} rounded="lg" shadow="md">
          <StatLabel>Pertanyaan Masuk</StatLabel>
          <StatNumber>20</StatNumber>
        </Stat>
      </SimpleGrid>
    </AdminLayout>
  );
}
