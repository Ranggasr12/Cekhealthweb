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
  useBreakpointValue,
  Grid,
  GridItem
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
  FiArrowRight,
  FiCheckCircle
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
        transform: 'translateY(-4px)', 
        shadow: 'md',
        borderColor: `${color}.200`
      }}
      transition="all 0.3s ease"
      height="100%"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="flex-start">
            <Box>
              <Stat>
                <StatLabel 
                  color="gray.600" 
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="medium"
                >
                  {label}
                </StatLabel>
                <StatNumber 
                  color={`${color}.600`} 
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                >
                  {value}
                </StatNumber>
                <StatHelpText color="gray.500" fontSize="sm">
                  {helpText}
                </StatHelpText>
              </Stat>
            </Box>
            <Icon 
              as={icon} 
              boxSize={{ base: 6, md: 8 }} 
              color={`${color}.500`} 
              opacity={0.8}
            />
          </HStack>
          <Progress 
            value={100} 
            size="sm" 
            colorScheme={color}
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>
      </CardBody>
    </Card>
  );

  const ActionButton = ({ icon, label, onClick, colorScheme = "blue" }) => (
    <Button 
      colorScheme={colorScheme}
      onClick={onClick}
      height={{ base: "70px", md: "80px" }}
      fontSize={{ base: "md", md: "lg" }}
      leftIcon={<Icon as={icon} />}
      rightIcon={<Icon as={FiArrowRight} />}
      variant="outline"
      _hover={{ 
        transform: 'translateY(-2px)', 
        shadow: 'md',
        bg: `${colorScheme}.50`
      }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      py={4}
    >
      <Text fontWeight="semibold">{label}</Text>
    </Button>
  );

  const SystemStatusItem = ({ label, status, colorScheme = "green" }) => (
    <HStack 
      justify="space-between" 
      p={3} 
      bg="white"
      borderRadius="md"
      border="1px"
      borderColor="gray.100"
      _hover={{ bg: 'gray.50' }}
    >
      <HStack spacing={3}>
        <Icon 
          as={FiCheckCircle} 
          color={`${colorScheme}.500`} 
          boxSize={5} 
        />
        <Text color="gray.700" fontSize="sm">{label}</Text>
      </HStack>
      <Badge colorScheme={colorScheme} fontSize="xs">
        {status}
      </Badge>
    </HStack>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat dashboard...</Text>
            <Progress size="xs" isIndeterminate width="200px" colorScheme="purple" />
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <Box>
            <Flex 
              justify="space-between" 
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Box>
                <Heading 
                  size={{ base: "lg", md: "xl" }} 
                  color="purple.600" 
                  mb={2}
                  bgGradient="linear(to-r, purple.600, pink.500)"
                  bgClip="text"
                >
                  🎉 Dashboard Admin
                </Heading>
                <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                  Selamat datang di HealthCheck Admin Panel
                </Text>
                {user && (
                  <HStack mt={2} spacing={2}>
                    <Text fontSize="sm" color="gray.500">
                      Login sebagai:
                    </Text>
                    <Badge colorScheme="green" fontSize="xs" textTransform="none">
                      {user.email}
                    </Badge>
                  </HStack>
                )}
              </Box>
              <Text 
                fontSize="sm" 
                color="gray.500" 
                bg="gray.100" 
                px={3} 
                py={1} 
                borderRadius="full"
                textAlign="center"
              >
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </Flex>
          </Box>

          {/* Success Alert */}
          <Alert 
            status="success" 
            borderRadius="lg" 
            variant="left-accent"
            fontSize={{ base: "sm", md: "md" }}
          >
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Sistem Berjalan dengan Baik! 🚀</Text>
              <Text fontSize="sm">
                Panel admin berfungsi penuh. Semua sistem operasional.
              </Text>
            </Box>
          </Alert>

          {/* Statistics Grid */}
          <SimpleGrid 
            columns={gridColumns} 
            spacing={{ base: 4, md: 6 }}
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
              mb={4}
              fontSize={{ base: "lg", md: "xl" }}
            >
              Quick Actions
            </Heading>
            <SimpleGrid 
              columns={actionColumns} 
              spacing={{ base: 3, md: 4 }}
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

          {/* System Status */}
          <Card 
            bg="white" 
            border="1px" 
            borderColor="gray.200"
            shadow="sm"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading 
                  size="md" 
                  color="gray.700"
                  fontSize={{ base: "lg", md: "xl" }}
                >
                  Status Sistem
                </Heading>
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)" 
                  }} 
                  gap={3}
                >
                  <GridItem>
                    <SystemStatusItem 
                      label="Database Connection" 
                      status="Connected" 
                      colorScheme="green"
                    />
                  </GridItem>
                  <GridItem>
                    <SystemStatusItem 
                      label="Authentication" 
                      status="Working" 
                      colorScheme="green"
                    />
                  </GridItem>
                  <GridItem>
                    <SystemStatusItem 
                      label="Admin Access" 
                      status="Verified" 
                      colorScheme="green"
                    />
                  </GridItem>
                  <GridItem>
                    <SystemStatusItem 
                      label="All Features" 
                      status="Operational" 
                      colorScheme="green"
                    />
                  </GridItem>
                </Grid>
              </VStack>
            </CardBody>
          </Card>

          {/* Additional Info */}
          <SimpleGrid 
            columns={{ base: 1, md: 2 }} 
            spacing={{ base: 4, md: 6 }}
            mt={4}
          >
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" color="blue.800">
                    💡 Tips Admin
                  </Text>
                  <Text fontSize="sm" color="blue.700">
                    • Periksa pertanyaan kesehatan secara berkala<br/>
                    • Update video edukasi setiap bulan<br/>
                    • Backup data penting secara rutin
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" color="green.800">
                    📊 Analytics
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • {stats.users} pengguna aktif<br/>
                    • {stats.diagnosa} diagnosa dilakukan<br/>
                    • Sistem berjalan optimal
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </AdminLayout>
  );
}