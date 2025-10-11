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
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

export default function VideoGallery() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videos = [
    {
      id: 1,
      title: "Tips Kesehatan Dasar",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Video tentang tips menjaga kesehatan sehari-hari",
      thumbnail: "/images/video-thumb-1.jpg",
      duration: "5:30"
    },
    {
      id: 2,
      title: "Pola Hidup Sehat", 
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Panduan pola hidup sehat untuk semua usia",
      thumbnail: "/images/video-thumb-2.jpg",
      duration: "8:15"
    },
    {
      id: 3,
      title: "Olahraga di Rumah",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Latihan olahraga sederhana yang bisa dilakukan di rumah",
      thumbnail: "/images/video-thumb-3.jpg",
      duration: "12:45"
    },
    {
      id: 4,
      title: "Makanan Sehat",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Rekomendasi makanan sehat untuk keluarga",
      thumbnail: "/images/video-thumb-4.jpg",
      duration: "7:20"
    },
    {
      id: 5,
      title: "Pencegahan Diabetes",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Cara mencegah dan mengelola diabetes",
      thumbnail: "/images/video-thumb-5.jpg",
      duration: "10:30"
    },
    {
      id: 6,
      title: "Kesehatan Mental",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Tips menjaga kesehatan mental di era modern",
      thumbnail: "/images/video-thumb-6.jpg",
      duration: "15:20"
    }
  ];

  const openVideo = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!isClient) {
    return (
      <Box bg="white" minH="100vh">
        <Container maxW="container.xl" py={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} height="300px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="purple.800">
              Video Gallery
            </Heading>
            <Text color="gray.600" fontSize={{ base: "lg", md: "xl" }}>
              Kumpulan video edukasi tentang kesehatan dan pola hidup sehat
            </Text>
          </Box>

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
                <Box
                  position="relative"
                  paddingBottom="56.25%"
                  bg="gray.200"
                  backgroundImage={`url(${video.thumbnail})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                >
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="black"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="md"
                    opacity="0.9"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    ▶ Play
                  </Box>
                  <Box
                    position="absolute"
                    bottom={2}
                    right={2}
                    bg="black"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="sm"
                    fontSize="sm"
                  >
                    {video.duration}
                  </Box>
                </Box>
                
                <Box p={{ base: 4, md: 6 }}>
                  <Heading as="h3" size={{ base: "sm", md: "md" }} mb={2} color="purple.700">
                    {video.title}
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                    {video.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "4xl" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedVideo?.title}</ModalHeader>
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
                >
                  <iframe
                    src={selectedVideo.url}
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
                    allowFullScreen
                  />
                </Box>
                <Text mt={4} color="gray.600">
                  {selectedVideo.description}
                </Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}