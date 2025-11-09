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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';
import { FiTrash2, FiVideo, FiYoutube, FiEdit, FiPlus, FiRefreshCw, FiDatabase } from 'react-icons/fi';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    nama_penyakit: '',
    jenis_materi: 'video',
    judul: '',
    deskripsi: '',
    url: '', // ✅ GUNAKAN 'url' BUKAN 'video_url'
    video_type: 'youtube'
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const toast = useToast();

  const materiCollectionRef = collection(db, 'materi_penyakit');

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching videos from Firestore...');
      
      const q = query(materiCollectionRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const videosData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(item => item.jenis_materi === 'video');
      
      console.log('✅ Videos loaded:', videosData.length);
      console.log('📋 Video data structure:', videosData.map(v => ({
        id: v.id,
        judul: v.judul,
        url: v.url,
        video_url: v.video_url, // Check if old field exists
        nama_penyakit: v.nama_penyakit,
        allFields: Object.keys(v)
      })));
      setVideos(videosData);
      
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
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

  // Debug data structure
  useEffect(() => {
    console.log('🔍 DEBUG: Current videos data structure:', videos);
    if (videos.length > 0) {
      console.log('🔍 DEBUG: First video details:', videos[0]);
      console.log('🔍 DEBUG: All fields in first video:', Object.keys(videos[0]));
      console.log('🔍 DEBUG: URL field value:', videos[0].url);
      console.log('🔍 DEBUG: video_url field value:', videos[0].video_url);
    }
  }, [videos]);

  // Migration function to fix existing data
  const migrateExistingVideos = async () => {
    setMigrating(true);
    try {
      console.log('🔄 Starting migration of existing videos...');
      
      const videosToMigrate = videos.filter(video => 
        video.video_url && !video.url // Jika ada video_url tapi tidak ada url
      );
      
      console.log(`📋 Videos to migrate: ${videosToMigrate.length}`);
      
      for (const video of videosToMigrate) {
        console.log(`🔄 Migrating video: ${video.judul}`);
        await updateDoc(doc(db, 'materi_penyakit', video.id), {
          url: video.video_url, // Copy dari video_url ke url
          updated_at: serverTimestamp()
        });
      }
      
      toast({
        title: 'Migration Successful!',
        description: `Berhasil migrasi ${videosToMigrate.length} video`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      fetchVideos(); // Refresh data
      
    } catch (error) {
      console.error('❌ Error migrating videos:', error);
      toast({
        title: 'Migration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMigrating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_penyakit: '',
      jenis_materi: 'video',
      judul: '',
      deskripsi: '',
      url: '',
      video_type: 'youtube'
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.nama_penyakit.trim()) {
        throw new Error('Nama penyakit harus diisi');
      }

      if (!formData.judul.trim()) {
        throw new Error('Judul video harus diisi');
      }

      if (!formData.url.trim()) {
        throw new Error('URL video harus diisi');
      }

      // Validasi URL YouTube
      if (formData.video_type === 'youtube') {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeRegex.test(formData.url)) {
          throw new Error('URL YouTube tidak valid. Gunakan format: https://youtube.com/watch?v=... atau https://youtu.be/...');
        }
      }

      console.log('🔄 Saving video to Firestore:', formData);

      const videoData = {
        nama_penyakit: formData.nama_penyakit.trim().toLowerCase(),
        jenis_materi: 'video',
        judul: formData.judul.trim(),
        deskripsi: formData.deskripsi.trim() || '',
        url: formData.url.trim(), // ✅ GUNAKAN 'url'
        video_type: formData.video_type,
        updated_at: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'materi_penyakit', editingId), videoData);
        toast({
          title: 'Video berhasil diperbarui!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        videoData.created_at = serverTimestamp();
        await addDoc(materiCollectionRef, videoData);
        toast({
          title: 'Video berhasil ditambahkan!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      resetForm();
      fetchVideos();
      setActiveTab(0);
      
    } catch (error) {
      console.error('❌ Error saving video:', error);
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

  const handleEdit = (video) => {
    console.log('✏️ Editing video:', video);
    // Prioritize url field, fallback to video_url for compatibility
    const videoUrl = video.url || video.video_url || '';
    
    setFormData({
      nama_penyakit: video.nama_penyakit || '',
      jenis_materi: video.jenis_materi || 'video',
      judul: video.judul || '',
      deskripsi: video.deskripsi || '',
      url: videoUrl,
      video_type: video.video_type || 'youtube'
    });
    setEditingId(video.id);
    setActiveTab(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

    try {
      await deleteDoc(doc(db, 'materi_penyakit', id));

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
    // Use url field, fallback to video_url for compatibility
    const videoUrl = video.url || video.video_url;
    
    if (!videoUrl) return '';
    
    if (video.video_type === 'youtube') {
      let videoId = '';
      
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop()?.split('?')[0];
      } else if (videoUrl.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        videoId = urlParams.get('v');
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
    }
    return videoUrl;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID');
    }
    
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  const uniquePenyakit = [...new Set(videos.map(video => video.nama_penyakit))].filter(Boolean);

  // Check if migration is needed
  const needsMigration = videos.some(video => video.video_url && !video.url);

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Video Edukasi</Heading>
            <Text color="gray.600">
              Tambah dan kelola video edukasi kesehatan untuk sistem skrining
            </Text>
          </Box>

          {/* Migration Alert */}
          {needsMigration && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Data Migration Required</Text>
                <Text fontSize="sm">
                  Beberapa video menggunakan field lama. Klik tombol di bawah untuk memperbaiki data secara otomatis.
                </Text>
              </Box>
              <Button
                leftIcon={<FiDatabase />}
                colorScheme="orange"
                isLoading={migrating}
                onClick={migrateExistingVideos}
                size="sm"
              >
                Migrasi Data
              </Button>
            </Alert>
          )}

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="blue.800" fontSize="2xl" fontWeight="bold">
                    {videos.length}
                  </Text>
                  <Text color="blue.600" fontSize="sm">Total Video</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="green.800" fontSize="2xl" fontWeight="bold">
                    {uniquePenyakit.length}
                  </Text>
                  <Text color="green.600" fontSize="sm">Jenis Penyakit</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="purple.50" border="1px" borderColor="purple.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="purple.800" fontSize="2xl" fontWeight="bold">
                    {videos.filter(v => v.video_type === 'youtube').length}
                  </Text>
                  <Text color="purple.600" fontSize="sm">Video YouTube</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Tabs index={activeTab} onChange={setActiveTab}>
                <TabList>
                  <Tab>Daftar Video ({videos.length})</Tab>
                  <Tab>{editingId ? 'Edit Video' : 'Tambah Video Baru'}</Tab>
                  <Tab>Preview Video</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Button
                          colorScheme="blue"
                          leftIcon={<FiPlus />}
                          onClick={() => {
                            resetForm();
                            setActiveTab(1);
                          }}
                        >
                          Tambah Video
                        </Button>
                        
                        <Button
                          variant="outline"
                          leftIcon={<FiRefreshCw />}
                          onClick={fetchVideos}
                          isLoading={loading}
                        >
                          Refresh
                        </Button>
                      </HStack>

                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="bold">Kompatibilitas Sistem Skrining</Text>
                          <Text fontSize="sm">
                            Video yang ditambahkan di sini akan otomatis muncul di hasil skrining 
                            ketika pengguna terindikasi penyakit yang sesuai.
                          </Text>
                        </Box>
                      </Alert>

                      {loading ? (
                        <Flex justify="center" py={8}>
                          <Spinner size="lg" color="blue.500" />
                        </Flex>
                      ) : videos.length === 0 ? (
                        <Box textAlign="center" py={8}>
                          <FiVideo size={48} color="#CBD5E0" />
                          <Text color="gray.500" mt={4}>
                            Belum ada video edukasi
                          </Text>
                          <Text fontSize="sm" color="gray.400" mt={2}>
                            Tambah video pertama Anda untuk sistem skrining
                          </Text>
                        </Box>
                      ) : (
                        <Box maxH="600px" overflowY="auto">
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>Judul</Th>
                                <Th>Penyakit</Th>
                                <Th>URL Status</Th>
                                <Th>Tanggal</Th>
                                <Th>Aksi</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {videos.map((video) => (
                                <Tr key={video.id} _hover={{ bg: 'gray.50' }}>
                                  <Td>
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="medium" noOfLines={1}>
                                        {video.judul}
                                      </Text>
                                      {video.deskripsi && (
                                        <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                          {video.deskripsi}
                                        </Text>
                                      )}
                                    </VStack>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme="blue" variant="subtle">
                                      {video.nama_penyakit}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <VStack spacing={1} align="start">
                                      <Badge 
                                        colorScheme={video.url ? "green" : video.video_url ? "orange" : "red"} 
                                        fontSize="xs"
                                      >
                                        {video.url ? "URL OK" : video.video_url ? "Need Migration" : "No URL"}
                                      </Badge>
                                      {video.video_url && !video.url && (
                                        <Text fontSize="xs" color="orange.600">
                                          Using old field
                                        </Text>
                                      )}
                                    </VStack>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm">
                                      {formatDate(video.created_at)}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <HStack spacing={1}>
                                      <IconButton
                                        icon={<FiEdit />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(video)}
                                        aria-label="Edit video"
                                      />
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
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="bold">Penting untuk Kompatibilitas</Text>
                          <Text fontSize="sm">
                            Pastikan "Nama Penyakit" sama persis dengan yang digunakan di pertanyaan skrining.
                            Contoh: "kardiovaskular", "diabetes", "anemia" (akan otomatis lowercase)
                          </Text>
                        </Box>
                      </Alert>

                      <form onSubmit={handleSubmit}>
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Nama Penyakit</FormLabel>
                              <Input
                                value={formData.nama_penyakit}
                                onChange={(e) => setFormData(prev => ({ ...prev, nama_penyakit: e.target.value }))}
                                placeholder="Contoh: Kardiovaskular, Diabetes, Anemia"
                              />
                              <Text fontSize="sm" color="gray.500" mt={1}>
                                Akan disimpan sebagai lowercase untuk konsistensi
                              </Text>
                            </FormControl>
                          </GridItem>

                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Judul Video</FormLabel>
                              <Input
                                value={formData.judul}
                                onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
                                placeholder="Judul video edukasi kesehatan"
                              />
                            </FormControl>
                          </GridItem>

                          <GridItem colSpan={{ base: 1, md: 2 }}>
                            <FormControl>
                              <FormLabel>Deskripsi Video</FormLabel>
                              <Textarea
                                value={formData.deskripsi}
                                onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                placeholder="Deskripsi singkat tentang video ini"
                                rows={3}
                              />
                            </FormControl>
                          </GridItem>

                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Tipe Video</FormLabel>
                              <Select
                                value={formData.video_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, video_type: e.target.value }))}
                              >
                                <option value="youtube">YouTube</option>
                                <option value="other" disabled>Lainnya (Coming Soon)</option>
                              </Select>
                            </FormControl>
                          </GridItem>

                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>URL Video</FormLabel>
                              <Input
                                value={formData.url}
                                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                              />
                              <Text fontSize="sm" color="gray.500" mt={1}>
                                Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                              </Text>
                            </FormControl>
                          </GridItem>
                        </Grid>

                        <HStack spacing={3} mt={6}>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={submitting}
                            loadingText="Menyimpan..."
                            leftIcon={<FiVideo />}
                            flex={1}
                          >
                            {editingId ? 'Update Video' : 'Tambah Video'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              resetForm();
                              setActiveTab(0);
                            }}
                          >
                            Batal
                          </Button>
                        </HStack>
                      </form>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    {videos.length === 0 ? (
                      <Box textAlign="center" py={8}>
                        <FiVideo size={48} color="#CBD5E0" />
                        <Text color="gray.500" mt={4}>
                          Belum ada video untuk dipreview
                        </Text>
                      </Box>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {videos.map((video) => {
                          const previewUrl = previewVideo(video);
                          return (
                            <Box key={video.id} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                              <Box
                                position="relative"
                                paddingBottom="56.25%"
                                height="0"
                                overflow="hidden"
                                bg="gray.100"
                              >
                                {previewUrl ? (
                                  <iframe
                                    src={previewUrl}
                                    title={video.judul}
                                    width="100%"
                                    height="100%"
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <Box 
                                    position="absolute" 
                                    top="0" 
                                    left="0" 
                                    right="0" 
                                    bottom="0" 
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="center"
                                    flexDirection="column"
                                    bg="gray.200"
                                  >
                                    <FiVideo size={32} color="#718096" />
                                    <Text color="gray.500" mt={2} fontSize="sm">
                                      No URL Available
                                    </Text>
                                  </Box>
                                )}
                              </Box>
                              <Box p={4}>
                                <Text fontWeight="medium" noOfLines={2} mb={2}>
                                  {video.judul}
                                </Text>
                                <Badge colorScheme="blue" mb={2} fontSize="xs">
                                  {video.nama_penyakit}
                                </Badge>
                                {video.deskripsi && (
                                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                    {video.deskripsi}
                                  </Text>
                                )}
                                <HStack mt={2} justify="space-between">
                                  <Badge colorScheme="green" fontSize="xs">
                                    {formatDate(video.created_at)}
                                  </Badge>
                                  <Badge 
                                    colorScheme={video.url ? "green" : video.video_url ? "orange" : "red"} 
                                    fontSize="xs"
                                  >
                                    {video.url ? "URL OK" : video.video_url ? "Legacy" : "No URL"}
                                  </Badge>
                                </HStack>
                              </Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </AdminLayout>
  );
}