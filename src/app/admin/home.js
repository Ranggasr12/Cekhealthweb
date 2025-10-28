'use client';

import { useState, useEffect, useCallback } from 'react'; // TAMBAHKAN useCallback
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Heading,
  useToast,
  Image,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { FiSave, FiEye, FiUpload } from 'react-icons/fi';

export default function EditHome() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const toast = useToast();

  // Pindahkan fetchContent ke useCallback
  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*');
      
      if (error) throw error;

      if (data) {
        const contentMap = {};
        data.forEach(item => {
          contentMap[item.section_name] = item;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat konten',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]); // Tambahkan toast sebagai dependency

  useEffect(() => {
    fetchContent();
  }, [fetchContent]); // Tambahkan fetchContent sebagai dependency

  const handleSave = async (sectionName) => {
    setSaving(prev => ({ ...prev, [sectionName]: true }));
    
    try {
      const sectionData = content[sectionName];
      const { error } = await supabase
        .from('home_content')
        .upsert({
          ...sectionData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Berhasil disimpan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(prev => ({ ...prev, [sectionName]: false }));
    }
  };

  const updateContent = (sectionName, field, value) => {
    setContent(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (sectionName, file) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionName}-${Math.random()}.${fileExt}`;
      const filePath = `home-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      updateContent(sectionName, 'image_url', publicUrl);

      toast({
        title: 'Gambar berhasil diupload!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error upload gambar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Edit Konten Homepage</Heading>
            <Text color="gray.600">Ubah teks, gambar, dan tombol pada homepage</Text>
          </Box>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              Perubahan yang disimpan akan langsung muncul di halaman utama website.
            </Text>
          </Alert>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Hero Section */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Card>
                <CardBody>
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md">Hero Section</Heading>
                    <Button
                      leftIcon={<FiEye />}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/', '_blank')}
                    >
                      Preview
                    </Button>
                  </HStack>
                  
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Judul Utama</FormLabel>
                      <Input
                        value={content.hero?.title || ''}
                        onChange={(e) => updateContent('hero', 'title', e.target.value)}
                        placeholder="Contoh: Selamat Datang di CekHealth"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Deskripsi</FormLabel>
                      <Textarea
                        value={content.hero?.description || ''}
                        onChange={(e) => updateContent('hero', 'description', e.target.value)}
                        placeholder="Deskripsi singkat tentang platform"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Gambar Background</FormLabel>
                      <VStack align="stretch" spacing={3}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('hero', e.target.files[0])}
                        />
                        {content.hero?.image_url && (
                          <Box mt={2}>
                            <Text fontSize="sm" mb={2}>Gambar saat ini:</Text>
                            <Image
                              src={content.hero.image_url}
                              alt="Hero background"
                              maxH="200px"
                              borderRadius="md"
                            />
                          </Box>
                        )}
                      </VStack>
                    </FormControl>

                    <HStack>
                      <FormControl>
                        <FormLabel>Tombol Teks</FormLabel>
                        <Input
                          value={content.hero?.button_text || ''}
                          onChange={(e) => updateContent('hero', 'button_text', e.target.value)}
                          placeholder="Mulai Sekarang"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tombol Link</FormLabel>
                        <Input
                          value={content.hero?.button_link || ''}
                          onChange={(e) => updateContent('hero', 'button_link', e.target.value)}
                          placeholder="/diagnosa"
                        />
                      </FormControl>
                    </HStack>

                    <Button
                      colorScheme="blue"
                      onClick={() => handleSave('hero')}
                      isLoading={saving.hero}
                      leftIcon={<FiSave />}
                      alignSelf="flex-start"
                    >
                      Simpan Hero Section
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* About Section */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>About Section</Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Judul</FormLabel>
                      <Input
                        value={content.about?.title || ''}
                        onChange={(e) => updateContent('about', 'title', e.target.value)}
                        placeholder="Tentang Kami"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Deskripsi</FormLabel>
                      <Textarea
                        value={content.about?.description || ''}
                        onChange={(e) => updateContent('about', 'description', e.target.value)}
                        placeholder="Deskripsi tentang platform"
                        rows={4}
                      />
                    </FormControl>

                    <Button
                      colorScheme="blue"
                      onClick={() => handleSave('about')}
                      isLoading={saving.about}
                      leftIcon={<FiSave />}
                    >
                      Simpan About Section
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Preview */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Preview Hero</Heading>
                  <Box 
                    p={6} 
                    border="1px" 
                    borderColor="gray.200" 
                    borderRadius="md"
                    bg={content.hero?.image_url ? `url('${content.hero.image_url}')` : 'gray.50'}
                    bgSize="cover"
                    bgPosition="center"
                    minH="200px"
                    display="flex"
                    alignItems="center"
                  >
                    <Box 
                      bg="white" 
                      p={4} 
                      borderRadius="md" 
                      shadow="md"
                      maxW="400px"
                    >
                      <Text fontWeight="bold" fontSize="xl" mb={2}>
                        {content.hero?.title || 'Judul Hero'}
                      </Text>
                      <Text mb={4} color="gray.600">
                        {content.hero?.description || 'Deskripsi hero section'}
                      </Text>
                      <Button colorScheme="blue" size="sm">
                        {content.hero?.button_text || 'Tombol'}
                      </Button>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </AdminLayout>
  );
}