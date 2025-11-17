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
  Card,
  CardBody,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { FiHeart, FiVideo, FiFileText, FiUsers, FiArrowRight } from 'react-icons/fi';

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

// Data penyakit berdasarkan statistik yang Anda berikan - 8 JENIS
const penyakitList = [
  {
    id: 1,
    name: 'Sistem Pernapasan',
    description: 'Pemeriksaan kesehatan paru-paru dan saluran pernapasan',
    color: 'blue',
    pertanyaan: 10,
    icon: '🫁',
    urutan: 1
  },
  {
    id: 2,
    name: 'Sistem Kardiovaskuler',
    description: 'Pemeriksaan kesehatan jantung dan pembuluh darah',
    color: 'red',
    pertanyaan: 10,
    icon: '❤️',
    urutan: 2
  },
  {
    id: 3,
    name: 'Sistem Pencernaan',
    description: 'Pemeriksaan kesehatan lambung, usus, dan organ pencernaan',
    color: 'orange',
    pertanyaan: 10,
    icon: '🍎',
    urutan: 3
  },
  {
    id: 4,
    name: 'Istirahat Tidur',
    description: 'Pemeriksaan kualitas tidur dan pola istirahat',
    color: 'purple',
    pertanyaan: 10,
    icon: '😴',
    urutan: 4
  },
  {
    id: 5,
    name: 'Sistem Perkemihan',
    description: 'Pemeriksaan kesehatan ginjal dan saluran kemih',
    color: 'green',
    pertanyaan: 10,
    icon: '💧',
    urutan: 5
  },
  {
    id: 6,
    name: 'Gangguan Nutrisi',
    description: 'Pemeriksaan status gizi dan pola makan',
    color: 'teal',
    pertanyaan: 10,
    icon: '⚖️',
    urutan: 6
  },
  {
    id: 7,
    name: 'Sistem Saraf',
    description: 'Pemeriksaan kesehatan otak dan sistem saraf',
    color: 'pink',
    pertanyaan: 10,
    icon: '🧠',
    urutan: 7
  },
  {
    id: 8,
    name: 'Endokrin',
    description: 'Pemeriksaan kesehatan hormon dan kelenjar',
    color: 'yellow',
    pertanyaan: 10,
    icon: '⚕️',
    urutan: 8
  }
];

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const [showPenyakitSelection, setShowPenyakitSelection] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    setShowPenyakitSelection(true);
  };

  const handlePilihPenyakit = (penyakitId) => {
    // Navigasi ke form page dengan parameter penyakit yang dipilih
    router.push(`/form?penyakit=${penyakitId}`);
  };

  const handleBackToHome = () => {
    setShowPenyakitSelection(false);
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

  // TAMPILAN PEMILIHAN PENYAKIT
  if (showPenyakitSelection) {
    return (
      <Box bg="white" minH="100vh" w="100vw" overflowX="hidden">
        <Container maxW="1200px" py={10}>
          <VStack spacing={8}>
            {/* Header */}
            <Box textAlign="center">
              <Button 
                variant="outline" 
                colorScheme="purple" 
                mb={6}
                onClick={handleBackToHome}
                leftIcon={<ChevronDownIcon style={{ transform: 'rotate(90deg)' }} />}
              >
                Kembali
              </Button>
              <Heading as="h1" size="2xl" mb={3} color="purple.800">
                Pilih Jenis Pemeriksaan
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Silahkan pilih dengan keluhan yang anda rasakan
              </Text>
            </Box>

            {/* Grid Penyakit - 2x4 Layout */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} w="100%">
              {penyakitList.map((penyakit) => (
                <Card 
                  key={penyakit.id}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor="gray.100"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "2xl",
                  }}
                  cursor="pointer"
                  onClick={() => handlePilihPenyakit(penyakit.id)}
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      <HStack justify="space-between" w="100%">
                        <Box>
                          <Text fontSize="3xl" mb={2}>{penyakit.icon}</Text>
                          <Heading as="h3" size="lg" color="gray.800">
                            {penyakit.name}
                          </Heading>
                        </Box>
                        <Badge colorScheme={penyakit.color} fontSize="md" px={3} py={1}>
                          Urutan {penyakit.urutan}
                        </Badge>
                      </HStack>
                      
                      <Text color="gray.600" lineHeight="1.6">
                        {penyakit.description}
                      </Text>
                      
                      <HStack w="100%" justify="space-between">
                        <Badge colorScheme="blue" variant="outline">
                          {penyakit.pertanyaan} pertanyaan
                        </Badge>
                        <Button
                          rightIcon={<FiArrowRight />}
                          colorScheme={penyakit.color}
                          variant="outline"
                          size="sm"
                        >
                          Mulai Pemeriksaan
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Info Tambahan */}
            <Box textAlign="center" mt={8}>
              <Text color="gray.500" fontSize="sm">
                Pilih salah satu sistem tubuh di atas untuk memulai pemeriksaan kesehatan Anda
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN HOME BIASA
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
        {/* Background Wave dengan Gradient - DIPINDAHKAN KE BAWAH */}
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

        {/* Dekorasi Circles - DIKECILKAN DAN DIPINDAHKAN */}
        <Circle
          size={{ base: "100px", md: "160px" }}
          bgGradient="linear(45deg, purple.400 0%, purple.200 50%, pink.300 100%)"
          opacity="0.2"
          filter="blur(6px)"
          position="absolute"
          top={{ base: "10%", md: "15%" }}
          right={{ base: "5%", md: "10%" }}
          zIndex={0}
        />

        <Circle
          size={{ base: "60px", md: "80px" }}
          bgGradient="linear(135deg, pink.400 0%, purple.300 50%, blue.200 100%)"
          opacity="0.15"
          filter="blur(4px)"
          position="absolute"
          top={{ base: "25%", md: "30%" }}
          right={{ base: "15%", md: "25%" }}
          zIndex={0}
        />

        {/* Konten utama - DINAIIKKAN KE ATAS */}
        <Flex
          direction="column"
          align="center"
          justify="flex-start"
          minH="100vh"
          w="100%"
          maxW="1400px"
          mx="auto"
          px={{ base: 6, md: 8, lg: 10 }}
          position="relative"
          zIndex={2}
          pt={{ base: "120px", md: "140px", lg: "160px" }}
        >
          <Box 
            zIndex={2}
            textAlign="center"
            w="100%"
            maxW="800px"
          >
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              mb={{ base: 4, md: 5 }}
              color="purple.800"
              fontWeight="extrabold"
              lineHeight="1.1"
            >
              Ayo Periksa
            </Heading>
            <Heading
              as="h2"
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              mb={{ base: 6, md: 7 }}
              color="purple.500"
              fontWeight="extrabold"
              lineHeight="1.1"
            >
              Kesehatanmu
            </Heading>
            <Text 
              color="gray.600" 
              mb={{ base: 8, md: 10 }}
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.6"
              mx="auto"
              maxW="500px"
            >
              Skrining ini untuk mendeteksi gejala masalah kesehatan yang anda rasakan
            </Text>
            
            <Button
              size={{ base: "lg", md: "xl" }}
              borderRadius="full"
              px={{ base: 12, md: 14 }}
              py={{ base: 7, md: 8 }}
              bgGradient="linear(to-r, purple.500, pink.500)"
              color="white"
              fontSize={{ base: "xl", md: "2xl" }}
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
              minW={{ base: "200px", md: "220px" }}
              minH={{ base: "60px", md: "70px" }}
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