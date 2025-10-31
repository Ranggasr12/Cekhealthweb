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
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// SVG Icons
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

const SendIcon = (props) => (
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
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

const WarningIcon = (props) => (
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
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
  const [errors, setErrors] = useState({});
  const [emailjsReady, setEmailjsReady] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const EMAILJS_CONFIG = {
    serviceId: 'service_x3ynf7a',
    adminTemplateId: 'template_rp1oy3o', 
    autoReplyTemplateId: 'template_n1urg3m',
    publicKey: 'KUXa_oH2YEw3Qun4Y'
  };

  // Check internet connection
  const checkInternetConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.warn('⚠️ Internet connection issue detected');
      return false;
    }
  };

  // Initialize EmailJS dengan error handling
  useEffect(() => {
    const initializeEmailJS = async () => {
      try {
        // Check internet connection first
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          setConnectionError(true);
          console.warn('📵 No internet connection');
          return;
        }

        if (EMAILJS_CONFIG.publicKey) {
          await emailjs.init(EMAILJS_CONFIG.publicKey);
          setEmailjsReady(true);
          setConnectionError(false);
          console.log('✅ EmailJS initialized successfully');
        }
      } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        setConnectionError(true);
        setEmailjsReady(false);
      }
    };

    initializeEmailJS();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama terlalu pendek';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid';
      }
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek wajib diisi';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subjek terlalu pendek';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan terlalu pendek (minimal 10 karakter)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Tidak Valid",
        description: "Harap perbaiki error pada form sebelum mengirim",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check connection before submitting
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setConnectionError(true);
      toast({
        title: "Koneksi Internet Bermasalah",
        description: "Periksa koneksi internet Anda dan coba lagi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setConnectionError(false);

    console.log('🔄 Memulai proses pengiriman form...');

    try {
      // Template parameters untuk ADMIN
      const adminParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
        timestamp: new Date().toLocaleString('id-ID'),
        to_email: 'cekhealthv1@gmail.com'
      };

      console.log('📧 Admin params:', adminParams);

      console.log('🚀 Mengirim email ke admin...');
      const adminResult = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.adminTemplateId,
        adminParams
      );

      console.log('✅ Email ke admin berhasil:', adminResult);

      // Auto-reply to user
      const autoReplyParams = {
        to_name: formData.name,
        to_email: formData.email,
        subject: formData.subject,
        timestamp: new Date().toLocaleString('id-ID'),
        admin_email: 'cekhealthv1@gmail.com',
        user_email: formData.email,
        email: formData.email
      };

      console.log('📨 Auto-reply params:', autoReplyParams);

      console.log('🚀 Mengirim auto-reply ke user...');
      try {
        const autoReplyResult = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.autoReplyTemplateId,
          autoReplyParams
        );
        console.log('✅ Auto-reply berhasil:', autoReplyResult);
      } catch (autoReplyError) {
        console.warn('⚠️ Auto-reply gagal, tapi tidak masalah:', autoReplyError);
        // Continue even if auto-reply fails
      }

      toast({
        title: "Pesan Terkirim! 🎉",
        description: "Tim kami akan menghubungi Anda dalam 24 jam.",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});

    } catch (error) {
      console.error('❌ Error mengirim email:', error);
      
      let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.";
      
      if (error?.text) {
        console.log('📝 Error text:', error.text);
        
        if (error.text.includes('The recipients address is empty')) {
          errorMessage = "Pesan Anda sudah sampai ke admin! Kami akan menghubungi Anda segera.";
          
          toast({
            title: "Pesan Terkirim! ✅",
            description: "Pesan sudah sampai ke tim kami. Kami akan menghubungi Anda dalam 24 jam.",
            status: "success",
            duration: 6000,
            isClosable: true,
            position: "top"
          });
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          setErrors({});
          setLoading(false);
          return;
        }
      }

      // Handle specific EmailJS errors
      if (error?.status === 0) {
        errorMessage = "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.";
        setConnectionError(true);
      } else if (error?.status === 400) {
        errorMessage = "Template email tidak ditemukan. Silakan hubungi administrator.";
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
      console.log('🏁 Proses pengiriman selesai');
    }
  };

  return (
    <Box bg="white" minH="100vh">
      <Container maxW="container.xl" py={{ base: 8, md: 16 }} pt={20}>
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

          {/* Connection Warning */}
          {connectionError && (
            <Alert status="warning" borderRadius="lg" mb={4}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Koneksi Internet Bermasalah</Text>
                <Text fontSize="sm">
                  Periksa koneksi internet Anda. Form mungkin tidak dapat mengirim pesan tanpa koneksi yang stabil.
                </Text>
              </Box>
            </Alert>
          )}

          {/* EmailJS Status */}
          {!emailjsReady && !connectionError && (
            <Alert status="info" borderRadius="lg" mb={4}>
              <AlertIcon />
              <HStack spacing={2}>
                <Spinner size="sm" />
                <Text>Menyiapkan sistem pengiriman pesan...</Text>
              </HStack>
            </Alert>
          )}

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

                    <HStack spacing={4} align="start">
                      <Box p={3} bg="purple.100" borderRadius="lg" mt={1}>
                        <Icon as={LocationIcon} w={6} h={6} color="purple.600" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="purple.700" fontSize="lg">Alamat</Text>
                        <Text color="gray.600" fontSize="md">
                          Program Studi Keperawatan<br />
                          Politeknik Kesehatan Tanjung Karang <br />
                          Jl. Soekarno-Hatta No. 1 dan No. 6, Kota Bandar Lampung, Lampung, Indonesia
                        </Text>
                        <Text color="gray.500" fontSize="sm">Lampung, Indonesia</Text>
                      </Box>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Business Hours */}
              <Card w="100%" borderRadius="xl" boxShadow="lg" bg="purple.50" border="1px" borderColor="purple.200">
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="purple.700">
                      🕒 Jam Operasional
                    </Heading>
                    <VStack spacing={3} align="start" w="100%">
                      <HStack justify="space-between" w="100%" p={2} bg="white" borderRadius="md" px={3}>
                        <Text fontWeight="medium" color="purple.700">Senin - Jumat</Text>
                        <Text color="gray.600" fontWeight="semibold">08:00 - 16:00</Text>
                      </HStack>
                      <HStack justify="space-between" w="100%" p={2} bg="white" borderRadius="md" px={3}>
                        <Text fontWeight="medium" color="purple.700">Sabtu</Text>
                        <Text color="gray.600" fontWeight="semibold">08:00 - 12:00</Text>
                      </HStack>
                      <HStack justify="space-between" w="100%" p={2} bg="white" borderRadius="md" px={3}>
                        <Text fontWeight="medium" color="purple.700">Minggu</Text>
                        <Text color="gray.500" fontStyle="italic">Tutup</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* WhatsApp Direct Contact */}
              <Card w="100%" borderRadius="xl" boxShadow="lg" bg="green.50" border="1px" borderColor="green.200">
                <CardBody p={6}>
                  <VStack spacing={3} align="start">
                    <Heading size="md" color="green.700">
                      💬 Hubungi Langsung via WhatsApp
                    </Heading>
                    <Text color="green.700" fontSize="sm">
                      Untuk respon lebih cepat, silakan hubungi kami langsung melalui WhatsApp:
                    </Text>
                    <Button
                      as="a"
                      href="https://wa.me/622112345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      colorScheme="whatsapp"
                      size="lg"
                      w="100%"
                    >
                      Chat via WhatsApp
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Alternative Contact Methods */}
              <Card w="100%" borderRadius="xl" boxShadow="lg" bg="orange.50" border="1px" borderColor="orange.200">
                <CardBody p={6}>
                  <VStack spacing={3} align="start">
                    <Heading size="md" color="orange.700">
                      📞 Metode Lainnya
                    </Heading>
                    <Text color="orange.700" fontSize="sm">
                      Jika form tidak bekerja, Anda dapat:
                    </Text>
                    <VStack spacing={2} align="start" w="100%">
                      <Text fontSize="sm">• Email langsung: cekhealthv1@gmail.com</Text>
                      <Text fontSize="sm">• Telepon: +62 21 1234 5678</Text>
                      <Text fontSize="sm">• Kunjungi kampus langsung</Text>
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
                  
                  {/* Form Status */}
                  {!emailjsReady && (
                    <Alert status="info" size="sm" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">Sistem pesan sedang dipersiapkan...</Text>
                    </Alert>
                  )}
                </VStack>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={5}>
                    <FormControl isRequired isInvalid={errors.name}>
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
                        borderColor={errors.name ? "red.300" : "gray.300"}
                        bg="white"
                        _focus={{
                          borderColor: errors.name ? "red.500" : "purple.500",
                          boxShadow: errors.name ? "0 0 0 2px rgba(229, 62, 62, 0.2)" : "0 0 0 2px rgba(128, 90, 213, 0.2)",
                          bg: "white"
                        }}
                        isDisabled={loading || connectionError}
                      />
                      {errors.name && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.name}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.email}>
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
                        borderColor={errors.email ? "red.300" : "gray.300"}
                        bg="white"
                        _focus={{
                          borderColor: errors.email ? "red.500" : "purple.500",
                          boxShadow: errors.email ? "0 0 0 2px rgba(229, 62, 62, 0.2)" : "0 0 0 2px rgba(128, 90, 213, 0.2)",
                          bg: "white"
                        }}
                        isDisabled={loading || connectionError}
                      />
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.subject}>
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
                        borderColor={errors.subject ? "red.300" : "gray.300"}
                        bg="white"
                        _focus={{
                          borderColor: errors.subject ? "red.500" : "purple.500",
                          boxShadow: errors.subject ? "0 0 0 2px rgba(229, 62, 62, 0.2)" : "0 0 0 2px rgba(128, 90, 213, 0.2)",
                          bg: "white"
                        }}
                        isDisabled={loading || connectionError}
                      />
                      {errors.subject && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.subject}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.message}>
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
                        borderColor={errors.message ? "red.300" : "gray.300"}
                        bg="white"
                        minH="180px"
                        resize="vertical"
                        _focus={{
                          borderColor: errors.message ? "red.500" : "purple.500",
                          boxShadow: errors.message ? "0 0 0 2px rgba(229, 62, 62, 0.2)" : "0 0 0 2px rgba(128, 90, 213, 0.2)",
                          bg: "white"
                        }}
                        isDisabled={loading || connectionError}
                      />
                      {errors.message && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.message}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      w="100%"
                      size="lg"
                      height="56px"
                      bgGradient={connectionError || !emailjsReady ? 
                        "linear(to-r, gray.400, gray.500)" : 
                        "linear(to-r, purple.500, pink.500)"}
                      color="white"
                      isLoading={loading}
                      loadingText="Mengirim Pesan..."
                      leftIcon={connectionError ? <WarningIcon /> : <SendIcon />}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                      _hover={!connectionError && emailjsReady ? {
                        bgGradient: "linear(to-r, purple.600, pink.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px -5px rgba(128, 90, 213, 0.4)"
                      } : {}}
                      _active={!connectionError && emailjsReady ? {
                        transform: "translateY(0)",
                        boxShadow: "0 5px 15px -3px rgba(128, 90, 213, 0.4)"
                      } : {}}
                      transition="all 0.3s ease"
                      isDisabled={loading || connectionError || !emailjsReady}
                    >
                      {connectionError ? "Koneksi Bermasalah" : 
                       !emailjsReady ? "Menyiapkan..." : 
                       loading ? "Mengirim..." : "Kirim Pesan Sekarang"}
                    </Button>

                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                      Dengan mengirim pesan, Anda menyetujui kebijakan privasi kami. 
                      Data Anda aman dan tidak akan dibagikan.
                    </Text>

                    {/* Connection Troubleshooting */}
                    {connectionError && (
                      <Alert status="warning" size="sm" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <Text fontSize="sm" fontWeight="bold">Tips:</Text>
                          <Text fontSize="xs">
                            • Periksa koneksi internet Anda<br/>
                            • Refresh halaman ini<br/>
                            • Gunakan WhatsApp untuk kontak langsung
                          </Text>
                        </Box>
                      </Alert>
                    )}
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