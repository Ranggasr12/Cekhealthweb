"use client";

import { useEffect, useState } from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  VStack,
  Box,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Badge,
  Spinner,
  HStack,
  Icon,
  Flex,
  Progress,
  useBreakpointValue
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiUsers, 
  FiActivity, 
  FiVideo, 
  FiHelpCircle, 
  FiSettings,
  FiArrowRight
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const gridColumns = useBreakpointValue({ 
    base: 1, 
    md: 2, 
    lg: 4 
  });

  const actionColumns = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user);

        if (!session) {
          router.push('/login');
          return;
        }

        // Load stats
        const [
          videosResult,
          pertanyaanResult,
          usersResult,
          diagnosaResult
        ] = await Promise.all([
          supabase.from('videos').select('*', { count: 'exact', head: true }),
          supabase.from('pertanyaan').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('hasil_diagnosa').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          videos: videosResult.count || 0,
          pertanyaan: pertanyaanResult.count || 0,
          users: usersResult.count || 0,
          diagnosa: diagnosaResult.count || 0
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const StatCard = ({ icon, label, value, helpText, color = "blue" }) => (
    <Card 
      bg="white"
      border="1px"
      borderColor={`${color}.100`}
      boxShadow="sm"
      _hover={{ 
        transform: 'translateY(-2px)', 
        shadow: 'md',
        borderColor: `${color}.200`
      }}
      transition="all 0.3s ease"
      height="100%"
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="flex-start">
            <Box>
              <Stat>
                <StatLabel 
                  color="gray.600" 
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {label}
                </StatLabel>
                <StatNumber 
                  color={`${color}.600`} 
                  fontSize="xl" // Sedikit lebih kecil
                  fontWeight="bold"
                >
                  {value}
                </StatNumber>
                <StatHelpText color="gray.500" fontSize="xs">
                  {helpText}
                </StatHelpText>
              </Stat>
            </Box>
            <Icon 
              as={icon} 
              boxSize={5} // Sedikit lebih kecil
              color={`${color}.500`} 
              opacity={0.8}
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const ActionButton = ({ icon, label, onClick, colorScheme = "blue" }) => (
    <Button 
      colorScheme={colorScheme}
      onClick={onClick}
      height="70px" // Sedikit lebih pendek
      fontSize="md"
      leftIcon={<Icon as={icon} />}
      variant="outline"
      _hover={{ 
        transform: 'translateY(-1px)', 
        shadow: 'md',
        bg: `${colorScheme}.50`
      }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
      py={3}
    >
      <Text fontWeight="semibold" fontSize="sm">{label}</Text>
    </Button>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={4}>
          <VStack spacing={4} align="center" justify="center" minH="300px">
            <Spinner size="lg" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat dashboard...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Container dengan padding yang lebih kecil */}
      <Box width="100%">
        <VStack spacing={5} align="stretch"> {/* Spacing dikurangi dari 8 jadi 5 */}
          {/* Header */}
          <Box>
            <Flex 
              justify="space-between" 
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={3}
            >
              <Box>
                <Heading 
                  size="lg" // Sedikit lebih kecil
                  color="purple.600" 
                  mb={1} // Margin bottom dikurangi
                >
                  Dashboard Admin
                </Heading>
                <Text color="gray.600" fontSize="md">
                  Selamat datang di HealthCheck Admin Panel
                </Text>
                {user && (
                  <HStack mt={1} spacing={2}>
                    <Text fontSize="sm" color="gray.500">
                      Login sebagai:
                    </Text>
                    <Badge colorScheme="green" fontSize="xs" textTransform="none">
                      {user.email}
                    </Badge>
                  </HStack>
                )}
              </Box>
            </Flex>
          </Box>

          {/* Statistics Grid */}
          <SimpleGrid 
            columns={gridColumns} 
            spacing={4} // Spacing dikurangi dari 6 jadi 4
          >
            <StatCard
              icon={FiUsers}
              label="Total Pengguna"
              value={stats.users || 0}
              helpText="Pengguna terdaftar"
              color="purple"
            />
            <StatCard
              icon={FiActivity}
              label="Total Diagnosa"
              value={stats.diagnosa || 0}
              helpText="Pengecekan kesehatan"
              color="green"
            />
            <StatCard
              icon={FiVideo}
              label="Total Video"
              value={stats.videos || 0}
              helpText="Konten edukasi"
              color="blue"
            />
            <StatCard
              icon={FiHelpCircle}
              label="Total Pertanyaan"
              value={stats.pertanyaan || 0}
              helpText="Pertanyaan kesehatan"
              color="orange"
            />
          </SimpleGrid>

          {/* Quick Actions */}
          <Box>
            <Heading 
              size="md" 
              color="gray.700" 
              mb={3} // Margin bottom dikurangi
            >
              Quick Actions
            </Heading>
            <SimpleGrid 
              columns={actionColumns} 
              spacing={3} // Spacing dikurangi dari 4 jadi 3
            >
              <ActionButton
                icon={FiHelpCircle}
                label="Kelola Pertanyaan"
                onClick={() => router.push('/admin/pertanyaan')}
                colorScheme="blue"
              />
              <ActionButton
                icon={FiVideo}
                label="Kelola Video"
                onClick={() => router.push('/admin/videos')}
                colorScheme="green"
              />
              <ActionButton
                icon={FiSettings}
                label="Pengaturan"
                onClick={() => router.push('/admin/settings')}
                colorScheme="purple"
              />
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>
    </AdminLayout>
  );
}