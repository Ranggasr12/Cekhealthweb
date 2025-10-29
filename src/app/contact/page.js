"use client";

import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Card, CardBody,
  FormControl, FormLabel, Input, Textarea, Button, useToast,
  Icon, SimpleGrid
} from "@chakra-ui/react";
import emailjs from '@emailjs/browser';

// Icons
const EmailIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
  </svg>
);

const PhoneIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
  </svg>
);

const SendIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  // 🔑 GANTI DENGAN DATA ANDA DARI EMAILJS
  const EMAILJS_CONFIG = {
    serviceId: 'service_xxxxxxxxx',        // Ganti dengan Service ID Anda
    adminTemplateId: 'template_xxxxxxxxx', // Ganti dengan Admin Template ID
    autoReplyTemplateId: 'template_yyyyyyy', // Ganti dengan Auto-Reply Template ID  
    publicKey: 'your_public_key_here'      // Ganti dengan Public Key Anda
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Harap isi semua field yang wajib diisi.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Harap masukkan alamat email yang valid.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Mengirim email via EmailJS...');

      // 1. Send email to admin
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.adminTemplateId,
        {
          to_name: 'Admin CekHealth',
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
          timestamp: new Date().toLocaleString('id-ID')
        },
        EMAILJS_CONFIG.publicKey
      );

      // 2. Send auto-reply to user
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.autoReplyTemplateId,
        {
          to_name: formData.name,
          to_email: formData.email,
          subject: formData.subject,
          timestamp: new Date().toLocaleString('id-ID')
        },
        EMAILJS_CONFIG.publicKey
      );

      toast({
        title: "Pesan Terkirim! 🎉",
        description: "Tim kami akan menghubungi Anda dalam 24 jam. Email konfirmasi telah dikirim.",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top"
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (error) {
      console.error('❌ Error mengirim email:', error);
      
      let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      
      if (error.text && error.text.includes('Quota exceeded')) {
        errorMessage = "Quota email harian telah habis. Silakan hubungi kami langsung via email.";
      }

      toast({
        title: "Gagal Mengirim Pesan",
        description: errorMessage,
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          
          {/* Header Section */}
          <Box textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="purple.800">
              Hubungi Kami
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl" mx="auto">
              Kami siap membantu Anda dengan pertanyaan dan kebutuhan informasi tentang kesehatan. 
              Tim kami akan merespons dalam 24 jam.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 12 }}>
            
            {/* Contact Information */}
            <VStack spacing={6} align="start">
              <Heading size="lg" color="purple.700">
                Informasi Kontak
              </Heading>
              
              <Card w="100%" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
                <CardBody p={6}>
                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Box p={3} bg="purple.100" borderRadius="lg">
                        <Icon as={EmailIcon} w={6} h={6} color="purple.600" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="purple.700" fontSize="lg">Email</Text>
                        <Text color="gray.600" fontSize="md">cekhealthv1@gmail.com</Text>
                        <Text color="gray.500" fontSize="sm">Response dalam 24 jam</Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4}>
                      <Box p={3} bg="purple.100" borderRadius="lg">
                        <Icon as={PhoneIcon} w={6} h={6} color="purple.600" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="purple.700" fontSize="lg">Telepon/WhatsApp</Text>
                        <Text color="gray.600" fontSize="md">+62 21 1234 5678</Text>
                        <Text color="gray.500" fontSize="sm">Senin - Jumat, 08:00-16:00</Text>
                      </Box>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Process Info */}
              <Card w="100%" borderRadius="xl" boxShadow="lg" bg="green.50" border="1px" borderColor="green.200">
                <CardBody p={6}>
                  <VStack spacing={3} align="start">
                    <Heading size="md" color="green.700">
                      📋 Proses Respons
                    </Heading>
                    <VStack spacing={2} align="start">
                      <HStack spacing={3}>
                        <Box w={2} h={2} bg="green.500" borderRadius="full" mt={1} />
                        <Text color="green.700" fontSize="sm">Pesan langsung ke tim admin</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w={2} h={2} bg="green.500" borderRadius="full" mt={1} />
                        <Text color="green.700" fontSize="sm">Konfirmasi email otomatis</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w={2} h={2} bg="green.500" borderRadius="full" mt={1} />
                        <Text color="green.700" fontSize="sm">Respons personal dalam 24 jam</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Contact Form */}
            <Card borderRadius="xl" boxShadow="xl" border="1px" borderColor="gray.200">
              <CardBody p={{ base: 4, md: 8 }}>
                <VStack spacing={2} align="start" mb={6}>
                  <Heading size="lg" color="purple.700">
                    Kirim Pesan
                  </Heading>
                  <Text color="gray.600">
                    Isi form berikut dan tim kami akan segera merespons pertanyaan Anda.
                  </Text>
                </VStack>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold" color="gray.700" fontSize="md">
                        Nama Lengkap
                      </FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap Anda"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="white"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold" color="gray.700" fontSize="md">
                        Alamat Email
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="white"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold" color="gray.700" fontSize="md">
                        Subjek Pesan
                      </FormLabel>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Misal: Pertanyaan tentang fitur diagnosa"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="white"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold" color="gray.700" fontSize="md">
                        Pesan Anda
                      </FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tulis pesan detail Anda di sini..."
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="white"
                        minH="180px"
                        resize="vertical"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      w="100%"
                      size="lg"
                      height="56px"
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      color="white"
                      isLoading={loading}
                      loadingText="Mengirim Pesan..."
                      leftIcon={<SendIcon />}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                      _hover={{
                        bgGradient: "linear(to-r, purple.600, pink.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px -5px rgba(128, 90, 213, 0.4)"
                      }}
                    >
                      {loading ? "Mengirim..." : "Kirim Pesan Sekarang"}
                    </Button>

                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                      Dengan mengirim pesan, Anda menyetujui kebijakan privasi kami. 
                    </Text>
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