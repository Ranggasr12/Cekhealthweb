"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Button,
  useToast,
  Spinner,
  Flex,
  Box,
  Alert,
  AlertIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';
import { FiUsers, FiUserCheck, FiUserX, FiRefreshCw } from 'react-icons/fi';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  // Firestore collection reference
  const usersCollectionRef = collection(db, 'users');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching users from Firestore...');
      
      const q = query(usersCollectionRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Users loaded:', usersData.length);
      setUsers(usersData);
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pengguna: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId, newRole) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah role user menjadi ${newRole}?`)) return;

    setUpdating(true);
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        role: newRole,
        updated_at: new Date()
      });

      toast({
        title: 'Berhasil',
        description: `Role user berhasil diubah menjadi ${newRole}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh data
      fetchUsers();
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengupdate role user: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID');
    }
    
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  // Statistics
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const regularUsers = users.filter(user => user.role === 'user' || !user.role).length;

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat data pengguna...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Pengguna</Heading>
            <Text color="gray.600">Kelola data dan role pengguna sistem</Text>
          </Box>

          {/* Statistics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="blue.700">Total Pengguna</StatLabel>
                      <StatNumber color="blue.800">{totalUsers}</StatNumber>
                      <StatHelpText color="blue.600">
                        Semua user terdaftar
                      </StatHelpText>
                    </Box>
                    <FiUsers size={24} color="#3182CE" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="green.700">Admin</StatLabel>
                      <StatNumber color="green.800">{adminUsers}</StatNumber>
                      <StatHelpText color="green.600">
                        User dengan akses admin
                      </StatHelpText>
                    </Box>
                    <FiUserCheck size={24} color="#38A169" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="orange.50" border="1px" borderColor="orange.200">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="orange.700">Regular Users</StatLabel>
                      <StatNumber color="orange.800">{regularUsers}</StatNumber>
                      <StatHelpText color="orange.600">
                        User biasa
                      </StatHelpText>
                    </Box>
                    <FiUserX size={24} color="#DD6B20" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Users Table */}
          <Card>
            <CardBody>
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Daftar Pengguna</Heading>
                <Button
                  leftIcon={<FiRefreshCw />}
                  onClick={fetchUsers}
                  isLoading={loading}
                  variant="outline"
                  size="sm"
                >
                  Refresh
                </Button>
              </HStack>

              {users.length === 0 ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">Belum ada pengguna</Text>
                    <Text fontSize="sm">
                      Data pengguna akan muncul setelah user mendaftar melalui aplikasi.
                    </Text>
                  </Box>
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>
                        <Th>Nama Lengkap</Th>
                        <Th>Role</Th>
                        <Th>Tanggal Daftar</Th>
                        <Th>Aksi</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            <Text fontWeight="medium">{user.email}</Text>
                          </Td>
                          <Td>
                            <Text>{user.full_name || 'N/A'}</Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={user.role === 'admin' ? 'green' : 'blue'}
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {user.role || 'user'}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(user.created_at)}</Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              {user.role !== 'admin' && (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => updateUserRole(user.id, 'admin')}
                                  isLoading={updating}
                                  isDisabled={updating}
                                >
                                  Jadikan Admin
                                </Button>
                              )}
                              {user.role === 'admin' && (
                                <Button
                                  size="sm"
                                  colorScheme="orange"
                                  onClick={() => updateUserRole(user.id, 'user')}
                                  isLoading={updating}
                                  isDisabled={updating}
                                >
                                  Jadikan User
                                </Button>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>

          {/* Information Card */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Informasi Management User</Text>
              <Text fontSize="sm">
                • User akan otomatis terdaftar di Firestore saat pertama kali login<br/>
                • Role "admin" memberikan akses penuh ke panel admin<br/>
                • Role "user" adalah role default untuk pengguna biasa
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </AdminLayout>
  );
}