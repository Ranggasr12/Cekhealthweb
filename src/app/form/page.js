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
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
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

// Komponen untuk Rating Scale 1-10 - SEDERHANA TANPA WARNA DAN TULISAN
const RatingScale = ({ value, onChange }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <VStack spacing={4} w="100%">
      {/* Number Grid - TAMPILAN BULAT TANPA WARNA */}
      <SimpleGrid columns={5} spacing={3} w="100%">
        {numbers.map((number) => (
          <Button
            key={number}
            size="lg"
            colorScheme="blue"
            variant={value === number.toString() ? 'solid' : 'outline'}
            onClick={() => onChange(number.toString())}
            borderRadius="full"
            height="60px"
            width="60px"
            minWidth="60px"
            p={0}
          >
            <Text fontSize="xl" fontWeight="bold">{number}</Text>
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

// Komponen untuk YouTube Thumbnail Card
const YouTubeThumbnailCard = ({ video, onPlay }) => {
  const getYouTubeId = (url) => {
    const videoUrl = url || video.video_url;
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
              alt={video.judul}
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
        <Text fontWeight="bold" fontSize="lg" mb={2} noOfLines={2}>{video.judul}</Text>
        <Text color="gray.600" fontSize="sm" mb={3} noOfLines={3}>
          {video.deskripsi || "Video edukasi tentang kesehatan"}
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
    const videoUrl = url || video?.video_url;
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
        <ModalHeader>{video.judul}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {embedUrl ? (
            <AspectRatio ratio={16 / 9}>
              <Box 
                as="iframe" 
                src={embedUrl}
                title={video.judul}
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
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetchPertanyaan();
  }, []);

  // Fetch pertanyaan dari Firestore
  const fetchPertanyaan = async () => {
    try {
      setLoadingPertanyaan(true);
      const q = query(collection(db, 'pertanyaan'), orderBy('created_at', 'asc'));
      const querySnapshot = await getDocs(q);
      const pertanyaanData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPertanyaan(pertanyaanData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pertanyaan',
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
      const q = query(collection(db, 'materi_penyakit'));
      const querySnapshot = await getDocs(q);
      const materiData = querySnapshot.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data()
        };
        
        if (!data.url && data.video_url) {
          data.url = data.video_url;
        }
        
        return data;
      });

      const groupedMateri = {};
      
      const fallbackMatches = {
        'nutrisi makan': 'nutrisi',
        'pencernaan': 'sistem pencernaan',
        'gangguan pernafasan': 'sistem pernapasan', 
        'gangguan istirahat tidur': 'istirahat tidur',
        'perkemihan': 'sistem perkemihan',
        'syaraf': 'persyarafan',
        'saraf': 'persyarafan',
        'kardiovaskuler': 'kardiovaskular'
      };
      
      penyakitNames.forEach(penyakit => {
        const videosForPenyakit = materiData.filter(m => {
          if (!m.nama_penyakit || m.jenis_materi !== 'video') {
            return false;
          }
          
          const materiPenyakitNormalized = m.nama_penyakit.toLowerCase().trim();
          const targetPenyakitNormalized = penyakit.toLowerCase().trim();
          
          const exactMatch = materiPenyakitNormalized === targetPenyakitNormalized;
          if (exactMatch) return true;
          
          const fallbackTarget = fallbackMatches[materiPenyakitNormalized];
          const fallbackMatch = fallbackTarget === targetPenyakitNormalized;
          
          return fallbackMatch;
        });
        
        groupedMateri[penyakit] = { videos: videosForPenyakit || [] };
      });

      setMateriCache(prev => ({ ...prev, [cacheKey]: groupedMateri }));
      setMateriPenyakit(groupedMateri);
      
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat video edukasi',
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
    const materi = materiPenyakit[penyakit.name] || { videos: [] };

    if (!materi.videos || materi.videos.length === 0) {
      return (
        <Box mt={6} p={6} bg="gray.50" borderRadius="lg">
          <VStack spacing={3} align="center">
            <VideoIcon fontSize="32px" color="gray.400" />
            <Heading size="md" color="gray.600">Video Edukasi {penyakit.name}</Heading>
            <Text color="gray.500" textAlign="center">
              Video edukasi untuk {penyakit.name} sedang dalam pengembangan.
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
            {materi.videos.map((video) => (
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

    let content = `HASIL SKRINING KESEHATAN - CEKHEALTH\n`;
    content += `========================================\n\n`;
    
    content += `INFORMASI PASIEN:\n`;
    content += `- Nama: ${formData.nama}\n`;
    content += `- Usia: ${formData.usia} tahun\n`;
    content += `- Jenis Kelamin: ${formData.jenisKelamin}\n`;
    content += `- Tanggal Pemeriksaan: ${timestamp}\n\n`;
    
    content += `STATISTIK SKRINING:\n`;
    content += `- Total Pertanyaan: ${results.totalPertanyaan}\n`;
    content += `- Pertanyaan Terjawab: ${results.pertanyaanTerjawab}\n`;
    content += `- Penyakit Terdeteksi: ${results.detectedDiseases.length}\n\n`;
    
    content += `HASIL DETEKSI PENYAKIT:\n`;
    content += `=======================\n\n`;
    
    results.detectedDiseases.forEach((disease, index) => {
      content += `${index + 1}. ${disease.name.toUpperCase()}\n`;
      content += `   - Skor Rata-rata: ${disease.averageScore.toFixed(1)}/10\n`;
      content += `   - Kategori Risiko: ${disease.riskCategory}\n\n`;
      
      if (disease.rekomendasi && disease.rekomendasi.length > 0) {
        content += `   REKOMENDASI:\n`;
        disease.rekomendasi.forEach(rekomendasi => {
          content += `   • ${rekomendasi}\n`;
        });
        content += `\n`;
      }
    });
    
    content += `DISCLAIMER MEDIS:\n`;
    content += `=================\n`;
    content += `Hasil skrining ini merupakan alat bantu diagnosis awal dan tidak menggantikan konsultasi dengan tenaga medis profesional. Selalu konsultasikan kondisi kesehatan Anda dengan dokter untuk diagnosis dan penanganan yang tepat.\n\n`;
    
    content += `www.cekhealth.com\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hasil-skrining-${formData.nama.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil skrining telah diunduh dalam format TXT',
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
    doc.text('HASIL SKRINING KESEHATAN', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistem Pemeriksaan Kesehatan Digital - CEKHEALTH', pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 45, { align: 'center' });

    yPosition = 70;

    // Informasi Pasien
    checkPageBreak(40);
    doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PASIEN', margin + 5, yPosition + 5.5);

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

    // Hasil Deteksi
    checkPageBreak(30);
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('HASIL DETEKSI PENYAKIT', margin + 5, yPosition + 5.5);

    yPosition += 15;

    // Hasil untuk setiap penyakit
    results.detectedDiseases.forEach((disease, index) => {
      checkPageBreak(60);

      let diseaseColor;
      if (disease.name === "Tidak Terdeteksi Penyakit Serius") {
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
      
      const confidenceText = `Skor Rata-rata: ${disease.averageScore.toFixed(1)}/10 | Kategori Risiko: ${disease.riskCategory}`;
      doc.text(confidenceText, margin + 5, yPosition);
      yPosition += 8;

      const description = disease.name === "Tidak Terdeteksi Penyakit Serius" 
        ? "Berdasarkan hasil skrining, tidak terdeteksi indikasi penyakit serius. Pertahankan pola hidup sehat dan lakukan pemeriksaan rutin."
        : `Terdeteksi indikasi ${disease.name.toLowerCase()} dengan skor rata-rata ${disease.averageScore.toFixed(1)}/10. Hasil ini merupakan peringatan dini dan memerlukan konsultasi lebih lanjut dengan tenaga kesehatan.`;
      
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
      "Hasil skrining ini merupakan alat bantu diagnosis awal dan tidak menggantikan konsultasi dengan tenaga medis profesional.",
      "Selalu konsultasikan kondisi kesehatan Anda dengan dokter untuk diagnosis dan penanganan yang tepat.",
      `Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleDateString('id-ID')} - www.cekhealth.com`
    ];
    
    disclaimerLines.forEach((text, index) => {
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(splitText, pageWidth / 2, footerY + 6 + (index * 10), { align: 'center' });
    });

    const fileName = `hasil-skrining-${formData.nama.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
    doc.save(fileName);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil skrining telah diunduh dalam format PDF',
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

    const unansweredQuestions = pertanyaan.filter(q => !jawaban[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: 'Pertanyaan Belum Lengkap',
        description: `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab`,
        status: 'warning',
        duration: 5000,
      });
      return false;
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
        diseaseScores[penyakit] = { totalScore: 0, questionCount: 0 };
      }
      
      const jawabanValue = jawaban[question.id];
      if (jawabanValue) {
        const score = parseInt(jawabanValue);
        diseaseScores[penyakit].totalScore += score;
        diseaseScores[penyakit].questionCount += 1;
        
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
      
      let riskCategory = "Rendah";
      
      if (averageScore >= 7) {
        riskCategory = "Tinggi";
      } else if (averageScore >= 4) {
        riskCategory = "Sedang";
      }
      
      if (averageScore >= 4) {
        const rekomendasiPenyakit = semuaRekomendasi.filter(r => r.penyakit === penyakit).map(r => r.rekomendasi);

        detectedDiseases.push({
          name: penyakit,
          averageScore: averageScore,
          totalQuestions: data.questionCount,
          riskCategory: riskCategory,
          rekomendasi: rekomendasiPenyakit,
        });
      }
    });

    if (detectedDiseases.length === 0) {
      detectedDiseases.push({
        name: "Tidak Terdeteksi Penyakit Serius",
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

    detectedDiseases.sort((a, b) => {
      const riskOrder = { "Tinggi": 3, "Sedang": 2, "Rendah": 1 };
      return riskOrder[b.riskCategory] - riskOrder[a.riskCategory];
    });

    return {
      detectedDiseases: detectedDiseases,
      totalPertanyaan: pertanyaan.length,
      pertanyaanTerjawab: Object.keys(jawaban).length
    };
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setShowResults(true);
    const results = calculateResults();
    
    const detectedDiseaseNames = results.detectedDiseases
      .filter(disease => disease.name !== "Tidak Terdeteksi Penyakit Serius")
      .map(disease => disease.name);
    
    if (detectedDiseaseNames.length > 0) {
      await fetchMateriPenyakit(detectedDiseaseNames);
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
      toast({ title: 'Berhasil', description: 'Hasil skrining telah disimpan', status: 'success', duration: 3000 });
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  // Navigasi
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.nama.trim() || !formData.usia || !formData.jenisKelamin) {
        toast({ title: 'Data tidak lengkap', description: 'Harap lengkapi data diri terlebih dahulu', status: 'warning', duration: 3000 });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  // Progress calculation
  useEffect(() => {
    if (currentStep === 0) {
      setProgress(10);
    } else if (currentStep === 1) {
      const answered = Object.keys(jawaban).length;
      const total = pertanyaan.length;
      setProgress(10 + (answered / total) * 80);
    } else {
      setProgress(100);
    }
  }, [currentStep, jawaban, pertanyaan.length]);

  // Komponen untuk menampilkan hasil penyakit individual - DIUBAH
  const DiseaseResultCard = ({ disease }) => {
    const hasRekomendasi = disease.rekomendasi && disease.rekomendasi.length > 0;

    return (
      <Box key={disease.name} mb={6}>
        <Box 
          p={6} 
          bg={
            disease.name === "Tidak Terdeteksi Penyakit Serius" ? "green.50" :
            disease.riskCategory === "Tinggi" ? "red.50" : 
            disease.riskCategory === "Sedang" ? "orange.50" : "yellow.50"
          } 
          borderRadius="lg"
          borderLeft="4px"
          borderColor={
            disease.name === "Tidak Terdeteksi Penyakit Serius" ? "green.400" :
            disease.riskCategory === "Tinggi" ? "red.400" : 
            disease.riskCategory === "Sedang" ? "orange.400" : "yellow.400"
          }
        >
          <VStack align="start" spacing={4}>
            <Heading size="xl" color={
              disease.name === "Tidak Terdeteksi Penyakit Serius" ? "green.600" :
              disease.riskCategory === "Tinggi" ? "red.600" : 
              disease.riskCategory === "Sedang" ? "orange.600" : "yellow.600"
            }>
              {disease.name}
            </Heading>

            {/* HAPUS SKOR RATA-RATA DAN TINGKAT KEYAKINAN */}
            <Text fontSize="lg" color="gray.700">
              <strong>
                {disease.name === "Tidak Terdeteksi Penyakit Serius" 
                  ? "Tidak terdeteksi indikasi penyakit serius." 
                  : `Terdeteksi indikasi ${disease.name.toLowerCase()}.`}
              </strong>
            </Text>

            {/* REKOMENDASI UTAMA - PERIKSA KE FASILITAS KESEHATAN */}
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
        
        {/* VIDEO EDUKASI DITAMPILKAN KEMBALI */}
        <VideoGallerySection penyakit={disease} />
      </Box>
    );
  };

  // Render pertanyaan
  const renderQuestion = (question, index) => {
    return (
      <FormControl key={question.id} mb={8} isRequired>
        <FormLabel fontSize="lg" fontWeight="medium" mb={4}>
          {index + 1}. {question.pertanyaan_text}
        </FormLabel>
        <RatingScale
          value={jawaban[question.id] || ''}
          onChange={(value) => handleRatingChange(question.id, value)}
        />
      </FormControl>
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

    return (
      <Box bg="white" minH="100vh" pt={0}>
        <Container maxW="container.md" py={10}>
          <VStack spacing={8} align="stretch">
            <Button variant="outline" colorScheme="purple" leftIcon={<ChevronLeftIcon />} onClick={handleBack} alignSelf="flex-start">
              Kembali ke Form
            </Button>

            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={3} color="purple.800">Hasil Skrining Kesehatan</Heading>
              <Text color="gray.600">Berdasarkan jawaban yang Anda berikan</Text>
            </Box>

            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">Hasil Skrining Kesehatan</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Heading size="md" color="blue.700" mb={3}>Informasi Medis</Heading>
                    <VStack align="start" spacing={2}>
                      <Text><strong>Nama:</strong> {formData.nama}</Text>
                      <Text><strong>Usia:</strong> {formData.usia} tahun</Text>
                      <Text><strong>Jenis Kelamin:</strong> {formData.jenisKelamin}</Text>
                      <Text><strong>Tanggal Pemeriksaan:</strong> {new Date().toLocaleDateString('id-ID')}</Text>
                    </VStack>
                  </Box>

                  {results.detectedDiseases.map((disease) => (
                    <DiseaseResultCard key={disease.name} disease={disease} />
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* TOMBOL DOWNLOAD KEMBALI DITAMBAHKAN */}
            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="green.50" borderTopRadius="xl">
                <Heading size="md" color="green.700">Download Hasil Skrining</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text color="gray.600">
                    Unduh hasil skrining Anda untuk konsultasi dengan tenaga kesehatan.
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
                {currentStep === 0 ? 'Data Diri' : 'Pertanyaan Kesehatan'}
              </Text>
              <Text fontSize="sm" color="gray.600">{Math.round(progress)}%</Text>
            </HStack>
            <Progress value={progress} colorScheme="purple" size="lg" borderRadius="full" />
          </Box>

          <Button variant="outline" colorScheme="purple" leftIcon={<ChevronLeftIcon />} onClick={handleBack} alignSelf="flex-start">
            Kembali
          </Button>

          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={3} color="purple.800">
              {currentStep === 0 ? 'Data Diri' : 'Pertanyaan Kesehatan'}
            </Heading>
            <Text color="gray.600">
              {currentStep === 0 ? 'Lengkapi data diri Anda terlebih dahulu' : 'Jawab semua pertanyaan berikut'}
            </Text>
          </Box>

          <Card borderRadius="xl" boxShadow="lg">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* STEP 1: Data Diri */}
                  {currentStep === 0 && (
                    <Box w="100%">
                      <Heading size="md" color="purple.700" mb={4}>Data Diri</Heading>
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
                  )}

                  {/* STEP 2: Pertanyaan Kesehatan */}
                  {currentStep === 1 && (
                    <Box w="100%">
                      <Heading size="md" color="purple.700" mb={4}>
                        Pertanyaan Kesehatan
                        <Text fontSize="sm" color="gray.600" fontWeight="normal" mt={1}>
                          {Object.keys(jawaban).length} dari {pertanyaan.length} pertanyaan terjawab
                        </Text>
                      </Heading>
                      {loadingPertanyaan ? (
                        <VStack spacing={4}>
                          {[1, 2, 3].map((item) => (
                            <Skeleton key={item} height="100px" width="100%" borderRadius="md" />
                          ))}
                        </VStack>
                      ) : pertanyaan.length === 0 ? (
                        <Box textAlign="center" py={8}>
                          <Text color="gray.500" mb={4}>Belum ada pertanyaan yang tersedia.</Text>
                          <Button colorScheme="blue" onClick={fetchPertanyaan}>Coba Muat Ulang</Button>
                        </Box>
                      ) : (
                        <VStack spacing={6}>
                          {pertanyaan.map((question, index) => renderQuestion(question, index))}
                        </VStack>
                      )}
                    </Box>
                  )}

                  {/* Informasi Penting */}
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" mb={1}>Informasi Penting</Text>
                      <Text fontSize="sm">
                        {currentStep === 0 
                          ? 'Data yang Anda berikan akan dijaga kerahasiaannya dan digunakan hanya untuk tujuan skrining kesehatan.'
                          : 'Jawablah semua pertanyaan dengan jujur sesuai kondisi kesehatan Anda saat ini.'}
                      </Text>
                    </Box>
                  </Alert>

                  {/* Navigation Buttons */}
                  <HStack w="100%" spacing={4}>
                    {currentStep === 0 ? (
                      <Button onClick={handleNext} w="100%" size="lg" colorScheme="purple">
                        Lanjut ke Pertanyaan
                      </Button>
                    ) : (
                      <Button type="submit" w="100%" size="lg" colorScheme="purple" isLoading={loadingPertanyaan}>
                        Lihat Hasil Skrining
                      </Button>
                    )}
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