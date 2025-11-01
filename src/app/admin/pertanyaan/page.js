"use client";

import { useEffect, useState } from 'react';
import { 
  Heading, 
  Text, 
  VStack,
  Box,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Spinner,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { 
  collection,
  getCountFromServer
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiUsers, 
  FiActivity, 
  FiVideo, 
  FiHelpCircle, 
  FiSettings,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Responsive values
  const gridColumns = useBreakpointValue({ 
    base: 2, 
    sm: 4 
  });

  const actionColumns = useBreakpointValue({
    base: 1,
    md: 3
  });

  const tableDisplay = useBreakpointValue({
    base: 'none',
    md: 'table'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadStats();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadStats = async () => {
    try {
      const [
        videosSnapshot,
        pertanyaanSnapshot,
        usersSnapshot,
        diagnosaSnapshot
      ] = await Promise.all([
        getCountFromServer(collection(db, 'videos')),
        getCountFromServer(collection(db, 'pertanyaan')),
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(collection(db, 'hasil_diagnosa'))
      ]);

      setStats({
        videos: videosSnapshot.data().count || 0,
        pertanyaan: pertanyaanSnapshot.data().count || 0,
        users: usersSnapshot.data().count || 0,
        diagnosa: diagnosaSnapshot.data().count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        videos: 0,
        pertanyaan: 0,
        users: 0,
        diagnosa: 0
      });
    }
  };

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      user: "user123",
      action: "MELAKUKAN DIAGNOSA",
      detail: "Anemia",
      time: "2 jam yang lalu",
      status: "SELESAI"
    },
    {
      id: 2,
      user: "user456", 
      action: "MENONTON VIDEO",
      detail: "Pencegahan Anemia",
      time: "5 jam yang lalu",
      status: "SELESAI"
    },
    {
      id: 3,
      user: "user789",
      action: "MENYELESAIKAN KUESIONER",
      detail: "Kesehatan Umum",
      time: "1 hari yang lalu",
      status: "SELESAI"
    },
    {
      id: 4,
      user: "user101",
      action: "MELAKUKAN DIAGNOSA",
      detail: "Diabetes",
      time: "2 hari yang lalu",
      status: "SELESAI"
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <Box 
          ml={{ base: 0, md: "10px" }}
          mt="60px"
          px={4}
          py={6}
        >
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Memuat dashboard...</Text>
          </VStack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* MAIN CONTENT - SANGAT DEKAT DENGAN SIDEBAR */}
      <Box 
        ml={{ base: 0, md: "10px" }} // SANGAT DEKAT DENGAN SIDEBAR
        mt="60px"
        minH="calc(100vh - 60px)"
        bg="gray.50"
        px={4}
        py={4}
        width={{ base: "100%", md: "calc(100% - 20px)" }}
        overflowX="hidden"
      >
        <VStack spacing={4} align="stretch">
          
          {/* Header */}
          <Box>
            <VStack spacing={1} align="start">
              <Heading size="lg" color="gray.800" fontWeight="bold">
                Dashboard Admin
              </Heading>
              <Text fontSize="md" color="gray.600">
                Kelola sistem diagnosa kesehatan dengan konfigurasi lengkap
              </Text>
            </VStack>
          </Box>

          {/* Statistics Grid - COMPACT SEPERTI DI KELOLA PERTANYAAN */}
          <SimpleGrid columns={gridColumns} spacing={3}>
            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="purple.600">
                    {stats.users || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Pengguna
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    {stats.diagnosa || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Diagnosa
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {stats.videos || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Video
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="orange.600">
                    {stats.pertanyaan || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Pertanyaan
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Quick Actions Header */}
          <HStack justify="space-between" align="center">
            <Heading size="md" color="gray.800">
              Quick Actions
            </Heading>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="purple"
              size="sm"
              variant="solid"
            >
              Tambah Konten
            </Button>
          </HStack>

          {/* Search and Filter Section - PERSIS SEPERTI DI KELOLA PERTANYAAN */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
            <CardBody p={4}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <InputGroup size="sm">
                  <InputLeftElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Cari pengguna, diagnosa..." 
                    borderRadius="md"
                  />
                </InputGroup>
                
                <Select placeholder="Filter Bulan" size="sm" borderRadius="md">
                  <option>Januari 2024</option>
                  <option>Februari 2024</option>
                  <option>Maret 2024</option>
                </Select>

                <Select placeholder="Filter Status" size="sm" borderRadius="md">
                  <option>Aktif</option>
                  <option>Non-Aktif</option>
                  <option>Semua</option>
                </Select>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Quick Actions Grid - BUTTON BESAR DENGAN DESKRIPSI */}
          <SimpleGrid columns={actionColumns} spacing={3}>
            <Button
              leftIcon={<Icon as={FiHelpCircle} />}
              colorScheme="blue"
              size="md"
              height="80px"
              onClick={() => router.push('/admin/pertanyaan')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="blue.200"
              _hover={{ bg: 'blue.50' }}
            >
              <VStack spacing={1} align="start">
                <Text fontWeight="bold" fontSize="sm">Kelola Pertanyaan</Text>
                <Text fontSize="xs" color="gray.600">Kuesioner kesehatan</Text>
              </VStack>
            </Button>

            <Button
              leftIcon={<Icon as={FiVideo} />}
              colorScheme="green"
              size="md"
              height="80px"
              onClick={() => router.push('/admin/videos')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="green.200"
              _hover={{ bg: 'green.50' }}
            >
              <VStack spacing={1} align="start">
                <Text fontWeight="bold" fontSize="sm">Kelola Video</Text>
                <Text fontSize="xs" color="gray.600">Konten edukasi</Text>
              </VStack>
            </Button>

            <Button
              leftIcon={<Icon as={FiSettings} />}
              colorScheme="purple"
              size="md"
              height="80px"
              onClick={() => router.push('/admin/settings')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="purple.200"
              _hover={{ bg: 'purple.50' }}
            >
              <VStack spacing={1} align="start">
                <Text fontWeight="bold" fontSize="sm">Pengaturan</Text>
                <Text fontSize="xs" color="gray.600">Pengaturan sistem</Text>
              </VStack>
            </Button>
          </SimpleGrid>

          {/* Recent Activities - TABLE PERSIS SEPERTI DI KELOLA PERTANYAAN */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
            <CardBody p={4}>
              <VStack spacing={3} align="stretch">
                <Heading size="md" color="gray.800">
                  Aktivitas Terbaru
                </Heading>
                
                <Box overflowX="auto">
                  <Table variant="simple" size="sm" display={tableDisplay}>
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs">PENGGUNA</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs">AKTIVITAS</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs">DETAIL</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs">WAKTU</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs">STATUS</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentActivities.map((activity) => (
                        <Tr key={activity.id} _hover={{ bg: 'gray.50' }}>
                          <Td>
                            <Text fontWeight="medium" fontSize="sm">{activity.user}</Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
                              {activity.action}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {activity.detail}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.500">
                              {activity.time}
                            </Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
                              {activity.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  {/* Mobile View */}
                  <Box display={{ base: 'block', md: 'none' }}>
                    {recentActivities.map((activity) => (
                      <Card key={activity.id} mb={2} variant="outline">
                        <CardBody p={3}>
                          <VStack spacing={2} align="start">
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" fontSize="sm">{activity.user}</Text>
                              <Badge colorScheme="green" fontSize="xs">
                                {activity.status}
                              </Badge>
                            </HStack>
                            <Badge colorScheme="blue" fontSize="xs">
                              {activity.action}
                            </Badge>
                            <Text fontSize="sm" color="gray.600">
                              {activity.detail}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {activity.time}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </VStack>
            </CardBody>
          </Card>

        </VStack>
      </Box>
    </AdminLayout>
  );
}