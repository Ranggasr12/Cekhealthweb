// pages/admin/dashboard.js
import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0
  });
  
  const router = useRouter();
  const toast = useToast();

  // ⬅️ DEFINE loadAdminData DI SINI SEBELUM checkUserAndLoadData
  const loadAdminData = useCallback(async () => {
    try {
      // Get all users from profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        
        // Jika table tidak ada, beri instruksi
        if (error.code === '42P01') { // relation does not exist
          toast({
            title: "Table Profiles Tidak Ditemukan",
            description: "Silakan buat table profiles terlebih dahulu di Supabase",
            status: "error",
            duration: 10000,
          });
          return;
        }
        throw error;
      }

      console.log('Profiles data:', profiles);

      setUsers(profiles || []);

      const totalUsers = profiles?.length || 0;
      const totalAdmins = profiles?.filter(user => user.role === 'admin').length || 0;

      setStats({
        totalUsers,
        totalAdmins,
        activeUsers: totalUsers
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      
      if (error.code === '42P01') {
        toast({
          title: "Database Error",
          description: "Table 'profiles' belum dibuat. Silakan jalankan SQL migration di Supabase.",
          status: "error",
          duration: 10000,
        });
      } else {
        toast({
          title: "Error Memuat Data",
          description: "Tidak dapat memuat data pengguna",
          status: "error",
          duration: 5000,
        });
      }
    }
  }, [toast]);

  // ⬅️ SEKARAN checkUserAndLoadData BISA MENGGUNAKAN loadAdminData
  const checkUserAndLoadData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Check user role from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        router.push('/');
        return;
      }

      setRole(profile.role);

      // If not admin, redirect to home
      if (profile.role !== 'admin') {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses ke halaman admin",
          status: "error",
          duration: 3000,
        });
        router.push('/');
        return;
      }

      // Load admin data
      await loadAdminData();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        status: "error",
        duration: 3000,
      });
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router, toast, loadAdminData]); // ⬅️ TAMBAHKAN loadAdminData DI DEPENDENCIES

  useEffect(() => {
    checkUserAndLoadData();
  }, [checkUserAndLoadData]);

  // ⬅️ HAPUS DUPLICATE loadAdminData FUNCTION YANG DI BAWAH
  // Function handleSyncUsers tetap di sini
  const handleSyncUsers = async () => {
    try {
      // Manual sync: create profiles for auth users that don't have profiles
      const { data: authUsers } = await supabase
        .from('auth.users')
        .select('id, email, created_at');

      if (!authUsers) return;

      for (const authUser of authUsers) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authUser.id)
          .single();

        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email,
              role: 'user',
              full_name: authUser.email.split('@')[0],
              created_at: authUser.created_at
            });
        }
      }

      toast({
        title: "Sync Berhasil",
        description: "Data pengguna telah disinkronisasi",
        status: "success",
        duration: 3000,
      });

      await loadAdminData(); // ⬅️ PANGGIL loadAdminData YANG SUDAH DIDEKLARASIKAN

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Gagal",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={10}>
          <VStack spacing={4} align="center">
            <Spinner size="xl" color="purple.500" />
            <Text>Memuat dashboard admin...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  if (role !== 'admin') {
    return (
      <AdminLayout>
        <Container maxW="container.md" py={10}>
          <VStack spacing={4} align="center">
            <Heading color="red.500">Akses Ditolak</Heading>
            <Text>Anda tidak memiliki izin untuk mengakses halaman ini.</Text>
            <Button colorScheme="purple" onClick={() => router.push('/')}>
              Kembali ke Home
            </Button>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch" mb={8}>
          <Heading color="purple.600">Admin Dashboard</Heading>
          <Text color="gray.600">
            Selamat datang, {user?.email}. Ini adalah panel administrasi HealthCheck.
          </Text>
          
          <Button 
            colorScheme="blue" 
            onClick={handleSyncUsers}
            width="fit-content"
          >
            Sync Data Pengguna
          </Button>
        </VStack>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>Total Pengguna</StatLabel>
                <StatNumber>{stats.totalUsers}</StatNumber>
                <StatHelpText>User terdaftar</StatHelpText>
              </Stat>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>Admin</StatLabel>
                <StatNumber>{stats.totalAdmins}</StatNumber>
                <StatHelpText>User dengan role admin</StatHelpText>
              </Stat>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>User Aktif</StatLabel>
                <StatNumber>{stats.activeUsers}</StatNumber>
                <StatHelpText>Pernah login</StatHelpText>
              </Stat>
            </CardHeader>
          </Card>
        </SimpleGrid>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <Heading size="md">Daftar Pengguna ({users.length})</Heading>
          </CardHeader>
          <CardBody>
            {users.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={4}>
                Tidak ada data pengguna. Coba klik &quot;Sync Data Pengguna&quot;.
              </Text>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Nama</Th>
                    <Th>Role</Th>
                    <Th>Tanggal Daftar</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.email}</Td>
                      <Td>{user.full_name || '-'}</Td>
                      <Td>
                        <Badge
                          colorScheme={user.role === 'admin' ? 'purple' : 'gray'}
                          variant="subtle"
                        >
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>{new Date(user.created_at).toLocaleDateString('id-ID')}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Actions */}
        <Box mt={6} textAlign="center">
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
}