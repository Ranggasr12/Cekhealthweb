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
  CardHeader,
  Badge,
  SimpleGrid,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tag,
  TagLabel,
  Skeleton
} from "@chakra-ui/react";

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

const TimeIconFallback = (props) => (
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
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
  </svg>
);

export default function NewsPage() {
  const [isClient, setIsClient] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'covid', label: 'COVID-19' },
    { value: 'heart', label: 'Jantung' },
    { value: 'cancer', label: 'Kanker' },
    { value: 'mental', label: 'Kesehatan Mental' },
    { value: 'nutrition', label: 'Nutrisi' },
    { value: 'fitness', label: 'Kebugaran' },
  ];

  const healthNews = [
    {
      id: 1,
      title: "Penemuan Terbaru dalam Pengobatan Diabetes Tipe 2",
      summary: "Penelitian terbaru menunjukkan efektivitas terapi kombinasi dalam mengontrol gula darah pasien diabetes.",
      category: "nutrition",
      image: "/images/news-diabetes.jpg",
      date: "2024-01-15",
      readTime: "3 min read",
      source: "Health Journal",
      trending: true
    },
    {
      id: 2,
      title: "Vaksin COVID-19 Generasi Baru Mulai Diuji Klinis",
      summary: "Vaksin baru yang diklaim lebih efektif terhadap varian terbaru COVID-19 memasuki fase uji klinis.",
      category: "covid",
      image: "/images/news-vaccine.jpg",
      date: "2024-01-14",
      readTime: "4 min read",
      source: "WHO Update",
      trending: true
    },
    {
      id: 3,
      title: "Teknologi AI dalam Diagnosis Dini Kanker Payudara",
      summary: "Artificial Intelligence berhasil meningkatkan akurasi diagnosis kanker payudara hingga 95%.",
      category: "cancer",
      image: "/images/news-ai-cancer.jpg",
      date: "2024-01-13",
      readTime: "5 min read",
      source: "Medical Tech",
      trending: false
    },
    {
      id: 4,
      title: "Manfaat Meditasi untuk Kesehatan Mental di Era Digital",
      summary: "Studi membuktikan meditasi rutin dapat mengurangi stres dan meningkatkan kualitas tidur.",
      category: "mental",
      image: "/images/news-meditation.jpg",
      date: "2024-01-12",
      readTime: "3 min read",
      source: "Mindfulness Today",
      trending: true
    },
    {
      id: 5,
      title: "Olahraga Ringan 15 Menit Sehari Tingkatkan Kesehatan Jantung",
      summary: "Penelitian menunjukkan olahraga singkat namun rutin lebih efektif untuk kesehatan kardiovaskular.",
      category: "heart",
      image: "/images/news-exercise.jpg",
      date: "2024-01-11",
      readTime: "2 min read",
      source: "Cardio Health",
      trending: false
    },
    {
      id: 6,
      title: "Superfood Lokal Indonesia yang Setara dengan Import",
      summary: "Temuan terbaru tentang kandungan gizi makanan lokal Indonesia yang tak kalah dengan superfood impor.",
      category: "nutrition",
      image: "/images/news-superfood.jpg",
      date: "2024-01-10",
      readTime: "4 min read",
      source: "Nutrition Indonesia",
      trending: true
    },
  ];

  useEffect(() => {
    setIsClient(true);
    const fetchNews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews(healthNews);
      setLoading(false);
    };

    fetchNews();
  }, [healthNews]); // ✅ PERBAIKAN: Tambahkan healthNews ke dependency array

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      covid: 'red',
      heart: 'pink',
      cancer: 'purple',
      mental: 'blue',
      nutrition: 'green',
      fitness: 'orange'
    };
    return colors[category] || 'gray';
  };

  if (!isClient) {
    return (
      <Box bg="white" minH="100vh">
        <Skeleton height="60px" />
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8}>
            <Skeleton height="50px" width="300px" />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton key={item} height="400px" borderRadius="xl" />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Box bgGradient="linear(to-r, purple.50, pink.50)" py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} color="purple.800">
              Berita Kesehatan Terkini
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl">
              Update terbaru seputar dunia kesehatan, penelitian medis, dan tips hidup sehat
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <HStack spacing={4} w="100%" flexWrap="wrap">
            <InputGroup maxW={{ base: "100%", sm: "400px" }}>
              <InputLeftElement>
                <SearchIconFallback color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Cari berita kesehatan..."
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

      <Container maxW="container.xl" py={8}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} borderRadius="xl" boxShadow="lg">
                <Skeleton height="200px" borderTopRadius="xl" />
                <CardBody>
                  <Skeleton height="24px" mb={2} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="16px" width="80%" />
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {currentNews.map((item) => (
                <Card 
                  key={item.id} 
                  borderRadius="xl" 
                  boxShadow="lg"
                  transition="all 0.3s"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "2xl"
                  }}
                  cursor="pointer"
                >
                  <CardHeader p={0} position="relative">
                    <Box
                      height="200px"
                      bg="gray.200"
                      backgroundImage={`url(${item.image})`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      borderTopRadius="xl"
                      position="relative"
                    >
                      {item.trending && (
                        <Badge 
                          colorScheme="red" 
                          position="absolute" 
                          top={3} 
                          left={3}
                          fontSize="sm"
                        >
                          TRENDING
                        </Badge>
                      )}
                      <Badge 
                        colorScheme={getCategoryColor(item.category)}
                        position="absolute" 
                        top={3} 
                        right={3}
                        fontSize="sm"
                      >
                        {categories.find(cat => cat.value === item.category)?.label}
                      </Badge>
                    </Box>
                  </CardHeader>
                  
                  <CardBody>
                    <VStack spacing={3} align="start">
                      <Heading size="md" color="purple.800" noOfLines={2}>
                        {item.title}
                      </Heading>
                      
                      <Text color="gray.600" noOfLines={3} fontSize="sm">
                        {item.summary}
                      </Text>

                      <HStack spacing={4} color="gray.500" fontSize="sm">
                        <HStack spacing={1}>
                          <CalendarIconFallback />
                          <Text>{formatDate(item.date)}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <TimeIconFallback />
                          <Text>{item.readTime}</Text>
                        </HStack>
                      </HStack>

                      <Text fontSize="sm" color="purple.600" fontWeight="medium">
                        Sumber: {item.source}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

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
                    colorScheme={currentPage === page ? "purple" : "gray"}
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

            {filteredNews.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text fontSize="xl" color="gray.500">
                  Tidak ada berita yang ditemukan untuk pencarian &quot;{searchTerm}&quot;
                </Text>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}