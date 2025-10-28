// app/admin/dashboard/page.js
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
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Badge
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [dbStatus, setDbStatus] = useState('loading');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Test database connection
      try {
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        setDbStatus(error ? 'error' : 'connected');
      } catch (error) {
        setDbStatus('error');
      }
    };

    getUser();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading color="purple.600" mb={2}>🎉 Admin Dashboard</Heading>
          <Text color="gray.600" fontSize="lg">
            Selamat! Anda berhasil mengakses halaman admin.
          </Text>
          {user && (
            <Text fontSize="sm" color="gray.500">
              Login sebagai: {user.email}
            </Text>
          )}
        </Box>

        {/* Database Status */}
        <Alert 
          status={dbStatus === 'connected' ? 'success' : 'warning'} 
          borderRadius="md"
        >
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">
              Database: {dbStatus === 'connected' ? 'Connected' : 'Limited Access'}
            </Text>
            <Text fontSize="sm">
              {dbStatus === 'connected' 
                ? 'Semua fitur admin tersedia' 
                : 'Beberapa fitur mungkin terbatas'
              }
            </Text>
          </Box>
        </Alert>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>Total Pengguna</StatLabel>
                <StatNumber>1</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="purple">You</Badge>
                </StatHelpText>
              </Stat>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>Status</StatLabel>
                <StatNumber>
                  <Badge colorScheme="green">Active</Badge>
                </StatNumber>
                <StatHelpText>Admin Panel</StatHelpText>
              </Stat>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Stat>
                <StatLabel>Database</StatLabel>
                <StatNumber>
                  <Badge colorScheme={dbStatus === 'connected' ? 'green' : 'yellow'}>
                    {dbStatus === 'connected' ? 'OK' : 'Limited'}
                  </Badge>
                </StatNumber>
                <StatHelpText>Connection</StatHelpText>
              </Stat>
            </CardHeader>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <Heading size="md">Menu Admin</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/admin/makalah')}
                height="80px"
              >
                📚 Kelola Makalah
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/admin/pertanyaan')}
                height="80px"
              >
                ❓ Kelola Pertanyaan
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/admin/videos')}
                height="80px"
              >
                🎥 Kelola Video
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/admin/settings')}
                height="80px"
              >
                ⚙️ Settings
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Success Message */}
        <Box p={4} bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md">
          <Text fontWeight="bold" color="green.800">✅ BERHASIL!</Text>
          <Text color="green.700">
            Anda sekarang dapat mengakses semua fitur admin. Database issues dapat diperbaiki nanti.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}