"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tag,
  TagLabel,
  Skeleton,
  Icon,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/react";
import { supabase } from '@/lib/supabase';

// Fallback icons
const SearchIconFallback = (props) => (
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
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
  </svg>
);

const FileIconFallback = (props) => (
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
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
  </svg>
);

const DownloadIconFallback = (props) => (
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
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
  </svg>
);

const CalendarIconFallback = (props) => (
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
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path>
  </svg>
);

export default function MakalahPage() {
  const [makalah, setMakalah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'jantung', label: 'Kardiologi' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'gaya-hidup', label: 'Gaya Hidup' },
    { value: 'nutrisi', label: 'Nutrisi' },
    { value: 'mental', label: 'Kesehatan Mental' },
    { value: 'anak', label: 'Kesehatan Anak' },
    { value: 'umum', label: 'Kesehatan Umum' },
  ];

  useEffect(() => {
    fetchMakalah();
  }, []);

  const fetchMakalah = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching makalah from database...');
      
      const { data, error } = await supabase
        .from('makalah')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching makalah:', error);
        throw error;
      }

      console.log('✅ Makalah fetched:', data);
      setMakalah(data || []);
      
    } catch (error) {
      console.error('🎯 Failed to fetch makalah:', error);
      setError('Gagal memuat makalah. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect category dari judul atau deskripsi
  const detectCategory = (makalahItem) => {
    const title = makalahItem.title?.toLowerCase() || '';
    const description = makalahItem.description?.toLowerCase() || '';
    
    const text = title + ' ' + description;
    
    if (text.includes('jantung') || text.includes('kardi') || text.includes('jantung')) {
      return 'jantung';
    } else if (text.includes('diabet') || text.includes('gula darah')) {
      return 'diabetes';
    } else if (text.includes('gizi') || text.includes('nutrisi') || text.includes('makanan')) {
      return 'nutrisi';
    } else if (text.includes('mental') || text.includes('psikolog') || text.includes('stres')) {
      return 'mental';
    } else if (text.includes('anak') || text.includes('balita') || text.includes('stunting')) {
      return 'anak';
    } else if (text.includes('gaya hidup') || text.includes('olahraga') || text.includes('kebugaran')) {
      return 'gaya-hidup';
    } else {
      return 'umum';
    }
  };

  const filteredMakalah = makalah.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const itemCategory = detectCategory(item);
    const matchesCategory = category === 'all' || itemCategory === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMakalah.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMakalah = filteredMakalah.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Ukuran tidak tersedia';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'jantung': 'red',
      'diabetes': 'orange',
      'gaya-hidup': 'green',
      'nutrisi': 'blue',
      'mental': 'purple',
      'anak': 'pink',
      'umum': 'gray'
    };
    return colors[category] || 'gray';
  };

  const handleDownload = (pdfUrl, fileName) => {
    if (!pdfUrl) {
      alert('URL PDF tidak tersedia');
      return;
    }
    
    // Untuk demo, kita buka di tab baru
    window.open(pdfUrl, '_blank');
  };

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.50, teal.50)",
    "linear(to-r, blue.900, teal.900)"
  );

  return (
    <Box bg="white" minH="100vh" pt={0}>
      {/* Header Section */}
      <Box bgGradient={bgGradient} py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} color="blue.800">
              Koleksi Makalah Kesehatan
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl">
              Akses makalah dan penelitian terbaru dalam bidang kesehatan dari para ahli terpercaya
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Error Alert */}
      {error && (
        <Container maxW="container.xl" mt={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <Text fontWeight="bold">Error</Text>
              <Text fontSize="sm">{error}</Text>
              <Button 
                size="sm" 
                colorScheme="red" 
                variant="outline" 
                mt={2}
                onClick={fetchMakalah}
              >
                Coba Lagi
              </Button>
            </Box>
          </Alert>
        </Container>
      )}

      {/* Search and Filter Section */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <HStack spacing={4} w="100%" flexWrap="wrap">
            <InputGroup maxW={{ base: "100%", sm: "400px" }}>
              <InputLeftElement>
                <SearchIconFallback color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Cari makalah, penulis, atau topik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="lg"
                borderRadius="md"
              />
            </InputGroup>

            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxW={{ base: "100%", sm: "200px" }}
              size="lg"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </HStack>

          <HStack spacing={2} flexWrap="wrap" justify="center">
            {categories.slice(1).map((cat) => (
              <Tag
                key={cat.value}
                size="lg"
                colorScheme={getCategoryColor(cat.value)}
                variant={category === cat.value ? "solid" : "outline"}
                cursor="pointer"
                onClick={() => setCategory(cat.value)}
                _hover={{ transform: "scale(1.05)" }}
                transition="all 0.2s"
              >
                <TagLabel>{cat.label}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </VStack>
      </Container>

      {/* Makalah Grid */}
      <Container maxW="container.xl" py={8}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} borderRadius="xl" boxShadow="lg">
                <CardBody>
                  <Skeleton height="24px" mb={4} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="16px" width="80%" mb={4} />
                  <Skeleton height="40px" borderRadius="md" />
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {currentMakalah.map((item) => {
                const itemCategory = detectCategory(item);
                return (
                  <Card 
                    key={item.id} 
                    borderRadius="xl" 
                    boxShadow="lg"
                    transition="all 0.3s"
                    _hover={{ 
                      transform: "translateY(-4px)",
                      boxShadow: "2xl"
                    }}
                  >
                    <CardBody>
                      <VStack spacing={4} align="start" h="100%">
                        {/* Header dengan icon dan badge */}
                        <HStack justify="space-between" w="100%">
                          <HStack>
                            <Icon as={FileIconFallback} boxSize={6} color="blue.500" />
                            <Badge 
                              colorScheme={getCategoryColor(itemCategory)}
                              fontSize="sm"
                            >
                              {categories.find(cat => cat.value === itemCategory)?.label}
                            </Badge>
                          </HStack>
                        </HStack>

                        {/* Judul dan Deskripsi */}
                        <Box flex={1}>
                          <Heading size="md" color="blue.800" noOfLines={2} mb={2}>
                            {item.title || 'Judul Tidak Tersedia'}
                          </Heading>
                          
                          <Text color="gray.600" noOfLines={3} fontSize="sm" mb={3}>
                            {item.description || 'Deskripsi tidak tersedia'}
                          </Text>
                        </Box>

                        {/* Metadata */}
                        <HStack justify="space-between" w="100%" color="gray.500" fontSize="sm">
                          <HStack spacing={1}>
                            <CalendarIconFallback />
                            <Text>{formatDate(item.created_at)}</Text>
                          </HStack>
                        </HStack>

                        {/* Download Button */}
                        <Button
                          colorScheme="blue"
                          size="sm"
                          w="100%"
                          leftIcon={<DownloadIconFallback />}
                          onClick={() => handleDownload(item.pdf_url, item.title + '.pdf')}
                          isDisabled={!item.pdf_url}
                        >
                          {item.pdf_url ? 'Download PDF' : 'PDF Tidak Tersedia'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>

            {/* Pagination */}
            {totalPages > 1 && (
              <HStack spacing={2} justify="center" mt={8}>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    size="sm"
                    colorScheme={currentPage === page ? "blue" : "gray"}
                    variant={currentPage === page ? "solid" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </HStack>
            )}

            {/* Empty State */}
            {filteredMakalah.length === 0 && !loading && (
              <Box textAlign="center" py={10}>
                <VStack spacing={4}>
                  <Icon as={FileIconFallback} boxSize={16} color="gray.400" />
                  <Text fontSize="xl" color="gray.500">
                    {makalah.length === 0 ? 'Belum ada makalah tersedia' : 'Tidak ada makalah yang ditemukan'}
                  </Text>
                  <Text color="gray.400">
                    {makalah.length === 0 
                      ? 'Admin akan segera menambahkan makalah kesehatan' 
                      : 'Coba ubah kata kunci pencarian atau filter kategori'
                    }
                  </Text>
                </VStack>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}