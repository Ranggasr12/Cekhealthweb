"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from 'react';

const EmailIcon = (props) => (
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
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
  </svg>
);

const PhoneIcon = (props) => (
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
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
  </svg>
);

const LocationIcon = (props) => (
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
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path>
  </svg>
);

export default function ContactPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi pengiriman pesan
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda segera.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          
          <Box textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="purple.800">
              Hubungi Kami
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl" mx="auto">
              Kami siap membantu Anda dengan pertanyaan dan kebutuhan informasi tentang kesehatan
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 12 }}>
            {/* Contact Information */}
            <VStack spacing={6} align="start">
              <Heading size="lg" color="purple.700">
                Informasi Kontak
              </Heading>
              
              <Card w="100%" borderRadius="xl" boxShadow="lg">
                <CardBody p={6}>
                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Icon as={EmailIcon} w={6} h={6} color="purple.500" />
                      <Box>
                        <Text fontWeight="bold" color="purple.700">Email</Text>
                        <Text color="gray.600">abcd@university.ac.id</Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4}>
                      <Icon as={PhoneIcon} w={6} h={6} color="purple.500" />
                      <Box>
                        <Text fontWeight="bold" color="purple.700">Telepon</Text>
                        <Text color="gray.600">+62 21 1234 5678</Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} align="start">
                      <Icon as={LocationIcon} w={6} h={6} color="purple.500" mt={1} />
                      <Box>
                        <Text fontWeight="bold" color="purple.700">Alamat</Text>
                        <Text color="gray.600">
                          Program Studi Keperawatan<br />
                          Universitas Kesehatan <br />
                          Jl. Kesehatan No. 123, Bandar Lampung
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card w="100%" borderRadius="xl" boxShadow="lg" bg="purple.50">
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="purple.700">
                      Jam Operasional
                    </Heading>
                    <VStack spacing={2} align="start" w="100%">
                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="medium" color="purple.700">Senin - Jumat</Text>
                        <Text color="gray.600">08:00 - 16:00</Text>
                      </HStack>
                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="medium" color="purple.700">Sabtu</Text>
                        <Text color="gray.600">08:00 - 12:00</Text>
                      </HStack>
                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="medium" color="purple.700">Minggu</Text>
                        <Text color="gray.600">Tutup</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Contact Form */}
            <Card borderRadius="xl" boxShadow="lg">
              <CardBody p={{ base: 4, md: 8 }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium" color="purple.700">
                        Nama Lengkap
                      </FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap Anda"
                        size="lg"
                        borderRadius="md"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px purple.500"
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="medium" color="purple.700">
                        Email
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan alamat email Anda"
                        size="lg"
                        borderRadius="md"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px purple.500"
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="medium" color="purple.700">
                        Subjek
                      </FormLabel>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Masukkan subjek pesan"
                        size="lg"
                        borderRadius="md"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px purple.500"
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="medium" color="purple.700">
                        Pesan
                      </FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tulis pesan Anda di sini..."
                        size="lg"
                        borderRadius="md"
                        borderColor="gray.300"
                        minH="150px"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px purple.500"
                        }}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      w="100%"
                      size="lg"
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      color="white"
                      isLoading={loading}
                      loadingText="Mengirim..."
                      _hover={{
                        bgGradient: "linear(to-r, purple.600, pink.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "xl"
                      }}
                      _active={{
                        transform: "translateY(0)"
                      }}
                    >
                      Kirim Pesan
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}