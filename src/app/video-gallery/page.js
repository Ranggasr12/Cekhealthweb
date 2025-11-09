"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Alert,
  AlertIcon,
  Flex,
  Badge,
  HStack,
  Icon,
  Image,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  AspectRatio,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiYoutube, FiVideo, FiRefreshCw, FiPlay, FiSearch, FiExternalLink } from 'react-icons/fi';

export default function VideoGallery() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPenyakit, setFilterPenyakit] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ DIPERBAIKI: Fetch videos dengan kompatibilitas field 'url'
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching videos from Firestore...');
      
      const videosQuery = query(
        collection(db, 'materi_penyakit'), 
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(videosQuery);
      
      // ✅ DIPERBAIKI: Format data dengan kompatibilitas field 'url'
      const videosData = querySnapshot.docs
        .map(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          };
          
          // ✅ FALLBACK: Jika url tidak ada, gunakan video_url
          if (!data.url && data.video_url) {
            console.log(`🔄 Using fallback for video ${data.judul}: video_url -> url`);
            data.url = data.video_url;
          }
          
          return data;
        })
        .filter(item => item.jenis_materi === 'video')
        .map(video => ({
          id: video.id,
          title: video.judul || 'Video Edukasi',
          description: video.deskripsi || '',
          url: video.url, // ✅ GUNAKAN 'url' BUKAN 'video_url'
          video_type: video.video_type || 'youtube',
          nama_penyakit: video.nama_penyakit || 'Kesehatan Umum',
          created_at: video.created_at,
          judul: video.judul, // Keep original field for compatibility
          deskripsi: video.deskripsi,
        }));

      console.log('✅ Videos fetched:', videosData);
      console.log('📋 Sample video data:', videosData[0]);
      
      setVideos(videosData);
      setFilteredVideos(videosData);
      
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setError('Gagal memuat video. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  // Filter videos berdasarkan search dan filter
  useEffect(() => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPenyakit) {
      filtered = filtered.filter(video => video.nama_penyakit === filterPenyakit);
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, filterPenyakit]);

  const openVideo = (video) => {
    console.log('🎬 Opening video:', {
      title: video.title,
      url: video.url,
      hasUrl: !!video.url
    });
    setSelectedVideo(video);
    onOpen();
  };

  const handleBack = () => {
    router.push('/');
  };

  // ✅ DIPERBAIKI: Thumbnail generator dengan kompatibilitas
  const getYouTubeThumbnail = (url) => {
    if (!url) {
      console.log('❌ No URL provided for thumbnail');
      return '/images/video-placeholder.jpg';
    }
    
    try {
      console.log('🔄 Generating thumbnail for URL:', url);
      
      let videoId = '';
      
      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop()?.split('?')[0];
        console.log('✅ YouTube ID from youtu.be:', videoId);
      } else if (url.includes('youtube.com')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
        console.log('✅ YouTube ID from youtube.com:', videoId);
      }
      
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        console.log('✅ Generated thumbnail URL:', thumbnailUrl);
        return thumbnailUrl;
      }
    } catch (error) {
      console.error('❌ Error generating thumbnail:', error);
    }
    
    console.log('❌ Using fallback placeholder');
    return '/images/video-placeholder.jpg';
  };

  // ✅ DIPERBAIKI: Embed URL generator
  const getEmbedUrl = (video) => {
    if (!video.url) {
      console.log('❌ No URL for embed');
      return '';
    }
    
    console.log('🎥 Generating embed URL for:', video.title);
    
    if (video.video_type === 'youtube') {
      let videoId = '';
      
      if (video.url.includes('youtu.be')) {
        videoId = video.url.split('/').pop()?.split('?')[0];
      } else {
        try {
          const urlObj = new URL(video.url);
          videoId = urlObj.searchParams.get('v');
        } catch (error) {
          console.error('Error parsing YouTube URL:', error);
        }
      }
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=1`;
        console.log('✅ Embed URL generated:', embedUrl);
        return embedUrl;
      }
    }
    
    console.log('❌ No embed URL generated');
    return video.url;
  };

  const getVideoTypeIcon = (videoType) => {
    return videoType === 'youtube' ? FiYoutube : FiVideo;
  };

  const getVideoTypeColor = (videoType) => {
    return videoType === 'youtube' ? 'red' : 'blue';
  };

  const handleThumbnailError = (video, event) => {
    console.log('🔄 Falling back to lower quality thumbnail for:', video.title);
    
    if (video.url && (video.url.includes('youtube.com') || video.url.includes('youtu.be'))) {
      let videoId = '';
      
      if (video.url.includes('youtu.be')) {
        videoId = video.url.split('/').pop()?.split('?')[0];
      } else {
        try {
          const urlObj = new URL(video.url);
          videoId = urlObj.searchParams.get('v');
        } catch (error) {
          console.error('Error parsing YouTube URL:', error);
        }
      }
      
      if (videoId) {
        // Try HQ default first, then MQ default
        event.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        console.log('🔄 Trying HQ thumbnail');
        
        event.target.onerror = () => {
          event.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          console.log('🔄 Trying MQ thumbnail');
          
          event.target.onerror = () => {
            event.target.src = '/images/video-placeholder.jpg';
            console.log('🔄 Using placeholder');
          };
        };
      }
    } else {
      event.target.src = '/images/video-placeholder.jpg';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID');
    }
    
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  // Get unique penyakit untuk filter
  const uniquePenyakit = [...new Set(videos.map(video => video.nama_penyakit))].filter(Boolean);

  // ✅ DIPERBAIKI: Komponen Video Card yang lebih baik
  const VideoCard = ({ video }) => {
    const thumbnailUrl = getYouTubeThumbnail(video.url);
    
    console.log('🎬 Rendering VideoCard:', {
      title: video.title,
      url: video.url,
      thumbnailUrl: thumbnailUrl,
      hasUrl: !!video.url
    });

    return (
      <Card
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        cursor="pointer"
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "2xl"
        }}
        onClick={() => openVideo(video)}
        height="100%"
        bg="white"
      >
        {/* Thumbnail Container */}
        <Box position="relative" bg="gray.200">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={thumbnailUrl}
              alt={video.title}
              objectFit="cover"
              onError={(e) => handleThumbnailError(video, e)}
              fallback={
                <Box 
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                  width="100%" 
                  height="100%" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Icon as={FiVideo} boxSize={8} color="white" />
                  <Text color="white" mt={2} fontWeight="medium">
                    Video Preview
                  </Text>
                </Box>
              }
            />
          </AspectRatio>
          
          {/* Play Button Overlay */}
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="blackAlpha.400"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s"
            _hover={{ bg: 'blackAlpha.200' }}
          >
            <Box
              bg="red.600"
              borderRadius="full"
              p={4}
              boxShadow="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="70px"
              height="70px"
              transition="all 0.3s"
              _hover={{
                transform: "scale(1.1)",
                bg: "red.700"
              }}
            >
              <Icon as={FiPlay} boxSize={6} color="white" />
            </Box>
          </Box>
          
          {/* Video Type Badge */}
          <Box position="absolute" top={3} left={3}>
            <Badge 
              colorScheme={getVideoTypeColor(video.video_type)}
              display="flex"
              alignItems="center"
              gap={1}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
            >
              <Icon as={getVideoTypeIcon(video.video_type)} boxSize={3} />
              {video.video_type === 'youtube' ? 'YouTube' : 'Video'}
            </Badge>
          </Box>

          {/* Penyakit Badge */}
          <Box position="absolute" top={3} right={3}>
            <Badge 
              colorScheme="blue"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
            >
              {video.nama_penyakit}
            </Badge>
          </Box>
        </Box>
        
        {/* Video Info */}
        <CardBody p={4}>
          <VStack spacing={3} align="start" height="100%">
            <Heading as="h3" size="sm" color="gray.800" noOfLines={2} lineHeight="1.3">
              {video.title}
            </Heading>
            
            {video.description && (
              <Text color="gray.600" fontSize="sm" noOfLines={3} lineHeight="1.4">
                {video.description}
              </Text>
            )}
            
            <Box flex={1} />
            
            <HStack justify="space-between" width="100%" fontSize="xs" color="gray.500">
              <Text>
                {formatDate(video.created_at)}
              </Text>
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                {video.nama_penyakit}
              </Badge>
            </HStack>

            {/* External Link Button */}
            {video.url && (
              <Button
                as="a"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="outline"
                colorScheme="blue"
                rightIcon={<FiExternalLink />}
                w="full"
                onClick={(e) => e.stopPropagation()}
              >
                Buka di YouTube
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Box textAlign="center">
              <Skeleton height="40px" width="300px" mx="auto" mb={4} />
              <Skeleton height="24px" width="400px" mx="auto" />
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box key={item} bg="white" borderRadius="xl" boxShadow="lg" overflow="hidden">
                  <Skeleton height="200px" />
                  <Box p={4}>
                    <Skeleton height="20px" mb={2} />
                    <Skeleton height="16px" />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="blue.800">
              Video Gallery Edukasi Kesehatan
            </Heading>
            <Text color="gray.600" fontSize={{ base: "lg", md: "xl" }}>
              Kumpulan video edukasi tentang penyakit dan pola hidup sehat
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="lg" maxW="2xl">
              <AlertIcon />
              <Box flex="1">
                <Text>{error}</Text>
                <Button 
                  size="sm" 
                  colorScheme="red" 
                  variant="outline" 
                  mt={2}
                  leftIcon={<FiRefreshCw />}
                  onClick={fetchVideos}
                >
                  Coba Lagi
                </Button>
              </Box>
            </Alert>
          )}

          {/* Search and Filter Section */}
          {videos.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%" maxW="4xl">
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Cari video edukasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                placeholder="Semua Kategori"
                value={filterPenyakit}
                onChange={(e) => setFilterPenyakit(e.target.value)}
              >
                {uniquePenyakit.map(penyakit => (
                  <option key={penyakit} value={penyakit}>
                    {penyakit}
                  </option>
                ))}
              </Select>
            </SimpleGrid>
          )}

          {/* Results Info */}
          {videos.length > 0 && (
            <HStack justify="space-between" w="100%" maxW="4xl">
              <Text color="gray.600" fontSize="sm">
                Menampilkan {filteredVideos.length} dari {videos.length} video
              </Text>
              {(searchTerm || filterPenyakit) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterPenyakit('');
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </HStack>
          )}

          {/* Video Grid */}
          {videos.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Icon 
                as={FiVideo} 
                boxSize={16} 
                color="gray.400" 
                mb={4} 
              />
              <Heading size="lg" color="gray.500" mb={2}>
                Belum Ada Video Edukasi
              </Heading>
              <Text color="gray.500" mb={4}>
                Video edukasi kesehatan akan segera tersedia.
              </Text>
              <Button
                colorScheme="blue"
                onClick={fetchVideos}
                leftIcon={<FiRefreshCw />}
              >
                Refresh
              </Button>
            </Box>
          ) : filteredVideos.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Icon 
                as={FiSearch} 
                boxSize={16} 
                color="gray.400" 
                mb={4} 
              />
              <Heading size="lg" color="gray.500" mb={2}>
                Tidak Ditemukan
              </Heading>
              <Text color="gray.500" mb={4}>
                Tidak ada video yang sesuai dengan pencarian Anda.
              </Text>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterPenyakit('');
                }}
              >
                Tampilkan Semua Video
              </Button>
            </Box>
          ) : (
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
              spacing={6} 
              w="100%"
            >
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </SimpleGrid>
          )}

          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="outline"
            colorScheme="blue"
            size="lg"
          >
            Kembali ke Beranda
          </Button>
        </VStack>
      </Container>

      {/* Video Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "6xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={getVideoTypeIcon(selectedVideo?.video_type)} 
                color={getVideoTypeColor(selectedVideo?.video_type)} 
              />
              <Text>{selectedVideo?.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedVideo && (
              <>
                <AspectRatio ratio={16 / 9} mb={4}>
                  <Box 
                    as="iframe" 
                    src={getEmbedUrl(selectedVideo)}
                    title={selectedVideo.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    borderRadius="md"
                  />
                </AspectRatio>
                
                {selectedVideo.description && (
                  <Text color="gray.600" fontSize="lg" mb={4}>
                    {selectedVideo.description}
                  </Text>
                )}
                
                <HStack justify="space-between" fontSize="sm" color="gray.500">
                  <Text>
                    <strong>Kategori:</strong> {selectedVideo.nama_penyakit}
                  </Text>
                  <Text>
                    Ditambahkan: {formatDate(selectedVideo.created_at)}
                  </Text>
                </HStack>

                {selectedVideo.url && (
                  <Button
                    as="a"
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="red"
                    size="sm"
                    rightIcon={<FiExternalLink />}
                    mt={4}
                  >
                    Tonton di YouTube
                  </Button>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}