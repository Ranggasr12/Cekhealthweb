"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Skeleton,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  useToast,
  SimpleGrid,
  AspectRatio,
  Icon,
  Progress,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jsPDF } from 'jspdf';
import { ExternalLinkIcon } from '@chakra-ui/icons';

// SVG Icons
const ChevronLeftIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
  </svg>
);

const DownloadIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
  </svg>
);

const PdfIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"></path>
  </svg>
);

const VideoIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
  </svg>
);

const PlayIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

// Mapping penyakit untuk 8 jenis sesuai statistik
const penyakitMapping = {
  '1': 'Sistem Pernapasan',
  '2': 'Sistem Kardiovaskuler',
  '3': 'Sistem Pencernaan',
  '4': 'Istirahat & Tidur',
  '5': 'Sistem Perkemihan',
  '6': 'Gangguan Nutrisi',
  '7': 'Sistem Persyarafan',
  '8': 'Endokrin'
};

const reversePenyakitMapping = {
  'Sistem Pernapasan': 1,
  'Sistem Kardiovaskuler': 2,
  'Sistem Pencernaan': 3,
  'Istirahat & Tidur': 4,
  'Sistem Perkemihan': 5,
  'Gangguan Nutrisi': 6,
  'Sistem Persyarafan': 7,
  'Endokrin': 8
};

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
    name: 'Istirahat & Tidur',
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
    name: 'Sistem Persyarafan',
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

// Komponen untuk Rating Scale 1-10 dengan format tabel seperti borang
const RatingScaleTable = ({ value, onChange, question, questionNumber }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const getRatingLabel = (number) => {
    if (number === 1) return 'Sangat Tidak Setuju';
    if (number === 2) return 'Tidak Setuju';
    if (number === 3) return 'Kurang Setuju';
    if (number === 4) return 'Sedikit Tidak Setuju';
    if (number === 5) return 'Netral';
    if (number === 6) return 'Sedikit Setuju';
    if (number === 7) return 'Cukup Setuju';
    if (number === 8) return 'Setuju';
    if (number === 9) return 'Sangat Setuju';
    if (number === 10) return 'Sangat Sangat Setuju';
    return '';
  };

  const getColorScheme = (number) => {
    if (number <= 3) return 'red';
    if (number <= 5) return 'orange';
    if (number <= 7) return 'yellow';
    if (number <= 9) return 'blue';
    return 'green';
  };

  return (
    <Box w="100%" overflowX="auto">
      <Table variant="simple" size="sm" bg="white" borderRadius="md" overflow="hidden">
        <Thead bg="gray.50">
          <Tr>
            <Th fontSize="xs" color="gray.600" borderRight="1px" borderColor="gray.200">
              <Badge colorScheme="blue" mr={2}>{questionNumber}</Badge>
              {question}
            </Th>
            {numbers.map(number => (
              <Th key={number} fontSize="xs" color="gray.600" textAlign="center" fontWeight="normal" px={2}>
                {number}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td 
              borderRight="1px" 
              borderColor="gray.200" 
              fontSize="xs" 
              color="gray.600"
              whiteSpace="normal"
            >
              <Text fontWeight="medium">Tingkat Persetujuan</Text>
              <Text fontSize="xs">1 = Sangat Tidak Setuju, 10 = Sangat Sangat Setuju</Text>
            </Td>
            {numbers.map(number => (
              <Td key={number} textAlign="center" px={2} py={3}>
                <Button
                  size="sm"
                  colorScheme={getColorScheme(number)}
                  variant={value === number.toString() ? 'solid' : 'outline'}
                  onClick={() => onChange(number.toString())}
                  borderRadius="full"
                  height="30px"
                  width="30px"
                  minWidth="30px"
                  p={0}
                  _hover={{ transform: 'scale(1.1)' }}
                >
                  <Text fontSize="xs" fontWeight="bold">{number}</Text>
                </Button>
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
      
      {/* Legend untuk skala */}
      <Box mt={3} p={3} bg="gray.50" borderRadius="md">
        <SimpleGrid columns={5} spacing={2} fontSize="xs">
          <Text textAlign="center"><strong>1:</strong> Sangat Tidak Setuju</Text>
          <Text textAlign="center"><strong>3:</strong> Kurang Setuju</Text>
          <Text textAlign="center"><strong>5:</strong> Netral</Text>
          <Text textAlign="center"><strong>7:</strong> Cukup Setuju</Text>
          <Text textAlign="center"><strong>10:</strong> Sangat Sangat Setuju</Text>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// Komponen untuk YouTube Thumbnail Card
const YouTubeThumbnailCard = ({ video, onPlay }) => {
  const getYouTubeId = (url) => {
    const videoUrl = url || video.video_url || video.url;
    if (!videoUrl) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/#]+)/,
      /youtu\.be\/([^?/#]+)/,
    ];
    
    for (let pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const videoUrl = video.url || video.video_url;
  const videoId = getYouTubeId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <Card 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="md" 
      height="100%" 
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      onClick={() => onPlay(video)}
    >
      <Box position="relative">
        <AspectRatio ratio={16 / 9}>
          {thumbnailUrl ? (
            <Image 
              src={thumbnailUrl} 
              alt={video.judul || video.title}
              objectFit="cover"
            />
          ) : (
            <Box bg="gray.200" display="flex" alignItems="center" justifyContent="center">
              <VideoIcon fontSize="24px" color="gray.500" />
            </Box>
          )}
        </AspectRatio>
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="blackAlpha.400"
          transition="all 0.3s"
          _hover={{ bg: 'blackAlpha.200' }}
        >
          <Box bg="red.600" borderRadius="full" p={3} boxShadow="lg">
            <Icon as={PlayIcon} color="white" boxSize={6} />
          </Box>
        </Box>
      </Box>
      <CardBody>
        <Text fontWeight="bold" fontSize="lg" mb={2} noOfLines={2}>
          {video.judul || video.title || "Video Edukasi"}
        </Text>
        <Text color="gray.600" fontSize="sm" mb={3} noOfLines={3}>
          {video.deskripsi || video.description || "Video edukasi tentang kesehatan"}
        </Text>
        {videoUrl && (
          <Button 
            as="a"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="red" 
            size="sm" 
            rightIcon={<ExternalLinkIcon />}
            w="full"
            onClick={(e) => e.stopPropagation()}
          >
            Tonton di YouTube
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

// Komponen untuk Video Player Modal (POPUP)
const VideoPlayerModal = ({ isOpen, onClose, video }) => {
  const getYouTubeEmbedUrl = (url) => {
    const videoUrl = url || video?.video_url || video?.url;
    if (!videoUrl) return '';
    
    const videoId = getYouTubeId(videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/#]+)/,
      /youtu\.be\/([^?/#]+)/,
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  if (!video || !isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(video.url || video.video_url);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{video.judul || video.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {embedUrl ? (
            <AspectRatio ratio={16 / 9}>
              <Box 
                as="iframe" 
                src={embedUrl}
                title={video.judul || video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </AspectRatio>
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="red.500" mb={4}>Tidak dapat memuat video.</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPenyakitId = searchParams.get('penyakit');
  const toast = useToast();
  const [isClient, setIsClient] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pertanyaan, setPertanyaan] = useState([]);
  const [loadingPertanyaan, setLoadingPertanyaan] = useState(true);
  const [materiPenyakit, setMateriPenyakit] = useState({});
  const [loadingMateri, setLoadingMateri] = useState(false);
  const [materiCache, setMateriCache] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isOpen: isVideoModalOpen, onOpen: onVideoModalOpen, onClose: onVideoModalClose } = useDisclosure();
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
  });
  const [jawaban, setJawaban] = useState({});
  
  // State untuk multi-step: 0 = Pilih Penyakit, 1 = Data Diri, 2+ = Pertanyaan
  const [currentStep, setCurrentStep] = useState(0);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [diseaseSteps, setDiseaseSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);

  // State untuk navigasi hasil
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    // Jika ada penyakit yang dipilih dari URL, langsung set ke step data diri
    if (selectedPenyakitId) {
      const penyakit = penyakitList.find(p => p.id.toString() === selectedPenyakitId);
      if (penyakit) {
        setSelectedPenyakit(penyakit);
        setCurrentStep(1); // Langsung ke data diri
      }
    }
  }, [selectedPenyakitId]);

  // Fetch pertanyaan dari Firestore dan group by penyakit
  const fetchPertanyaan = async () => {
    try {
      setLoadingPertanyaan(true);
      const q = query(
        collection(db, 'pertanyaan'), 
        orderBy('jenis_penyakit', 'asc'),
        orderBy('urutan', 'asc')
      );
      const querySnapshot = await getDocs(q);
      let pertanyaanData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('📋 SEMUA PERTANYAAN:', pertanyaanData);

      // FILTER BERDASARKAN PENYAKIT YANG DIPILIH
      if (selectedPenyakit) {
        const selectedPenyakitName = selectedPenyakit.name;
        if (selectedPenyakitName) {
          pertanyaanData = pertanyaanData.filter(q => 
            q.jenis_penyakit?.includes(selectedPenyakitName)
          );
          console.log(`🔍 Filter pertanyaan untuk: ${selectedPenyakitName}`, pertanyaanData);
        }
      }

      // Group pertanyaan berdasarkan penyakit
      const grouped = {};
      pertanyaanData.forEach((q) => {
        const penyakit = q.jenis_penyakit?.trim();
        if (!penyakit) return;
        
        if (!grouped[penyakit]) {
          grouped[penyakit] = [];
        }
        grouped[penyakit].push(q);
      });

      console.log('📊 HASIL GROUPING:', grouped);
      setGroupedQuestions(grouped);
      
      // BUAT ARRAY PENYAKIT YANG SUDAH DIURUTKAN BERDASARKAN URUTAN
      const penyakitList = Object.keys(grouped);
      
      // Urutkan penyakit berdasarkan field urutan dari pertanyaan pertama di setiap kelompok
      const sortedPenyakitList = penyakitList.sort((a, b) => {
        const urutanA = grouped[a][0]?.urutan || 999;
        const urutanB = grouped[b][0]?.urutan || 999;
        return urutanA - urutanB;
      });

      console.log('🎯 URUTAN PENYAKIT SETELAH DIURUTKAN:', sortedPenyakitList);
      setDiseaseSteps(sortedPenyakitList);

      console.log('📈 JUMLAH PERTANYAAN PER PENYAKIT:');
      sortedPenyakitList.forEach((disease, index) => {
        console.log(`   ${index + 1}. ${disease}: ${grouped[disease].length} pertanyaan (Urutan: ${grouped[disease][0]?.urutan || 'tidak ada'})`);
      });

      setPertanyaan(pertanyaanData);
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoadingPertanyaan(false);
    }
  };

  // Fetch materi penyakit
  const fetchMateriPenyakit = async (penyakitNames) => {
    if (penyakitNames.length === 0) return;
    
    const cacheKey = penyakitNames.sort().join(',');
    if (materiCache[cacheKey]) {
      setMateriPenyakit(materiCache[cacheKey]);
      return;
    }
    
    setLoadingMateri(true);
    try {
      console.log('🔍 Mencari materi untuk penyakit:', penyakitNames);
      
      const q = query(collection(db, 'materi_penyakit'));
      const querySnapshot = await getDocs(q);
      const materiData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('📦 SEMUA MATERI DARI FIRESTORE:', materiData);

      const groupedMateri = {};
      
      penyakitNames.forEach(penyakit => {
        console.log(`🔎 Mencari materi untuk: "${penyakit}"`);
        
        // Cari semua materi yang terkait dengan penyakit ini
        const semuaMateri = materiData.filter(m => {
          if (!m.nama_penyakit) return false;
          
          // Normalisasi nama penyakit untuk matching yang lebih baik
          const materiPenyakitNormalized = m.nama_penyakit.toLowerCase().trim();
          const targetPenyakitNormalized = penyakit.toLowerCase().trim();
          
          // Matching yang lebih fleksibel
          const isMatch = materiPenyakitNormalized === targetPenyakitNormalized ||
                         materiPenyakitNormalized.includes(targetPenyakitNormalized) ||
                         targetPenyakitNormalized.includes(materiPenyakitNormalized);
          
          if (isMatch) {
            console.log(`✅ Ditemukan materi:`, m);
          }
          
          return isMatch;
        });
        
        // Pisahkan video dan artikel
        const videos = semuaMateri.filter(m => 
          m.jenis_materi === 'video' || 
          m.type === 'video' ||
          (m.url && (m.url.includes('youtube') || m.url.includes('youtu.be')))
        );
        
        const articles = semuaMateri.filter(m => 
          m.jenis_materi === 'artikel' || 
          m.type === 'article' ||
          (!m.url || (!m.url.includes('youtube') && !m.url.includes('youtu.be')))
        );

        console.log(`🎬 Video untuk ${penyakit}:`, videos);
        console.log(`📝 Artikel untuk ${penyakit}:`, articles);
        
        groupedMateri[penyakit] = { 
          videos: videos, 
          articles: articles,
          semuaMateri: semuaMateri 
        };
      });

      console.log('📚 HASIL GROUPING MATERI:', groupedMateri);
      setMateriCache(prev => ({ ...prev, [cacheKey]: groupedMateri }));
      setMateriPenyakit(groupedMateri);
      
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat materi edukasi: ' + error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoadingMateri(false);
    }
  };

  // Handler untuk memutar video
  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    onVideoModalOpen();
  };

  // Komponen Video Gallery
  const VideoGallerySection = ({ penyakit }) => {
    if (!penyakit || !penyakit.name) {
      console.log('❌ Penyakit tidak valid:', penyakit);
      return null;
    }

    const materi = materiPenyakit[penyakit.name] || { videos: [], articles: [], semuaMateri: [] };
    const videos = materi.videos || [];

    console.log(`🎬 Rendering VideoGallery untuk: ${penyakit.name}`, {
      semuaMateri: materi.semuaMateri,
      videos: videos
    });

    if (loadingMateri) {
      return (
        <Box mt={6} p={6} bg="gray.50" borderRadius="lg">
          <VStack spacing={3} align="center">
            <Skeleton height="20px" width="200px" />
            <Skeleton height="100px" width="100%" />
          </VStack>
        </Box>
      );
    }

    if (videos.length === 0) {
      return (
        <Box mt={6} p={6} bg="gray.50" borderRadius="lg">
          <VStack spacing={3} align="center">
            <VideoIcon fontSize="32px" color="gray.400" />
            <Heading size="md" color="gray.600">Video Edukasi {penyakit.name}</Heading>
            <Text color="gray.500" textAlign="center">
              Video edukasi untuk {penyakit.name} sedang dalam pengembangan.
            </Text>
            <Text fontSize="sm" color="gray.400">
              Total materi ditemukan: {materi.semuaMateri.length}
            </Text>
          </VStack>
        </Box>
      );
    }

    return (
      <Box mt={6} p={6} bg="blue.50" borderRadius="lg">
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="blue.700">
            <Icon as={VideoIcon} mr={2} />
            Video Edukasi Tentang {penyakit.name}
          </Heading>
          
          <Text color="gray.600">Untuk informasi lebih lanjut, Anda dapat menonton video edukasi berikut:</Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {videos.map((video) => (
              <YouTubeThumbnailCard 
                key={video.id} 
                video={video}
                onPlay={handlePlayVideo}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  };

  // Komponen untuk menampilkan SEMUA pertanyaan dalam satu penyakit dengan format tabel
  const DiseaseQuestionsPage = ({ diseaseName, questions }) => {
    // Urutkan pertanyaan berdasarkan urutan jika ada
    const sortedQuestions = [...questions].sort((a, b) => {
      const urutanA = a.urutan || 999;
      const urutanB = b.urutan || 999;
      return urutanA - urutanB;
    });

    return (
      <Box w="100%">
        <Box mb={6} p={4} bg="blue.50" borderRadius="lg">
          <HStack justify="space-between" align="center">
            <Box>
              <Badge colorScheme="blue" fontSize="md" mb={2}>
                Borang Kaji Selidik: {diseaseName}
              </Badge>
              <Text fontSize="sm" color="gray.600">
                {sortedQuestions.length} pernyataan untuk dinilai (Skala 1-10)
              </Text>
            </Box>
            <Badge colorScheme="purple" fontSize="md">
              Step {currentStep} dari {diseaseSteps.length + 1}
            </Badge>
          </HStack>
        </Box>

        <VStack spacing={8} align="stretch">
          {sortedQuestions.map((question, index) => (
            <FormControl key={question.id} mb={8} isRequired>
              <RatingScaleTable
                value={jawaban[question.id] || ''}
                onChange={(value) => handleRatingChange(question.id, value)}
                question={question.pertanyaan_text}
                questionNumber={index + 1}
              />
            </FormControl>
          ))}
        </VStack>
      </Box>
    );
  };

  // Komponen untuk memilih penyakit
  const DiseaseSelectionPage = () => {
    return (
      <Box w="100%">
        {/* JUDUL TUNGGAL - TIDAK ADA DUPLIKASI */}
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" mb={3} color="purple.800">
          </Heading>
          <Text color="gray.600" fontSize="lg">
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
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
              onClick={() => {
                setSelectedPenyakit(penyakit);
                setCurrentStep(1); // Pindah ke data diri
              }}
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
                      colorScheme={penyakit.color}
                      variant="outline"
                      size="sm"
                    >
                      Pilih
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
      </Box>
    );
  };

  // FUNGSI DOWNLOAD HASIL SKRINING
  const downloadTxtResults = () => {
    const results = calculateResults();
    const timestamp = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let content = `HASIL KUESIONER KESEHATAN - CEKHEALTH\n`;
    content += `========================================\n\n`;
    
    content += `INFORMASI RESPONDEN:\n`;
    content += `- Nama: ${formData.nama}\n`;
    content += `- Usia: ${formData.usia} tahun\n`;
    content += `- Jenis Kelamin: ${formData.jenisKelamin}\n`;
    content += `- Tanggal Pengisian: ${timestamp}\n\n`;
    
    content += `STATISTIK KUESIONER:\n`;
    content += `- Total Pernyataan: ${results.totalPertanyaan}\n`;
    content += `- Pernyataan Terjawab: ${results.pertanyaanTerjawab}\n`;
    content += `- Total Skor: ${results.totalSkor}/${results.maxSkor}\n`;
    content += `- Persentase: ${results.persentase}%\n`;
    content += `- Kategori Dinilai: ${results.detectedDiseases.length}\n\n`;
    
    content += `HASIL ANALISIS:\n`;
    content += `=======================\n\n`;
    
    results.detectedDiseases.forEach((disease, index) => {
      content += `${index + 1}. ${disease.name.toUpperCase()}\n`;
      content += `   - Skor Rata-rata: ${disease.totalScore}/${disease.maxScore}\n`;
      content += `   - Persentase: ${disease.persentase}%\n`;
      content += `   - Tingkat Persetujuan: ${disease.riskCategory}\n\n`;
      
      if (disease.rekomendasi && disease.rekomendasi.length > 0) {
        content += `   REKOMENDASI:\n`;
        disease.rekomendasi.forEach(rekomendasi => {
          content += `   • ${rekomendasi}\n`;
        });
        content += `\n`;
      }
    });
    
    content += `SKALA PENILAIAN:\n`;
    content += `1 = Sangat Tidak Setuju, 3 = Kurang Setuju, 5 = Netral, 7 = Cukup Setuju, 10 = Sangat Sangat Setuju\n\n`;
    
    content += `DISCLAIMER:\n`;
    content += `=================\n`;
    content += `Hasil kuesioner ini merupakan alat bantu assessment dan tidak menggantikan konsultasi dengan tenaga medis profesional.\n\n`;
    
    content += `www.cekhealth.com\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hasil-kuesioner-${formData.nama.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil kuesioner telah diunduh dalam format TXT',
      status: 'success',
      duration: 3000,
    });
  };

  // FUNGSI DOWNLOAD PDF
  const downloadPdfResults = () => {
    const results = calculateResults();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    const colors = {
      primary: [41, 128, 185],
      secondary: [52, 152, 219],
      accent: [231, 76, 60],
      darkText: [44, 62, 80],
      lightText: [108, 117, 125]
    };

    const checkPageBreak = (requiredSpace = 30) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('HASIL KUESIONER KESEHATAN', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistem Assessment Kesehatan Digital - CEKHEALTH', pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 45, { align: 'center' });

    yPosition = 70;

    // Informasi Responden
    checkPageBreak(40);
    doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI RESPONDEN', margin + 5, yPosition + 5.5);

    yPosition += 15;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Nama Lengkap:', margin + 8, yPosition + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.nama, margin + 35, yPosition + 10);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Usia:', margin + 8, yPosition + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.usia} tahun`, margin + 35, yPosition + 16);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Jenis Kelamin:', margin + 8, yPosition + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.jenisKelamin, margin + 35, yPosition + 22);

    yPosition += 40;

    // Hasil Analisis
    checkPageBreak(30);
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('HASIL ANALISIS PER KATEGORI', margin + 5, yPosition + 5.5);

    yPosition += 15;

    // Hasil untuk setiap kategori
    results.detectedDiseases.forEach((disease, index) => {
      checkPageBreak(60);

      let diseaseColor;
      if (disease.name === "Tidak Terdeteksi Masalah Serius") {
        diseaseColor = [46, 204, 113];
      } else if (disease.riskCategory === "Tinggi") {
        diseaseColor = colors.accent;
      } else if (disease.riskCategory === "Sedang") {
        diseaseColor = [243, 156, 18];
      } else {
        diseaseColor = colors.secondary;
      }

      doc.setFillColor(diseaseColor[0], diseaseColor[1], diseaseColor[2]);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(disease.name.toUpperCase(), margin + 5, yPosition + 6.5);

      yPosition += 16;

      doc.setFontSize(9);
      doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
      doc.setFont('helvetica', 'normal');
      
      const confidenceText = `Skor Rata-rata: ${disease.totalScore}/${disease.maxScore} | Persentase: ${disease.persentase}% | Tingkat: ${disease.riskCategory}`;
      doc.text(confidenceText, margin + 5, yPosition);
      yPosition += 8;

      const description = disease.name === "Tidak Terdeteksi Masalah Serius" 
        ? "Berdasarkan hasil kuesioner, tidak terdeteksi indikasi masalah kesehatan serius."
        : `Terdeteksi indikasi ${disease.name.toLowerCase()} dengan tingkat persetujuan ${disease.riskCategory.toLowerCase()}.`;
      
      const splitDesc = doc.splitTextToSize(description, pageWidth - 2 * margin - 10);
      doc.text(splitDesc, margin + 5, yPosition);
      yPosition += splitDesc.length * 4 + 8;

      if (disease.rekomendasi && disease.rekomendasi.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.text('Rekomendasi:', margin + 5, yPosition);
        yPosition += 6;

        doc.setFontSize(8);
        doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
        doc.setFont('helvetica', 'normal');

        disease.rekomendasi.forEach((rekomendasi, idx) => {
          checkPageBreak(12);
          const bulletText = `• ${rekomendasi}`;
          const splitText = doc.splitTextToSize(bulletText, pageWidth - 2 * margin - 12);
          doc.text(splitText, margin + 8, yPosition);
          yPosition += splitText.length * 3.5 + 2;
        });
      }

      yPosition += 10;
    });

    // Skala Penilaian
    checkPageBreak(25);
    doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SKALA PENILAIAN', margin + 5, yPosition + 5.5);

    yPosition += 15;

    const scaleText = [
      "1 = Sangat Tidak Setuju | 2 = Tidak Setuju | 3 = Kurang Setuju | 4 = Sedikit Tidak Setuju",
      "5 = Netral | 6 = Sedikit Setuju | 7 = Cukup Setuju | 8 = Setuju | 9 = Sangat Setuju | 10 = Sangat Sangat Setuju"
    ];

    scaleText.forEach(text => {
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin - 10);
      doc.setFontSize(8);
      doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
      doc.text(splitText, margin + 5, yPosition);
      yPosition += splitText.length * 3 + 4;
    });

    // Footer & Disclaimer
    checkPageBreak(35);
    const footerY = doc.internal.pageSize.getHeight() - 35;
    
    doc.setDrawColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(7);
    doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
    doc.setFont('helvetica', 'italic');
    
    const disclaimerLines = [
      "Hasil kuesioner ini merupakan alat bantu assessment dan tidak menggantikan konsultasi dengan tenaga medis profesional.",
      "Selalu konsultasikan kondisi kesehatan Anda dengan dokter untuk diagnosis dan penanganan yang tepat.",
      `Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleDateString('id-ID')} - www.cekhealth.com`
    ];
    
    disclaimerLines.forEach((text, index) => {
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(splitText, pageWidth / 2, footerY + 6 + (index * 10), { align: 'center' });
    });

    const fileName = `hasil-kuesioner-${formData.nama.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
    doc.save(fileName);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil kuesioner telah diunduh dalam format PDF',
      status: 'success',
      duration: 3000,
    });
  };

  // Handler untuk input data diri
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler untuk jawaban rating 1-10
  const handleRatingChange = (pertanyaanId, value) => {
    setJawaban(prev => ({ ...prev, [pertanyaanId]: value }));
  };

  // Validasi form
  const validateForm = () => {
    if (currentStep === 1) { // Validasi data diri
      if (!formData.nama.trim()) {
        toast({ title: 'Data tidak lengkap', description: 'Nama lengkap harus diisi', status: 'warning', duration: 3000 });
        return false;
      }
      if (!formData.usia || formData.usia < 1 || formData.usia > 120) {
        toast({ title: 'Data tidak lengkap', description: 'Usia harus antara 1-120 tahun', status: 'warning', duration: 3000 });
        return false;
      }
      if (!formData.jenisKelamin) {
        toast({ title: 'Data tidak lengkap', description: 'Jenis kelamin harus dipilih', status: 'warning', duration: 3000 });
        return false;
      }
      return true;
    } else if (currentStep >= 2) { // Validasi pertanyaan
      const currentDisease = diseaseSteps[currentStep - 2];
      const questionsForDisease = groupedQuestions[currentDisease] || [];
      const unansweredQuestions = questionsForDisease.filter(q => !jawaban[q.id]);
      
      if (unansweredQuestions.length > 0) {
        toast({
          title: 'Pertanyaan Belum Lengkap',
          description: `Masih ada ${unansweredQuestions.length} pernyataan yang belum dinilai`,
          status: 'warning',
          duration: 5000,
        });
        return false;
      }
    }
    return true;
  };

  // Kalkulasi hasil berdasarkan jawaban rating 1-10
  const calculateResults = () => {
    const diseaseScores = {};
    const semuaRekomendasi = [];
    
    pertanyaan.forEach(question => {
      if (!question || !question.jenis_penyakit) return;
      
      const penyakit = question.jenis_penyakit;
      if (!diseaseScores[penyakit]) {
        diseaseScores[penyakit] = { 
          totalScore: 0, 
          questionCount: 0,
          maxPossibleScore: 0
        };
      }
      
      const jawabanValue = jawaban[question.id];
      if (jawabanValue) {
        const score = parseInt(jawabanValue);
        diseaseScores[penyakit].totalScore += score;
        diseaseScores[penyakit].questionCount += 1;
        diseaseScores[penyakit].maxPossibleScore += 10;
        
        if (score >= 7) {
          if (question.rekomendasi) semuaRekomendasi.push({ rekomendasi: question.rekomendasi, penyakit: penyakit });
        }
      }
    });

    const detectedDiseases = [];
    Object.keys(diseaseScores).forEach(penyakit => {
      const data = diseaseScores[penyakit];
      if (data.questionCount === 0) return;
      
      const averageScore = data.totalScore / data.questionCount;
      const persentase = (data.totalScore / data.maxPossibleScore) * 100;
      
      let riskCategory = "Rendah";
      
      if (persentase >= 70) {
        riskCategory = "Tinggi";
      } else if (persentase >= 40) {
        riskCategory = "Sedang";
      }
      
      if (persentase >= 40) {
        const rekomendasiPenyakit = semuaRekomendasi.filter(r => r.penyakit === penyakit).map(r => r.rekomendasi);

        detectedDiseases.push({
          name: penyakit,
          totalScore: data.totalScore,
          maxScore: data.maxPossibleScore,
          persentase: Math.round(persentase),
          averageScore: averageScore,
          totalQuestions: data.questionCount,
          riskCategory: riskCategory,
          rekomendasi: rekomendasiPenyakit,
        });
      }
    });

    if (detectedDiseases.length === 0) {
      detectedDiseases.push({
        name: "Tidak Terdeteksi Masalah Serius",
        totalScore: 0,
        maxScore: 0,
        persentase: 0,
        averageScore: 0,
        totalQuestions: 0,
        riskCategory: "Rendah",
        rekomendasi: [
          "Tetap jaga pola hidup sehat dengan makan makanan bergizi",
          "Lakukan olahraga rutin minimal 30 menit per hari",
          "Lakukan pemeriksaan kesehatan rutin setahun sekali"
        ],
      });
    }

    // Urutkan berdasarkan persentase tertinggi
    detectedDiseases.sort((a, b) => b.persentase - a.persentase);

    const totalSkor = pertanyaan.reduce((total, q) => {
      const jawabanValue = jawaban[q.id];
      return total + (jawabanValue ? parseInt(jawabanValue) : 0);
    }, 0);

    const maxSkor = pertanyaan.length * 10;
    const persentaseTotal = Math.round((totalSkor / maxSkor) * 100);

    return {
      detectedDiseases: detectedDiseases,
      totalPertanyaan: pertanyaan.length,
      pertanyaanTerjawab: Object.keys(jawaban).length,
      totalSkor: totalSkor,
      maxSkor: maxSkor,
      persentase: persentaseTotal
    };
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setShowResults(true);
    const results = calculateResults();
    
    const detectedDiseaseNames = results.detectedDiseases
      .filter(disease => disease.name !== "Tidak Terdeteksi Masalah Serius")
      .map(disease => disease.name);
    
    console.log('🦠 Penyakit terdeteksi untuk dicari materinya:', detectedDiseaseNames);
    
    if (detectedDiseaseNames.length > 0) {
      await fetchMateriPenyakit(detectedDiseaseNames);
    } else {
      console.log('ℹ️ Tidak ada penyakit terdeteksi, tidak perlu fetch materi');
    }

    // Simpan hasil ke Firestore
    try {
      const dataToSave = {
        nama: formData.nama.trim(),
        usia: parseInt(formData.usia),
        jenis_kelamin: formData.jenisKelamin,
        jawaban: jawaban,
        hasil: results,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'hasil_diagnosa'), dataToSave);
      toast({ title: 'Berhasil', description: 'Hasil kuesioner telah disimpan', status: 'success', duration: 3000 });
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  // Navigasi multi-step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validasi pilih penyakit
      if (!selectedPenyakit) {
        toast({ title: 'Pilih jenis pemeriksaan', description: 'Harap pilih jenis pemeriksaan terlebih dahulu', status: 'warning', duration: 3000 });
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validasi data diri
      if (!validateForm()) {
        return;
      }
      // Fetch pertanyaan setelah data diri selesai
      fetchPertanyaan();
      setCurrentStep(2);
    } else {
      // Validasi pertanyaan untuk penyakit saat ini
      if (!validateForm()) {
        return;
      }
      
      // Pindah ke pertanyaan berikutnya
      if (currentStep < diseaseSteps.length + 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Semua pertanyaan selesai, submit form
        handleSubmit(new Event('submit'));
      }
    }
  };

  // Navigasi hasil
  const handleNextResult = () => {
    const results = calculateResults();
    if (currentResultIndex < results.detectedDiseases.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1);
    }
  };

  const handlePrevResult = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(currentResultIndex - 1);
    }
  };

  // Progress calculation
  useEffect(() => {
    if (currentStep === 0) {
      setProgress(0);
    } else if (currentStep === 1) {
      setProgress(33);
    } else {
      const totalQuestions = pertanyaan.length;
      const answeredQuestions = Object.keys(jawaban).length;
      const baseProgress = 33;
      const questionProgress = (answeredQuestions / totalQuestions) * 67;
      setProgress(baseProgress + questionProgress);
    }
  }, [currentStep, jawaban, pertanyaan.length]);

  // Komponen untuk menampilkan hasil per halaman
  const DiseaseResultPage = ({ disease, currentPage, totalPages, onNext, onPrev }) => {
    const hasRekomendasi = disease.rekomendasi && disease.rekomendasi.length > 0;

    return (
      <Box>
        {/* Navigation Header */}
        <Box mb={6} p={4} bg="purple.50" borderRadius="lg">
          <HStack justify="space-between" align="center">
            <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
              Hasil {currentPage} dari {totalPages}
            </Badge>
            <HStack spacing={3}>
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={onPrev}
                isDisabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Sebelumnya
              </Button>
              <Button
                rightIcon={<ChevronRightIcon />}
                onClick={onNext}
                isDisabled={currentPage === totalPages}
                colorScheme="purple"
                size="sm"
              >
                Selanjutnya
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Disease Result Card */}
        <Box 
          p={6} 
          bg={
            disease.name === "Tidak Terdeteksi Masalah Serius" ? "green.50" :
            disease.riskCategory === "Tinggi" ? "red.50" : 
            disease.riskCategory === "Sedang" ? "orange.50" : "yellow.50"
          } 
          borderRadius="lg"
          borderLeft="4px"
          borderColor={
            disease.name === "Tidak Terdeteksi Masalah Serius" ? "green.400" :
            disease.riskCategory === "Tinggi" ? "red.400" : 
            disease.riskCategory === "Sedang" ? "orange.400" : "yellow.400"
          }
        >
          <VStack align="start" spacing={4}>
            <Heading size="xl" color={
              disease.name === "Tidak Terdeteksi Masalah Serius" ? "green.600" :
              disease.riskCategory === "Tinggi" ? "red.600" : 
              disease.riskCategory === "Sedang" ? "orange.600" : "yellow.600"
            }>
              {disease.name}
            </Heading>

            {/* Skor dan Persentase */}
            <Box w="full" p={4} bg="white" borderRadius="md" boxShadow="sm">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <VStack>
                  <Text fontSize="sm" color="gray.600">Skor Rata-rata</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {disease.totalScore}/{disease.maxScore}
                  </Text>
                </VStack>
                <VStack>
                  <Text fontSize="sm" color="gray.600">Persentase</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {disease.persentase}%
                  </Text>
                </VStack>
                <VStack>
                  <Text fontSize="sm" color="gray.600">Tingkat Persetujuan</Text>
                  <Badge 
                    fontSize="md" 
                    px={3} 
                    py={1}
                    colorScheme={
                      disease.riskCategory === "Tinggi" ? "red" :
                      disease.riskCategory === "Sedang" ? "orange" : "green"
                    }
                  >
                    {disease.riskCategory}
                  </Badge>
                </VStack>
              </SimpleGrid>
            </Box>

            <Text fontSize="lg" color="gray.700">
              <strong>
                {disease.name === "Tidak Terdeteksi Masalah Serius" 
                  ? "Tidak terdeteksi indikasi masalah kesehatan serius." 
                  : `Terdeteksi indikasi ${disease.name.toLowerCase()} dengan tingkat persetujuan ${disease.riskCategory.toLowerCase()}.`}
              </strong>
            </Text>

            {/* REKOMENDASI UTAMA */}
            <Box w="full" mt={4}>
              <Heading size="md" color="red.600" mb={4}>Rekomendasi</Heading>
              
              <Box mb={4}>
                <Heading size="sm" color="blue.700" mb={2}>Konsultasi dengan Tenaga Kesehatan</Heading>
                <Text color="gray.600">
                  Kami menyarankan Anda untuk melakukan pemeriksaan kesehatan lebih lanjut di fasilitas layanan kesehatan terdekat (Puskesmas, Klinik, atau Rumah Sakit).
                </Text>
              </Box>

              {hasRekomendasi && (
                <Box mb={4}>
                  <Heading size="sm" color="blue.700" mb={2}>Langkah yang Dapat Dilakukan</Heading>
                  <VStack spacing={2} align="start">
                    {disease.rekomendasi.map((item, index) => (
                      <Text key={index} color="gray.600">• {item}</Text>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
        
        {/* VIDEO EDUKASI */}
        <VideoGallerySection penyakit={disease} />
      </Box>
    );
  };

  // Render step berdasarkan currentStep
  const renderCurrentStep = () => {
    // Step 0: Pilih Penyakit
    if (currentStep === 0) {
      return <DiseaseSelectionPage />;
    }

    // Step 1: Data Diri
    if (currentStep === 1) {
      return (
        <Box w="100%">
          <Box mb={6} p={4} bg="blue.50" borderRadius="lg">
            <HStack justify="space-between" align="center">
              <Box>
                <Badge colorScheme="blue" fontSize="md" mb={2}>
                  Pemeriksaan: {selectedPenyakit?.name}
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  Silahkan lengkapi data diri Anda terlebih dahulu
                </Text>
              </Box>
              <Badge colorScheme="purple" fontSize="md">
                Step {currentStep} dari {diseaseSteps.length + 1}
              </Badge>
            </HStack>
          </Box>

          <Heading size="md" color="purple.700" mb={4}>Data Diri Responden</Heading>
          <FormControl isRequired mb={4}>
            <FormLabel fontSize="lg" fontWeight="medium">Nama Lengkap</FormLabel>
            <Input 
              value={formData.nama} 
              onChange={(e) => handleInputChange('nama', e.target.value)} 
              placeholder="Masukkan nama lengkap Anda" 
              size="lg" 
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel fontSize="lg" fontWeight="medium">Usia</FormLabel>
            <NumberInput value={formData.usia} onChange={(value) => handleInputChange('usia', value)} min={1} max={120}>
              <NumberInputField placeholder="Masukkan usia Anda" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel fontSize="lg" fontWeight="medium">Jenis Kelamin</FormLabel>
            <RadioGroup value={formData.jenisKelamin} onChange={(value) => handleInputChange('jenisKelamin', value)}>
              <Stack direction="row" spacing={8}>
                <Radio value="laki-laki" size="lg" colorScheme="purple">Laki-laki</Radio>
                <Radio value="perempuan" size="lg" colorScheme="purple">Perempuan</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>
      );
    }

    // Step 2+: Pertanyaan berdasarkan penyakit dengan format tabel
    const currentDisease = diseaseSteps[currentStep - 2];
    const questionsForDisease = groupedQuestions[currentDisease] || [];

    if (questionsForDisease.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">Tidak ada pernyataan yang tersedia.</Text>
        </Box>
      );
    }

    return (
      <DiseaseQuestionsPage 
        diseaseName={currentDisease}
        questions={questionsForDisease}
      />
    );
  };

  // Tampilkan loading sampai client-side siap
  if (!isClient) {
    return (
      <Box bg="white" minH="100vh">
        <Container maxW="container.md" py={10}>
          <VStack spacing={8}>
            <Skeleton height="50px" width="300px" />
            <Skeleton height="400px" width="100%" borderRadius="xl" />
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN HASIL ANALISIS
  if (showResults) {
    const results = calculateResults();
    const currentDisease = results.detectedDiseases[currentResultIndex];

    return (
      <Box bg="white" minH="100vh" pt={0}>
        <Container maxW="container.md" py={10}>
          <VStack spacing={8} align="stretch">
            <Button variant="outline" colorScheme="purple" leftIcon={<ChevronLeftIcon />} onClick={handleBack} alignSelf="flex-start">
              Kembali ke Kuesioner
            </Button>

            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={3} color="purple.800">Hasil Kuesioner Kesehatan</Heading>
              <Text color="gray.600">Berdasarkan penilaian yang Anda berikan</Text>
            </Box>

            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">Hasil Analisis Kuesioner</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Heading size="md" color="blue.700" mb={3}>Informasi Responden</Heading>
                    <VStack align="start" spacing={2}>
                      <Text><strong>Nama:</strong> {formData.nama}</Text>
                      <Text><strong>Usia:</strong> {formData.usia} tahun</Text>
                      <Text><strong>Jenis Kelamin:</strong> {formData.jenisKelamin}</Text>
                      <Text><strong>Tanggal Pengisian:</strong> {new Date().toLocaleDateString('id-ID')}</Text>
                      <Text><strong>Total Skor:</strong> {results.totalSkor}/{results.maxSkor} ({results.persentase}%)</Text>
                    </VStack>
                  </Box>

                  <DiseaseResultPage 
                    disease={currentDisease}
                    currentPage={currentResultIndex + 1}
                    totalPages={results.detectedDiseases.length}
                    onNext={handleNextResult}
                    onPrev={handlePrevResult}
                  />
                </VStack>
              </CardBody>
            </Card>

            {/* TOMBOL DOWNLOAD */}
            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="green.50" borderTopRadius="xl">
                <Heading size="md" color="green.700">Download Hasil Kuesioner</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text color="gray.600">
                    Unduh hasil kuesioner Anda untuk konsultasi dengan tenaga kesehatan.
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Button
                      leftIcon={<DownloadIcon />}
                      colorScheme="blue"
                      size="lg"
                      onClick={downloadTxtResults}
                    >
                      Download TXT
                    </Button>
                    
                    <Button
                      leftIcon={<PdfIcon />}
                      colorScheme="red"
                      size="lg"
                      onClick={downloadPdfResults}
                    >
                      Download PDF
                    </Button>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            <VideoPlayerModal 
              isOpen={isVideoModalOpen}
              onClose={onVideoModalClose}
              video={selectedVideo}
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN MULTI-STEP FORM
  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Progress Bar */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                {currentStep === 0 ? 'Pilih Jenis Pemeriksaan' : 
                 currentStep === 1 ? 'Data Diri' : 
                 `Pertanyaan ${currentStep - 1} dari ${diseaseSteps.length}`}
              </Text>
              <Text fontSize="sm" color="gray.600">{Math.round(progress)}%</Text>
            </HStack>
            <Progress value={progress} colorScheme="purple" size="lg" borderRadius="full" />
          </Box>

          <Button variant="outline" colorScheme="purple" leftIcon={<ChevronLeftIcon />} onClick={handleBack} alignSelf="flex-start">
            Kembali
          </Button>

          {/* JUDUL TUNGGAL - TIDAK ADA DUPLIKASI */}
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={3} color="purple.800">
              {currentStep === 0 ? 'Pilih Jenis Pemeriksaan' : 
               currentStep === 1 ? 'Data Diri Responden' : 
               'Borang Kaji Selidik Kesehatan'}
            </Heading>
            <Text color="gray.600">
              {currentStep === 0 
                ? 'Silahkan pilih jenis pemeriksaan sesuai dengan keluhan yang anda rasakan' 
                : currentStep === 1
                ? 'Lengkapi data diri Anda terlebih dahulu'
                : 'Berikan penilaian untuk setiap pernyataan dengan skala 1-10'}
            </Text>
          </Box>

          <Card borderRadius="xl" boxShadow="lg">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {renderCurrentStep()}

                  {/* Informasi Penting */}
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" mb={1}>Petunjuk Pengisian</Text>
                      <Text fontSize="sm">
                        {currentStep === 0 
                          ? 'Pilih salah satu jenis pemeriksaan untuk melanjutkan ke tahap berikutnya.'
                          : currentStep === 1
                          ? 'Data yang Anda berikan akan dijaga kerahasiaannya dan digunakan hanya untuk tujuan assessment kesehatan.'
                          : 'Gunakan skala 1-10 untuk menilai setiap pernyataan: 1 = Sangat Tidak Setuju, 10 = Sangat Sangat Setuju'}
                      </Text>
                    </Box>
                  </Alert>

                  {/* Navigation Buttons */}
                  <HStack w="100%" spacing={4}>
                    <Button 
                      onClick={handleNext} 
                      w="100%" 
                      size="lg" 
                      colorScheme="purple"
                      rightIcon={currentStep > 0 ? <ChevronRightIcon /> : undefined}
                    >
                      {currentStep === 0 
                        ? 'Lanjutkan ke Data Diri' 
                        : currentStep === 1
                        ? 'Mulai Kuesioner'
                        : currentStep === diseaseSteps.length + 1
                        ? 'Lihat Hasil'
                        : 'Lanjutkan'}
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}