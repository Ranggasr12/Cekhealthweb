"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  VStack,
  SimpleGrid,
  Container,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { FiHeart, FiVideo, FiFileText, FiUsers } from 'react-icons/fi';

// SVG Icon untuk Chevron Down
const ChevronDownIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
  </svg>
);

const features = [
  {
    icon: FiHeart,
    title: 'Cek Kesehatan',
    description: 'Periksa kondisi kesehatan Anda dengan alat kami yang terpercaya',
    color: 'purple',
  },
  {
    icon: FiVideo,
    title: 'Video Edukasi',
    description: 'Belajar kesehatan melalui video edukatif dari profesional',
    color: 'pink',
  },
  {
    icon: FiFileText,
    title: 'Konsultasi Online',
    description: 'Konsultasi dengan dokter profesional secara online',
    color: 'blue',
  },
  {
    icon: FiUsers,
    title: 'Komunitas',
    description: 'Bergabung dengan komunitas peduli kesehatan',
    color: 'green',
  },
];

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    router.push('/form');
  };

  const bgGradient = useColorModeValue(
    'linear(to-r, white 40%, purple.50 100%)',
    'linear(to-r, gray.900 40%, purple.900 100%)'
  );

  // Loading state
  if (!isClient) {
    return (
      <Box bg="white" minH="100vh" w="100vw" overflowX="hidden">
        <Box
          position="relative"
          w="100vw"
          minH="100vh"
          overflow="hidden"
          bgGradient={bgGradient}
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="center"
            minH="100vh"
            w="100%"
            maxW="1400px"
            mx="auto"
            px={{ base: 4, md: 6, lg: 20 }}
          >
            <Box flex="1" textAlign="center" w="100%">
              <Skeleton height={{ base: "40px", md: "50px" }} mb={3} />
              <Skeleton height={{ base: "35px", md: "40px" }} mb={5} />
              <Skeleton height="20px" maxW="450px" mb={6} mx="auto" />
              <Skeleton height="50px" width="150px" borderRadius="full" mx="auto" />
            </Box>
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="white" minH="100vh" w="100vw" overflowX="hidden">
      {/* Hero Section */}
      <Box
        position="relative"
        w="100vw"
        minH="100vh"
        overflow="hidden"
        bgGradient={bgGradient}
      >
        {/* Background Wave dengan Gradient */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="100%"
          h="250px"
          zIndex={1}
        >
          <Box
            w="100%"
            h="100%"
            backgroundImage="url('/images/wave.svg')"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="bottom"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
              zIndex: 10
            }}
          />
        </Box>

        {/* Dekorasi Circles */}
        <Circle
          size={{ base: "140px", md: "220px" }}
          bgGradient="linear(45deg, purple.400 0%, purple.200 50%, pink.300 100%)"
          opacity="0.3"
          filter="blur(8px)"
          position="absolute"
          top={{ base: "15%", md: "20%" }}
          right={{ base: "10%", md: "18%" }}
          zIndex={0}
        />

        <Circle
          size={{ base: "80px", md: "120px" }}
          bgGradient="linear(135deg, pink.400 0%, purple.300 50%, blue.200 100%)"
          opacity="0.25"
          filter="blur(6px)"
          position="absolute"
          bottom={{ base: "30%", md: "25%" }}
          right={{ base: "20%", md: "35%" }}
          zIndex={0}
        />

        {/* Konten utama - DITURUNKAN POSISINYA */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="center"
          minH="100vh"
          w="100%"
          maxW="1400px"
          mx="auto"
          px={{ base: 4, md: 6, lg: 20 }}
          position="relative"
          zIndex={2}
          // DITURUNKAN: margin top dikurangi atau dihapus
          mt={{ base: "40px", md: "60px", lg: "80px" }} // DARI -60px MENJADI 40px
        >
          <Box 
            flex="1"
            zIndex={2}
            textAlign="center"
            w="100%"
            maxW="800px"
          >
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              mb={{ base: 3, md: 4 }}
              color="purple.800"
              fontWeight="extrabold"
              lineHeight="1.1"
            >
              Ayo Periksakan
            </Heading>
            <Heading
              as="h2"
              size={{ base: "lg", md: "xl", lg: "2xl" }}
              mb={{ base: 4, md: 5 }}
              color="purple.500"
              fontWeight="extrabold"
              lineHeight="1.1"
            >
              Tentang Keadaan Kesehatanmu
            </Heading>
            <Text 
              color="gray.600" 
              mb={{ base: 6, md: 8 }}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.5"
              mx="auto"
              maxW="500px"
            >
              Platform kesehatan terpercaya untuk memantau kondisi kesehatan Anda dengan mudah dan akurat
            </Text>
            
            <Button
              size={{ base: "md", md: "lg" }}
              borderRadius="full"
              px={{ base: 10, md: 12 }}
              py={{ base: 6, md: 7 }}
              bgGradient="linear(to-r, purple.500, pink.500)"
              color="white"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              _hover={{
                transform: "scale(1.05)",
                bgGradient: "linear(to-r, purple.600, pink.600)",
                boxShadow: "2xl"
              }}
              onClick={handleGetStarted}
              mx="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
              minW={{ base: "160px", md: "180px" }}
              minH={{ base: "52px", md: "60px" }}
              mt={{ base: 2, md: 4 }}
            >
              Mulai Sekarang
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Features Section */}
      <Container maxW="1200px" py={20}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center" maxW="600px" mx="auto">
            <Heading as="h2" size="2xl" color="purple.800">
              Layanan Kami
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Berbagai layanan kesehatan yang tersedia untuk membantu Anda menjaga kesehatan
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="100%">
            {features.map((feature, index) => (
              <Box
                key={index}
                p={6}
                borderRadius="xl"
                bg="white"
                boxShadow="xl"
                border="1px"
                borderColor="gray.100"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                }}
              >
                <Flex
                  w={16}
                  h={16}
                  bgGradient={`linear(to-r, ${feature.color}.500, ${feature.color}.300)`}
                  borderRadius="full"
                  align="center"
                  justify="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={feature.icon} w={8} h={8} color="white" />
                </Flex>
                <Heading as="h3" size="lg" mb={3} color="gray.800">
                  {feature.title}
                </Heading>
                <Text color="gray.600" lineHeight="1.6">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box
        bgGradient="linear(to-r, purple.500, pink.500)"
        color="white"
        py={20}
      >
        <Container maxW="1200px">
          <VStack spacing={6} textAlign="center">
            <Heading as="h2" size="2xl">
              Siap Memulai Perjalanan Kesehatan Anda?
            </Heading>
            <Text fontSize="xl" maxW="600px">
              Bergabung dengan ribuan orang yang telah mempercayai kesehatan mereka pada kami
            </Text>
            <Button
              size="lg"
              colorScheme="white"
              variant="outline"
              _hover={{
                bg: "white",
                color: "purple.500",
              }}
              onClick={handleGetStarted}
            >
              Cek Kesehatan Gratis
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Modal untuk Menampilkan Video */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "4xl" }}>
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: 4 }}>
          <ModalHeader>Video Kesehatan</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box
              position="relative"
              paddingBottom="56.25%" // 16:9 aspect ratio
              height="0"
              overflow="hidden"
              borderRadius="md"
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Video Kesehatan"
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
            <Text mt={4} color="gray.600" textAlign="center">
              Tips menjaga kesehatan sehari-hari
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}