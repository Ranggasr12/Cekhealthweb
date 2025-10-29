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
  Progress,
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
  supabase, 
  getProfile, 
  updateProfile, 
  uploadAvatar, 
  deleteAvatar, 
  validateImageFile,
  getCurrentUser,
  getSession,
  createProfile
} from '@/lib/supabase';
import { FiUser, FiCamera, FiSave, FiCheck, FiUpload, FiX, FiMail } from 'react-icons/fi';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const [formData, setFormData] = useState({
    full_name: '',
    username: ''
  });

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  // Fungsi untuk debug error secara detail
  const debugError = (error, context) => {
    console.group(`🔍 Error Debug: ${context}`);
    console.log('Error object:', error);
    console.log('Error message:', error?.message);
    console.log('Error code:', error?.code);
    console.log('Error details:', error?.details);
    console.log('Error hint:', error?.hint);
    console.log('Error stack:', error?.stack);
    console.log('Stringified error:', JSON.stringify(error, null, 2));
    console.groupEnd();
  };

  const loadUserAndProfile = async () => {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await getSession();
      
      if (sessionError) {
        debugError(sessionError, 'Session Error');
        throw new Error('Gagal memuat session pengguna');
      }

      if (!session?.user) {
        throw new Error('Tidak ada user yang login');
      }

      setUser(session.user);

      const { data: profileData, error: profileError } = await getProfile(session.user.id);

      if (profileError) {
        debugError(profileError, 'Profile Load Error');
        
        // Jika profile tidak ditemukan, buat profile baru
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await createProfile(session.user.id, {
            full_name: '',
            username: ''
          });
          
          if (createError) {
            debugError(createError, 'Profile Create Error');
            throw createError;
          }
          
          setProfile(newProfile);
          setFormData({
            full_name: newProfile.full_name || '',
            username: newProfile.username || ''
          });
        } else {
          throw profileError;
        }
      } else {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          username: profileData.username || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal memuat profil',
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

    // Validasi username
    if (formData.username) {
      if (formData.username.length < 3) {
        errors.username = 'Username harus minimal 3 karakter';
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username hanya boleh mengandung huruf, angka, dan underscore';
      }
    }

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
      console.log('User ID:', user.id);
      console.log('Form data to save:', formData);

      // Cek apakah ada perubahan data
      const hasChanges = 
        formData.full_name !== (profile?.full_name || '') ||
        formData.username !== (profile?.username || '');

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

      const updateData = {
        full_name: formData.full_name.trim() || null,
        username: formData.username.trim() || null
      };

      console.log('Update data prepared:', updateData);

      const { data, error } = await updateProfile(user.id, updateData);

      if (error) {
        debugError(error, 'Profile Update Error');
        
        // Handle specific error cases
        let errorMessage = 'Gagal menyimpan profil';
        
        if (error.code === '23505') {
          if (error.details?.includes('username')) {
            errorMessage = 'Username sudah digunakan oleh pengguna lain';
          } else if (error.details?.includes('profiles_full_name_key')) {
            errorMessage = 'Nama lengkap sudah digunakan';
          } else {
            errorMessage = 'Data sudah ada dalam sistem (duplicate key)';
          }
        } else if (error.code === '42501') {
          errorMessage = 'Anda tidak memiliki izin untuk mengupdate profil ini';
        } else if (error.code === 'PGRST116') {
          errorMessage = 'Profil tidak ditemukan';
        } else if (error.code === 'PGRST204') {
          errorMessage = 'Tidak ada perubahan data yang disimpan';
        } else if (error.message) {
          errorMessage = error.message;
        }

        throw new Error(errorMessage);
      }

      console.log('✅ Profile updated successfully:', data);

      toast({
        title: 'Berhasil',
        description: 'Profil berhasil diperbarui',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload profile data
      await loadUserAndProfile();
      
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

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const file = event.target.files[0];
      if (!file) return;

      // Validasi file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: 'Error',
          description: validation.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Reset file input
      event.target.value = '';

      // Simulasi progress upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      console.log('🔄 Starting avatar upload...');
      const { data: uploadData, error: uploadError } = await uploadAvatar(file, user.id);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        debugError(uploadError, 'Avatar Upload Error');
        throw uploadError;
      }

      console.log('✅ Avatar uploaded successfully:', uploadData);

      // Update profile dengan avatar_url baru
      const { error: updateError } = await updateProfile(user.id, {
        avatar_url: uploadData.publicUrl
      });

      if (updateError) {
        debugError(updateError, 'Profile Avatar Update Error');
        throw updateError;
      }

      toast({
        title: 'Berhasil',
        description: 'Foto profil berhasil diupload',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload profile data
      await loadUserAndProfile();
      
      // Reset progress
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 500);

    } catch (error) {
      console.error('❌ Error uploading avatar:', error);
      
      let errorMessage = 'Gagal mengupload foto profil';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      if (!profile?.avatar_url) return;

      console.log('🔄 Removing avatar...');

      // Hapus file dari storage
      const { error: deleteError } = await deleteAvatar(profile.avatar_url, user.id);
      if (deleteError) {
        debugError(deleteError, 'Avatar Delete Error');
        // Continue even if delete fails, we still want to update the profile
      }

      // Update profile dengan menghapus avatar_url
      const { error: updateError } = await updateProfile(user.id, {
        avatar_url: null
      });

      if (updateError) {
        debugError(updateError, 'Profile Avatar Remove Error');
        throw updateError;
      }

      console.log('✅ Avatar removed successfully');

      toast({
        title: 'Berhasil',
        description: 'Foto profil berhasil dihapus',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload profile data
      await loadUserAndProfile();

    } catch (error) {
      console.error('❌ Error removing avatar:', error);
      
      let errorMessage = 'Gagal menghapus foto profil';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
            Kelola informasi profil dan foto akun Anda
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
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={profile?.full_name || user.email}
                      src={profile?.avatar_url || ''}
                      bg="purple.500"
                      color="white"
                      border="4px solid"
                      borderColor="purple.200"
                      shadow="md"
                    />
                    
                    {/* Upload Progress */}
                    {uploading && (
                      <Box position="absolute" top="0" left="0" right="0" bottom="0">
                        <Progress 
                          value={uploadProgress} 
                          size="xs" 
                          colorScheme="purple"
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          borderRadius="full"
                        />
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          bg="blackAlpha.500"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="white" fontSize="sm" fontWeight="bold">
                            {uploadProgress}%
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <HStack spacing={3}>
                    {/* Upload Button */}
                    <Button
                      as="label"
                      htmlFor="avatar-upload"
                      leftIcon={<Icon as={FiUpload} />}
                      colorScheme="purple"
                      variant="solid"
                      size="md"
                      cursor="pointer"
                      isLoading={uploading}
                      loadingText="Uploading..."
                    >
                      Upload Foto
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        display="none"
                      />
                    </Button>

                    {/* Remove Button */}
                    {profile?.avatar_url && (
                      <Button
                        leftIcon={<Icon as={FiX} />}
                        colorScheme="red"
                        variant="outline"
                        size="md"
                        onClick={handleRemoveAvatar}
                        isDisabled={uploading}
                      >
                        Hapus
                      </Button>
                    )}
                  </HStack>

                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Format: JPG, PNG, GIF (maks. 5MB)
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
                    <FormLabel fontWeight="semibold">
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

                  {/* Username Field */}
                  <FormControl isInvalid={!!formErrors.username}>
                    <FormLabel fontWeight="semibold">
                      Username
                    </FormLabel>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      fontSize="md"
                    />
                    <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Username akan digunakan sebagai identitas unik Anda
                    </Text>
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
                          {user.id.substring(0, 8)}...
                        </Badge>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="purple.600">Terakhir Update:</Text>
                        <Text fontSize="sm" color="purple.700" fontWeight="medium">
                          {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Belum pernah diupdate'}
                        </Text>
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
                    isDisabled={saving || uploading}
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