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
  FiSearch,
  FiPlus,
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
      action: "Melakukan diagnosa",
      disease: "Anemia",
      time: "2 jam yang lalu"
    },
    {
      id: 2,
      user: "user456", 
      action: "Menonton video edukasi",
      video: "Pencegahan Anemia",
      time: "5 jam yang lalu"
    },
    {
      id: 3,
      user: "user789",
      action: "Menyelesaikan kuesioner",
      time: "1 hari yang lalu"
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
      <Box 
        ml={{ base: 0, md: "10px" }}
        mt="60px"
        minH="calc(100vh - 60px)"
        bg="gray.50"
        px={4}
        py={4}
        width={{ 
          base: "100%", 
          md: "calc(100vw - 290px)",
          lg: "calc(100vw - 300px)" 
        }}
        maxW="100%"
        overflow="hidden"
      >
        <VStack spacing={4} align="stretch" width="100%">
          
          {/* Header */}
          <Box width="100%">
            <VStack spacing={1} align="start">
              <Heading size="lg" color="gray.800" fontWeight="bold">
                Dashboard Admin
              </Heading>
              <Text fontSize="md" color="gray.600">
                Kelola sistem diagnosa kesehatan dengan konfigurasi lengkap
              </Text>
            </VStack>
          </Box>

          {/* Statistics Grid */}
          <SimpleGrid columns={gridColumns} spacing={3} width="100%">
            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
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

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
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

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
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

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
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
          <HStack justify="space-between" align="center" width="100%">
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

          {/* Search and Filter Section */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
            <CardBody p={4}>
              <SimpleGrid 
                columns={{ base: 1, md: 3 }} 
                spacing={4}
                width="100%"
              >
                <InputGroup size="sm" width="100%">
                  <InputLeftElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Cari pengguna, diagnosa..." 
                    borderRadius="md"
                    width="100%"
                  />
                </InputGroup>
                
                <Select placeholder="Filter Bulan" size="sm" borderRadius="md" width="100%">
                  <option>Januari 2024</option>
                  <option>Februari 2024</option>
                  <option>Maret 2024</option>
                </Select>

                <Select placeholder="Filter Status" size="sm" borderRadius="md" width="100%">
                  <option>Aktif</option>
                  <option>Non-Aktif</option>
                  <option>Semua</option>
                </Select>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Quick Actions Grid - TEXT TIDAK KELUAR BUTTON */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} width="100%">
            {/* Button 1 - Kelola Pertanyaan */}
            <Button
              leftIcon={<Icon as={FiHelpCircle} />}
              colorScheme="blue"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/pertanyaan')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="blue.200"
              _hover={{ bg: 'blue.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Kelola Pertanyaan
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Kuesioner kesehatan
                </Text>
              </Box>
            </Button>

            {/* Button 2 - Kelola Video */}
            <Button
              leftIcon={<Icon as={FiVideo} />}
              colorScheme="green"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/videos')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="green.200"
              _hover={{ bg: 'green.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Kelola Video
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Konten edukasi
                </Text>
              </Box>
            </Button>

            {/* Button 3 - Pengaturan */}
            <Button
              leftIcon={<Icon as={FiSettings} />}
              colorScheme="purple"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/settings')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="purple.200"
              _hover={{ bg: 'purple.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Pengaturan
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Pengaturan sistem
                </Text>
              </Box>
            </Button>
          </SimpleGrid>

          {/* Recent Activities */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
            <CardBody p={4} width="100%">
              <VStack spacing={3} align="stretch" width="100%">
                <Heading size="md" color="gray.800">
                  Aktivitas Terbaru
                </Heading>
                
                <Box width="100%" overflowX="auto">
                  <Table variant="simple" size="sm" minWidth="600px">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs" width="20%">PENGGUNA</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs" width="25%">AKTIVITAS</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs" width="25%">DETAIL</Th>
                        <Th fontWeight="bold" color="gray.700" fontSize="xs" width="30%">WAKTU</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentActivities.map((activity) => (
                        <Tr key={activity.id} _hover={{ bg: 'gray.50' }}>
                          <Td width="20%">
                            <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                              {activity.user}
                            </Text>
                          </Td>
                          <Td width="25%">
                            <Badge colorScheme="blue" fontSize="xs" px={2} py={1} noOfLines={1}>
                              {activity.action}
                            </Badge>
                          </Td>
                          <Td width="25%">
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {activity.disease || activity.video || '-'}
                            </Text>
                          </Td>
                          <Td width="30%">
                            <Text fontSize="sm" color="gray.500" noOfLines={1}>
                              {activity.time}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </CardBody>
          </Card>

        </VStack>
      </Box>
    </AdminLayout>
  );
}