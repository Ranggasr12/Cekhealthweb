"use client";

import { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Box,
  useToast,
  Card,
  CardBody,
  Divider,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Badge,
  FormErrorMessage,
  Spinner
} from '@chakra-ui/react';
import { 
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FiUser, FiSave, FiMail, FiLock } from 'react-icons/fi';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (user) => {
    try {
      setLoading(true);
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || user.displayName || '',
          email: user.email || ''
        });
      } else {
        // If profile doesn't exist, create one
        const profileData = {
          full_name: user.displayName || '',
          email: user.email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        await updateDoc(doc(db, 'users', user.uid), profileData);
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name,
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat profil',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validasi full_name
    if (formData.full_name && formData.full_name.length > 100) {
      errors.full_name = 'Nama lengkap terlalu panjang (maksimal 100 karakter)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error ketika user mulai mengetik
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Anda harus login untuk menyimpan profil',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi form
    if (!validateForm()) {
      toast({
        title: 'Error Validasi',
        description: 'Terdapat kesalahan dalam pengisian form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSaving(true);
      
      console.log('🔄 Starting profile update...');

      // Check if there are changes
      const hasChanges = formData.full_name !== (profile?.full_name || '');

      if (!hasChanges) {
        toast({
          title: 'Info',
          description: 'Tidak ada perubahan data untuk disimpan',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Update display name in Firebase Auth
      if (formData.full_name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.full_name.trim()
        });
      }

      // Update profile in Firestore
      const updateData = {
        full_name: formData.full_name.trim(),
        updated_at: new Date()
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);

      console.log('✅ Profile updated successfully');

      toast({
        title: 'Berhasil',
        description: 'Profil berhasil diperbarui',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload profile data
      await loadUserProfile(user);
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Gagal menyimpan profil',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">Memuat profil...</Text>
        </VStack>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Anda belum login!</AlertTitle>
            <AlertDescription>
              Silakan login untuk mengakses halaman profil.
            </AlertDescription>
          </Box>
          <Button 
            colorScheme="purple" 
            ml="auto"
            onClick={() => window.location.href = '/login'}
          >
            Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" color="purple.600" mb={2}>
            Profil Saya
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Kelola informasi profil akun Anda
          </Text>
        </Box>

        <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="lg" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={8} align="stretch">
              {/* Avatar Section */}
              <Box>
                <FormLabel fontWeight="bold" fontSize="lg" mb={4}>
                  Foto Profil
                </FormLabel>
                
                <VStack spacing={4} align="center">
                  <Avatar
                    size="2xl"
                    name={user.displayName || user.email}
                    src={user.photoURL || ''}
                    bg="purple.500"
                    color="white"
                    border="4px solid"
                    borderColor="purple.200"
                    shadow="md"
                  />
                  
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Foto profil diambil dari Google Account (jika login dengan Google)
                  </Text>
                </VStack>
              </Box>

              <Divider />

              {/* Profile Form */}
              <Box as="form" onSubmit={handleSaveProfile}>
                <VStack spacing={6} align="stretch">
                  {/* Email Field */}
                  <FormControl>
                    <FormLabel fontWeight="semibold" display="flex" alignItems="center" gap={2}>
                      <Icon as={FiMail} color="purple.500" />
                      Email
                    </FormLabel>
                    <Input
                      value={user.email}
                      isReadOnly
                      bg="gray.50"
                      color="gray.600"
                      fontSize="md"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Email tidak dapat diubah
                    </Text>
                  </FormControl>

                  {/* Full Name Field */}
                  <FormControl isInvalid={!!formErrors.full_name}>
                    <FormLabel fontWeight="semibold" display="flex" alignItems="center" gap={2}>
                      <Icon as={FiUser} color="purple.500" />
                      Nama Lengkap
                    </FormLabel>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap Anda"
                      fontSize="md"
                    />
                    <FormErrorMessage>{formErrors.full_name}</FormErrorMessage>
                  </FormControl>

                  {/* User Info */}
                  <Box p={4} bg="purple.50" borderRadius="lg" border="1px" borderColor="purple.200">
                    <Text fontSize="md" fontWeight="semibold" color="purple.700" mb={3}>
                      Informasi Akun:
                    </Text>
                    <VStack spacing={2} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="purple.600">User ID:</Text>
                        <Badge colorScheme="purple" fontSize="xs" fontFamily="mono" px={2} py={1}>
                          {user.uid.substring(0, 8)}...
                        </Badge>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="purple.600">Provider:</Text>
                        <Badge colorScheme="blue" fontSize="xs">
                          {user.providerData[0]?.providerId || 'Email/Password'}
                        </Badge>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="purple.600">Email Verified:</Text>
                        <Badge colorScheme={user.emailVerified ? 'green' : 'orange'} fontSize="xs">
                          {user.emailVerified ? 'Terverifikasi' : 'Belum diverifikasi'}
                        </Badge>
                      </Flex>
                    </VStack>
                  </Box>

                  {/* Save Button */}
                  <Button
                    type="submit"
                    colorScheme="purple"
                    leftIcon={<Icon as={FiSave} />}
                    isLoading={saving}
                    loadingText="Menyimpan..."
                    size="lg"
                    height="50px"
                    fontSize="md"
                    fontWeight="bold"
                    mt={4}
                  >
                    Simpan Perubahan
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}