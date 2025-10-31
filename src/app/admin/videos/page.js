"use client";

import { useState, useEffect, useCallback } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Select,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Flex,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { FiTrash2, FiVideo, FiYoutube } from 'react-icons/fi';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    description: '',
    video_type: 'youtube'
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tableExists, setTableExists] = useState(true);
  const toast = useToast();

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching videos...');
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching videos:', error);
        
        // Jika tabel tidak ada
        if (error.code === '42P01') {
          setTableExists(false);
          toast({
            title: 'Tabel Videos Belum Dibuat',
            description: 'Silakan buat tabel videos terlebih dahulu di Supabase',
            status: 'warning',
            duration: 6000,
            isClosable: true,
          });
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Videos loaded:', data?.length || 0);
      setVideos(data || []);
      setTableExists(true);
      
    } catch (error) {
      console.error('❌ Error in fetchVideos:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data video: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validasi form
      if (!formData.title.trim()) {
        throw new Error('Judul video harus diisi');
      }

      if (!formData.video_url.trim()) {
        throw new Error('URL video harus diisi');
      }

      // Validasi URL YouTube
      if (formData.video_type === 'youtube') {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeRegex.test(formData.video_url)) {
          throw new Error('URL YouTube tidak valid. Gunakan format: https://youtube.com/watch?v=... atau https://youtu.be/...');
        }
      }

      console.log('🔄 Adding video:', formData);

      const { error } = await supabase
        .from('videos')
        .insert([{
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim() || null
        }]);

      if (error) {
        console.error('❌ Insert error:', error);
        
        if (error.code === '42P01') {
          throw new Error('Tabel videos belum dibuat. Silakan buat tabel terlebih dahulu.');
        }
        
        throw error;
      }

      toast({
        title: 'Video berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        video_url: '',
        description: '',
        video_type: 'youtube'
      });
      
      // Refresh data
      fetchVideos();
      
    } catch (error) {
      console.error('❌ Error adding video:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Video berhasil dihapus!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchVideos();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const previewVideo = (video) => {
    if (video.video_type === 'youtube') {
      let videoId = '';
      
      // Handle youtu.be links
      if (video.video_url.includes('youtu.be')) {
        videoId = video.video_url.split('/').pop()?.split('?')[0];
      } 
      // Handle youtube.com links
      else if (video.video_url.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(video.video_url).search);
        videoId = urlParams.get('v');
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : video.video_url;
    }
    return video.video_url;
  };

  const getYoutubeThumbnail = (videoUrl) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop()?.split('?')[0];
      } else {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        videoId = urlParams.get('v');
      }
      
      return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;
    }
    return null;
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Video Edukasi</Heading>
            <Text color="gray.600">Tambah dan kelola video edukasi kesehatan untuk pengguna</Text>
          </Box>

          {/* Alert jika tabel tidak ada */}
          {!tableExists && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Tabel Videos Tidak Ditemukan</Text>
                <Text fontSize="sm">
                  Jalankan SQL setup untuk membuat tabel videos terlebih dahulu di Supabase Dashboard.
                </Text>
              </Box>
            </Alert>
          )}

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Add Video Form */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Tambah Video Baru</Heading>
                  
                  <Alert status="info" mb={4} borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Saat ini hanya support YouTube links. Paste URL YouTube lengkap.
                    </Text>
                  </Alert>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Judul Video</FormLabel>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Judul video edukasi kesehatan"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Tipe Video</FormLabel>
                        <Select
                          value={formData.video_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, video_type: e.target.value }))}
                        >
                          <option value="youtube">YouTube Link</option>
                          <option value="upload" disabled>Upload Video (Coming Soon)</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>YouTube URL</FormLabel>
                        <Input
                          value={formData.video_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                          placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                        />
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </Text>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Deskripsi (Opsional)</FormLabel>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Deskripsi singkat tentang video ini"
                          rows={3}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={submitting}
                        loadingText="Menambahkan..."
                        leftIcon={<FiVideo />}
                        isDisabled={!tableExists}
                      >
                        Tambah Video
                      </Button>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            </GridItem>

            {/* Video List */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>
                    Daftar Video ({loading ? '...' : videos.length})
                  </Heading>
                  
                  {loading ? (
                    <Flex justify="center" py={8}>
                      <Spinner size="lg" color="blue.500" />
                    </Flex>
                  ) : !tableExists ? (
                    <Box textAlign="center" py={8}>
                      <FiVideo size={48} color="#CBD5E0" />
                      <Text color="gray.500" mt={4}>
                        Tabel videos belum tersedia
                      </Text>
                    </Box>
                  ) : videos.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <FiVideo size={48} color="#CBD5E0" />
                      <Text color="gray.500" mt={4}>
                        Belum ada video
                      </Text>
                      <Text fontSize="sm" color="gray.400" mt={2}>
                        Tambah video pertama Anda di form sebelah
                      </Text>
                    </Box>
                  ) : (
                    <Box maxH="600px" overflowY="auto">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Judul</Th>
                            <Th>Tipe</Th>
                            <Th>Tanggal</Th>
                            <Th>Aksi</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {videos.map((video) => (
                            <Tr key={video.id}>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="medium" noOfLines={1}>
                                    {video.title}
                                  </Text>
                                  {video.description && (
                                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                      {video.description}
                                    </Text>
                                  )}
                                </VStack>
                              </Td>
                              <Td>
                                <HStack>
                                  <FiYoutube color="#FF0000" />
                                  <Badge colorScheme="red">
                                    YouTube
                                  </Badge>
                                </HStack>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {new Date(video.created_at).toLocaleDateString('id-ID')}
                                </Text>
                              </Td>
                              <Td>
                                <HStack>
                                  <IconButton
                                    icon={<FiTrash2 />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete(video.id)}
                                    aria-label="Delete video"
                                  />
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
            </GridItem>
          </Grid>

          {/* Video Previews */}
          {videos.length > 0 && (
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Preview Video</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {videos.map((video) => (
                    <Box key={video.id} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                      <Box
                        position="relative"
                        paddingBottom="56.25%" // 16:9 aspect ratio
                        height="0"
                        overflow="hidden"
                        bg="gray.100"
                      >
                        <iframe
                          src={previewVideo(video)}
                          title={video.title}
                          width="100%"
                          height="100%"
                          style={{ position: 'absolute', top: 0, left: 0 }}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </Box>
                      <Box p={4}>
                        <Text fontWeight="medium" noOfLines={2} mb={2}>
                          {video.title}
                        </Text>
                        {video.description && (
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {video.description}
                          </Text>
                        )}
                        <HStack mt={2} justify="space-between">
                          <Badge colorScheme="blue" fontSize="xs">
                            {new Date(video.created_at).toLocaleDateString('id-ID')}
                          </Badge>
                          <Badge colorScheme="green" fontSize="xs">
                            {video.view_count || 0} views
                          </Badge>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </AdminLayout>
  );
}