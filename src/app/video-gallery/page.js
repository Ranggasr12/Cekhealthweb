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
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiYoutube, FiVideo, FiRefreshCw, FiPlay } from 'react-icons/fi';

export default function VideoGallery() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching videos from Firestore...');
      
      const videosQuery = query(
        collection(db, 'videos'), 
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(videosQuery);
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Videos fetched:', videosData.length);
      setVideos(videosData);
      
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setError('Gagal memuat video. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  const handleBack = () => {
    router.push('/');
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return '/images/video-placeholder.jpg';
    
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        
        if (url.includes('youtu.be')) {
          videoId = url.split('/').pop()?.split('?')[0];
        } else if (url.includes('youtube.com')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v');
        }
        
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
    
    return '/images/video-placeholder.jpg';
  };

  const getEmbedUrl = (video) => {
    if (video.video_type === 'youtube') {
      let videoId = '';
      
      if (video.video_url.includes('youtu.be')) {
        videoId = video.video_url.split('/').pop()?.split('?')[0];
      } else {
        try {
          const urlObj = new URL(video.video_url);
          videoId = urlObj.searchParams.get('v');
        } catch (error) {
          console.error('Error parsing YouTube URL:', error);
        }
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`;
      }
    }
    
    return video.video_url;
  };

  const getVideoTypeIcon = (videoType) => {
    return videoType === 'youtube' ? FiYoutube : FiVideo;
  };

  const getVideoTypeColor = (videoType) => {
    return videoType === 'youtube' ? 'red' : 'blue';
  };

  const handleThumbnailError = (video, event) => {
    console.log('🔄 Falling back to lower quality thumbnail for:', video.title);
    
    if (video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')) {
      let videoId = '';
      
      if (video.video_url.includes('youtu.be')) {
        videoId = video.video_url.split('/').pop()?.split('?')[0];
      } else {
        try {
          const urlObj = new URL(video.video_url);
          videoId = urlObj.searchParams.get('v');
        } catch (error) {
          console.error('Error parsing YouTube URL:', error);
        }
      }
      
      if (videoId) {
        event.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="purple.800">
              Video Gallery
            </Heading>
            <Text color="gray.600" fontSize={{ base: "lg", md: "xl" }}>
              Kumpulan video edukasi tentang kesehatan dan pola hidup sehat
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
                Belum Ada Video
              </Heading>
              <Text color="gray.500">
                Video edukasi akan segera tersedia. Silakan cek kembali nanti.
              </Text>
            </Box>
          ) : (
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3 }} 
              spacing={{ base: 4, md: 6, lg: 8 }} 
              w="100%"
            >
              {videos.map((video) => (
                <Box
                  key={video.id}
                  bg="white"
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
                >
                  {/* Thumbnail Container */}
                  <Box
                    position="relative"
                    paddingBottom="56.25%" // 16:9 aspect ratio
                    bg="gray.200"
                    overflow="hidden"
                  >
                    {/* YouTube Thumbnail */}
                    <Image
                      src={getYouTubeThumbnail(video.video_url)}
                      alt={video.title}
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      onError={(e) => handleThumbnailError(video, e)}
                    />
                    
                    {/* Play Button Overlay */}
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      bg="black"
                      opacity="0"
                      transition="opacity 0.3s"
                      _hover={{ opacity: 0.2 }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        borderRadius="50%"
                        width="60px"
                        height="60px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.3s"
                        _hover={{
                          transform: "scale(1.1)",
                          bg: "rgba(0,0,0,0.9)"
                        }}
                      >
                        <Icon as={FiPlay} boxSize={6} color="white" />
                      </Box>
                    </Box>
                    
                    {/* Video Type Badge */}
                    <Box
                      position="absolute"
                      top={3}
                      left={3}
                    >
                      <Badge 
                        colorScheme={getVideoTypeColor(video.video_type)}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        <Icon as={getVideoTypeIcon(video.video_type)} boxSize={3} />
                        {video.video_type === 'youtube' ? 'YouTube' : 'Video'}
                      </Badge>
                    </Box>
                  </Box>
                  
                  {/* Video Info */}
                  <Box p={{ base: 4, md: 6 }}>
                    <Heading as="h3" size={{ base: "sm", md: "md" }} mb={2} color="purple.700" noOfLines={2}>
                      {video.title}
                    </Heading>
                    
                    {video.description && (
                      <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} mb={3} noOfLines={3}>
                        {video.description}
                      </Text>
                    )}
                    
                    <HStack justify="space-between" fontSize="xs" color="gray.500">
                      <Text>
                        {formatDate(video.created_at)}
                      </Text>
                      <Badge colorScheme="purple" variant="subtle">
                        Edukasi
                      </Badge>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}

          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="outline"
            colorScheme="purple"
            size="lg"
          >
            Kembali ke Beranda
          </Button>
        </VStack>
      </Container>

      {/* Video Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "4xl" }}>
        <ModalOverlay />
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
                <Box
                  position="relative"
                  paddingBottom="56.25%"
                  height="0"
                  overflow="hidden"
                  borderRadius="md"
                  bg="black"
                >
                  <iframe
                    src={getEmbedUrl(selectedVideo)}
                    title={selectedVideo.title}
                    width="100%"
                    height="100%"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "8px"
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
                
                {selectedVideo.description && (
                  <Text mt={4} color="gray.600" fontSize="lg">
                    {selectedVideo.description}
                  </Text>
                )}
                
                <HStack mt={4} fontSize="sm" color="gray.500">
                  <Text>Ditambahkan pada:</Text>
                  <Text fontWeight="medium">
                    {formatDate(selectedVideo.created_at)}
                  </Text>
                </HStack>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}