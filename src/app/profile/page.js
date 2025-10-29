"use client";

import { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Komponen skeleton untuk loading
function ProfileSkeleton() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Skeleton height="40px" width="200px" mx="auto" mb={2} />
          <Skeleton height="20px" width="300px" mx="auto" />
        </Box>
        
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Skeleton height="24px" width="150px" />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i}>
                    <Skeleton height="16px" width="100px" mb={2} />
                    <Skeleton height="20px" width="120px" />
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render skeleton selama loading atau belum mounted
  if (!mounted || loading) {
    return <ProfileSkeleton />;
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading color="purple.600" mb={2}>👤 Profile Saya</Heading>
          <Text color="gray.600">
            Kelola informasi akun dan lihat riwayat kesehatan Anda
          </Text>
        </Box>

        {/* User Info */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" fontSize="lg">Informasi Akun</Text>
                <Text fontSize="sm" color="gray.500">
                  Data pribadi dan informasi login
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="medium" fontSize="sm" color="gray.600">
                    Email
                  </Text>
                  <Text>{user?.email}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="medium" fontSize="sm" color="gray.600">
                    Status Verifikasi
                  </Text>
                  <Badge colorScheme={user?.email_confirmed_at ? 'green' : 'yellow'}>
                    {user?.email_confirmed_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                  </Badge>
                </Box>

                <Box>
                  <Text fontWeight="medium" fontSize="sm" color="gray.600">
                    Bergabung Sejak
                  </Text>
                  <Text>{formatDate(user?.created_at)}</Text>
                </Box>

                <Box>
                  <Text fontWeight="medium" fontSize="sm" color="gray.600">
                    Terakhir Login
                  </Text>
                  <Text>{formatDate(user?.last_sign_in_at)}</Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Profile Data */}
        {profile && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">Data Profil</Text>
                  <Text fontSize="sm" color="gray.500">
                    Informasi tambahan profil Anda
                  </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="medium" fontSize="sm" color="gray.600">
                      Nama Lengkap
                    </Text>
                    <Text>{profile.full_name || '-'}</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="medium" fontSize="sm" color="gray.600">
                      Username
                    </Text>
                    <Text>{profile.username || '-'}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" fontSize="sm" color="gray.600">
                      Tanggal Lahir
                    </Text>
                    <Text>{profile.date_of_birth || '-'}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" fontSize="sm" color="gray.600">
                      Jenis Kelamin
                    </Text>
                    <Text>{profile.gender || '-'}</Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Diagnosa</StatLabel>
                <StatNumber>0</StatNumber>
                <StatHelpText>Riwayat kesehatan</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Member Since</StatLabel>
                <StatNumber>
                  {user?.created_at ? new Date(user.created_at).getFullYear() : '-'}
                </StatNumber>
                <StatHelpText>Tahun bergabung</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Actions */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={() => router.push('/form')}
            _hover={{ transform: 'translateY(-1px)' }}
          >
            🏥 Cek Kesehatan
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/video-gallery')}
            _hover={{ transform: 'translateY(-1px)' }}
          >
            📺 Video Edukasi
          </Button>
        </SimpleGrid>

        {/* Info */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Profile Management</Text>
            <Text fontSize="sm">
              Anda dapat mengubah informasi profil melalui halaman pengaturan.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Container>
  );
}