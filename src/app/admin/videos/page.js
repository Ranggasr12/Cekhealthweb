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
  const toast = useToast();

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data video',
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
      // Validasi URL YouTube
      if (formData.video_type === 'youtube' && !formData.video_url.includes('youtube.com') && !formData.video_url.includes('youtu.be')) {
        throw new Error('URL YouTube tidak valid');
      }

      const { error } = await supabase
        .from('videos')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Video berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        title: '',
        video_url: '',
        description: '',
        video_type: 'youtube'
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
      const videoId = video.video_url.includes('youtu.be') 
        ? video.video_url.split('/').pop()
        : new URL(video.video_url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return video.video_url;
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Video</Heading>
            <Text color="gray.600">Tambah dan kelola video edukasi kesehatan</Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Add Video Form */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Tambah Video Baru</Heading>
                  
                  <Alert status="info" mb={4} borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Support YouTube links dan video upload
                    </Text>
                  </Alert>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Judul Video</FormLabel>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Judul video edukasi"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Tipe Video</FormLabel>
                        <Select
                          value={formData.video_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, video_type: e.target.value }))}
                        >
                          <option value="youtube">YouTube Link</option>
                          <option value="upload">Upload Video</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>
                          {formData.video_type === 'youtube' ? 'YouTube URL' : 'Video URL'}
                        </FormLabel>
                        <Input
                          value={formData.video_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                          placeholder={
                            formData.video_type === 'youtube' 
                              ? 'https://youtube.com/watch?v=... atau https://youtu.be/...' 
                              : 'URL video yang diupload'
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Deskripsi</FormLabel>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Deskripsi video"
                          rows={3}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={submitting}
                        leftIcon={<FiVideo />}
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
                    Daftar Video ({videos.length})
                  </Heading>
                  
                  {videos.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <IconButton
                        icon={<FiVideo />}
                        boxSize={12}
                        color="gray.400"
                        mb={4}
                        variant="ghost"
                        aria-label="No videos"
                      />
                      <Text color="gray.500">Belum ada video</Text>
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
                                  {video.video_type === 'youtube' ? (
                                    <FiYoutube color="#FF0000" />
                                  ) : (
                                    <FiVideo color="#3182CE" />
                                  )}
                                  <Badge 
                                    colorScheme={video.video_type === 'youtube' ? 'red' : 'blue'}
                                  >
                                    {video.video_type}
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {videos.slice(0, 4).map((video) => (
                    <Box key={video.id}>
                      <Text fontWeight="medium" mb={2}>{video.title}</Text>
                      <Box
                        position="relative"
                        paddingBottom="56.25%" // 16:9 aspect ratio
                        height="0"
                        overflow="hidden"
                        borderRadius="md"
                        bg="black"
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
                      {video.description && (
                        <Text fontSize="sm" color="gray.600" mt={2}>
                          {video.description}
                        </Text>
                      )}
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