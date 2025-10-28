"use client";

import { useState, useEffect, useRef } from 'react';
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
  Badge,
  Link,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Image,
  AspectRatio,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import { ExternalLinkIcon, DownloadIcon as ChakraDownloadIcon } from '@chakra-ui/icons';

// SVG Icons
const ChevronLeftIcon = (props) => (
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
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
  </svg>
);

const DownloadIcon = (props) => (
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

const PdfIcon = (props) => (
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
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"></path>
  </svg>
);

const VideoIcon = (props) => (
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
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
  </svg>
);

export default function FormPage() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pertanyaan, setPertanyaan] = useState([]);
  const [loadingPertanyaan, setLoadingPertanyaan] = useState(true);
  const [materiPenyakit, setMateriPenyakit] = useState({});
  const [loadingMateri, setLoadingMateri] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
    email: '',
    telepon: ''
  });
  const [jawaban, setJawaban] = useState({});

  useEffect(() => {
    setIsClient(true);
    fetchPertanyaan();
  }, []);

  const fetchPertanyaan = async () => {
    try {
      const { data, error } = await supabase
        .from('pertanyaan')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setPertanyaan(data || []);
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

  const fetchMateriPenyakit = async (penyakitNames) => {
    setLoadingMateri(true);
    try {
      // HANYA AMBIL VIDEO, HAPUS MAKALAH
      const { data, error } = await supabase
        .from('materi_penyakit')
        .select('*')
        .in('nama_penyakit', penyakitNames)
        .eq('jenis_materi', 'video'); // FILTER HANYA VIDEO
      
      if (error) throw error;

      // Group materials by disease name - HANYA VIDEO
      const groupedMateri = {};
      penyakitNames.forEach(penyakit => {
        groupedMateri[penyakit] = {
          videos: [] // HAPUS MAKALAH
        };
      });

      data?.forEach(materi => {
        if (materi.jenis_materi === 'video' && groupedMateri[materi.nama_penyakit]) {
          groupedMateri[materi.nama_penyakit].videos.push(materi);
        }
        // HAPUS BAGIAN MAKALAH
      });

      setMateriPenyakit(groupedMateri);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoadingMateri(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJawabanChange = (pertanyaanId, value) => {
    setJawaban(prev => ({
      ...prev,
      [pertanyaanId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi apakah semua pertanyaan sudah dijawab
    const unansweredQuestions = pertanyaan.filter(q => !jawaban[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: 'Pertanyaan Belum Lengkap',
        description: `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab`,
        status: 'warning',
        duration: 5000,
      });
      return;
    }

    console.log("Form submitted:", { formData, jawaban });
    setShowResults(true);
    
    // Hitung hasil dan ambil materi terkait
    const results = calculateResults();
    const detectedDiseaseNames = results.detectedDiseases
      .filter(disease => disease.name !== "Tidak Terdeteksi Penyakit Serius")
      .map(disease => disease.name);
    
    if (detectedDiseaseNames.length > 0) {
      await fetchMateriPenyakit(detectedDiseaseNames);
    }

    // Simpan hasil ke database
    try {
      const { error } = await supabase
        .from('hasil_diagnosa')
        .insert([{
          nama: formData.nama,
          usia: formData.usia,
          jenis_kelamin: formData.jenisKelamin,
          email: formData.email,
          telepon: formData.telepon,
          jawaban: jawaban,
          hasil: results,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const calculateResults = () => {
    const scores = {};
    const penyakitMap = {};
    
    // Group questions by disease type and calculate scores
    pertanyaan.forEach(question => {
      const penyakit = question.jenis_penyakit;
      if (!scores[penyakit]) {
        scores[penyakit] = 0;
        penyakitMap[penyakit] = [];
      }
      
      const jawabanValue = jawaban[question.id];
      if (jawabanValue === 'ya') {
        scores[penyakit] += 1;
      }
      
      penyakitMap[penyakit].push({
        pertanyaan: question.pertanyaan_text,
        jawaban: jawabanValue,
        saran: question.saran,
        indikasi: question.indikasi
      });
    });

    // Determine diseases with high risk
    const detectedDiseases = [];
    Object.keys(scores).forEach(penyakit => {
      const score = scores[penyakit];
      const totalQuestions = penyakitMap[penyakit].length;
      const percentage = (score / totalQuestions) * 100;
      
      if (percentage >= 50) { // Jika 50% atau lebih jawaban "ya"
        detectedDiseases.push({
          name: penyakit,
          confidence: percentage >= 70 ? "Tinggi" : "Sedang",
          score: score,
          total: totalQuestions,
          percentage: percentage,
          questions: penyakitMap[penyakit],
          penanganan: getPenanganan(penyakit, percentage),
          rekomendasi: getRekomendasi(penyakit, percentage)
        });
      }
    });

    // Jika tidak ada penyakit terdeteksi
    if (detectedDiseases.length === 0) {
      detectedDiseases.push({
        name: "Tidak Terdeteksi Penyakit Serius",
        confidence: "Rendah",
        score: 0,
        total: 0,
        percentage: 0,
        questions: [],
        penanganan: [
          "Teruskan pola hidup sehat yang sudah Anda jalani",
          "Monitor kesehatan secara berkala",
          "Lakukan aktivitas fisik ringan secara teratur"
        ],
        rekomendasi: [
          "Tetap jaga pola hidup sehat dengan makan makanan bergizi",
          "Lakukan olahraga rutin minimal 30 menit per hari",
          "Lakukan pemeriksaan kesehatan rutin setahun sekali",
          "Konsultasi dokter jika muncul gejala baru"
        ]
      });
    }

    return {
      scores,
      detectedDiseases,
      summary: `Terdeteksi ${detectedDiseases.length} potensi kondisi kesehatan`
    };
  };

  const getPenanganan = (penyakit, percentage) => {
    const penanganan = {
      'Diabetes': [
        "Segera konsultasi dengan dokter spesialis penyakit dalam",
        "Lakukan pemeriksaan gula darah lengkap (GDP, 2JPP, HbA1c)",
        "Mulai pengaturan pola makan dengan mengurangi asupan gula dan karbohidrat sederhana",
        "Monitor gula darah mandiri secara rutin"
      ],
      'Hipertensi': [
        "Konsultasi dengan dokter untuk pengukuran tekanan darah yang akurat",
        "Lakukan pemantauan tekanan darah harian",
        "Mulai terapi non-farmakologi dengan mengurangi garam",
        "Evaluasi faktor risiko kardiovaskular lainnya"
      ],
      'Jantung': [
        "Segera konsultasi dengan dokter spesialis jantung",
        "Lakukan pemeriksaan EKG dan ekokardiografi",
        "Evaluasi faktor risiko jantung secara menyeluruh",
        "Mulai modifikasi gaya hidup jantung sehat"
      ],
      'Kolesterol': [
        "Konsultasi dengan dokter untuk pemeriksaan lipid profile",
        "Lakukan pemeriksaan kolesterol lengkap (LDL, HDL, Trigliserida)",
        "Mulai diet rendah lemak jenuh dan kolesterol",
        "Tingkatkan aktivitas fisik secara bertahap"
      ],
      'Asma': [
        "Konsultasi dengan dokter spesialis paru",
        "Lakukan tes fungsi paru (spirometri)",
        "Identifikasi dan hindari pemicu alergi",
        "Pelajari teknik pernapasan yang benar"
      ],
      'Gastrointestinal': [
        "Konsultasi dengan dokter spesialis pencernaan",
        "Lakukan pemeriksaan penunjang jika diperlukan",
        "Modifikasi pola makan menjadi lebih teratur",
        "Hindari makanan yang memicu gejala"
      ],
      'Mental Health': [
        "Konsultasi dengan psikolog atau psikiater",
        "Lakukan assessment kesehatan mental lengkap",
        "Mulai terapi perilaku kognitif jika diperlukan",
        "Bangun sistem dukungan sosial yang kuat"
      ],
      'Umum': [
        "Konsultasi dengan dokter untuk evaluasi menyeluruh",
        "Lakukan pemeriksaan laboratorium dasar",
        "Terapkan pola hidup sehat secara konsisten",
        "Monitor perkembangan gejala secara berkala"
      ]
    };

    return penanganan[penyakit] || penanganan['Umum'];
  };

  const getRekomendasi = (penyakit, percentage) => {
    const rekomendasi = {
      'Diabetes': [
        "Kontrol rutin ke dokter setiap 3 bulan sekali",
        "Ikuti program edukasi diabetes",
        "Bergabung dengan komunitas diabetes untuk dukungan",
        "Pelajari cara menghitung indeks glikemik makanan"
      ],
      'Hipertensi': [
        "Lakukan pemeriksaan tekanan darah mingguan",
        "Ikuti program pengelolaan stres",
        "Kurangi konsumsi kopi dan alkohol",
        "Tingkatkan konsumsi makanan kaya kalium"
      ],
      'Jantung': [
        "Ikuti program rehabilitasi jantung",
        "Pelajari tanda-tanda darurat jantung",
        "Bawa obat emergency jika diperlukan",
        "Hindari aktivitas berat mendadak"
      ],
      'Kolesterol': [
        "Perbanyak konsumsi serat larut air",
        "Tingkatkan konsumsi omega-3",
        "Kontrol berat badan ideal",
        "Hindari makanan cepat saji"
      ],
      'Asma': [
        "Selalu bawa inhaler emergency",
        "Hindari paparan asap dan polusi",
        "Gunakan masker di tempat berdebu",
        "Lakukan pemanasan sebelum olahraga"
      ],
      'Gastrointestinal': [
        "Makan dengan porsi kecil tapi sering",
        "Kunyah makanan secara perlahan",
        "Hindari berbaring setelah makan",
        "Kelola stres dengan baik"
      ],
      'Mental Health': [
        "Praktikkan meditasi rutin",
        "Jaga komunikasi dengan keluarga",
        "Lakukan hobi yang menyenangkan",
        "Cukupi waktu tidur 7-8 jam sehari"
      ],
      'Umum': [
        "Lakukan medical check-up tahunan",
        "Terapkan pola makan seimbang",
        "Olahraga teratur 3-5 kali seminggu",
        "Istirahat yang cukup dan kelola stres"
      ]
    };

    return rekomendasi[penyakit] || rekomendasi['Umum'];
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleDownloadResults = () => {
    const results = calculateResults();
    const content = `
HASIL SKRINING KESEHATAN
========================

Data Pasien:
- Nama: ${formData.nama}
- Usia: ${formData.usia}
- Jenis Kelamin: ${formData.jenisKelamin}
- Email: ${formData.email}
- Telepon: ${formData.telepon}
- Tanggal Pemeriksaan: ${new Date().toLocaleDateString('id-ID')}

${results.summary}

${results.detectedDiseases.map(disease => `
${disease.name.toUpperCase()}
- Status: ${disease.confidence}

Penanganan Segera:
${disease.penanganan.map(item => `  • ${item}`).join('\n')}

Rekomendasi Jangka Panjang:
${disease.rekomendasi.map(item => `  • ${item}`).join('\n')}
`).join('\n')}

Catatan:
Hasil ini merupakan skrining awal berdasarkan gejala yang dilaporkan.
Disarankan untuk konsultasi dengan tenaga medis profesional untuk diagnosis yang akurat.

www.cekhealth.com
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hasil-skrining-${formData.nama}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil skrining telah berhasil diunduh',
      status: 'success',
      duration: 3000,
    });
  };

  const handleDownloadPDF = () => {
    const results = calculateResults();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 150);
    doc.text('HASIL SKRINING KESEHATAN', 105, 20, { align: 'center' });
    
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 25, 190, 25);
    
    let yPosition = 35;
    
    // Data Pasien
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('DATA PASIEN', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Nama: ${formData.nama}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Usia: ${formData.usia} tahun`, 20, yPosition);
    yPosition += 6;
    doc.text(`Jenis Kelamin: ${formData.jenisKelamin}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Email: ${formData.email || '-'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Telepon: ${formData.telepon || '-'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Tanggal Pemeriksaan: ${new Date().toLocaleDateString('id-ID')}`, 20, yPosition);
    yPosition += 15;
    
    // Ringkasan Hasil
    doc.setFontSize(14);
    doc.text('HASIL SKRINING', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(results.summary, 20, yPosition);
    yPosition += 15;
    
    // Detail Hasil Skrining
    doc.setFontSize(14);
    doc.text('DETAIL HASIL', 20, yPosition);
    yPosition += 10;
    
    results.detectedDiseases.forEach((disease, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`ANDA TERINDIKASI: ${disease.name.toUpperCase()}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Status: ${disease.confidence}`, 20, yPosition);
      yPosition += 10;
      
      doc.text('PENANGANAN SEGERA:', 20, yPosition);
      yPosition += 5;
      
      disease.penanganan.forEach((item, itemIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`  • ${item}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
      
      doc.text('REKOMENDASI JANGKA PANJANG:', 20, yPosition);
      yPosition += 5;
      
      disease.rekomendasi.forEach((item, itemIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`  • ${item}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 10;
    });
    
    // Catatan Penting
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(150, 0, 0);
    doc.text('CATATAN PENTING:', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const noteText = [
      "Hasil ini merupakan skrining awal berdasarkan gejala yang dilaporkan.",
      "Tidak menggantikan konsultasi dengan tenaga medis profesional.",
      "Disarankan untuk konsultasi dengan dokter untuk diagnosis yang akurat.",
      "Hasil pemeriksaan laboratorium dan pemeriksaan fisik diperlukan untuk konfirmasi."
    ];
    
    noteText.forEach((note, index) => {
      doc.text(`• ${note}`, 20, yPosition);
      yPosition += 5;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Dokumen ini dibuat secara otomatis oleh Sistem CekHealth - www.cekhealth.com', 105, 285, { align: 'center' });
    
    doc.save(`hasil-skrining-${formData.nama}-${new Date().getTime()}.pdf`);
    
    toast({
      title: 'PDF Berhasil Diunduh',
      description: 'Hasil skrining dalam format PDF telah berhasil diunduh',
      status: 'success',
      duration: 3000,
    });
  };

  // Komponen untuk menampilkan video
  const VideoCard = ({ video }) => (
    <Card borderRadius="lg" overflow="hidden" boxShadow="md">
      <AspectRatio ratio={16 / 9}>
        <Box
          as="iframe"
          src={video.url}
          title={video.judul}
          allowFullScreen
        />
      </AspectRatio>
      <CardBody>
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {video.judul}
        </Text>
        <Text color="gray.600" fontSize="sm" mb={3}>
          {video.deskripsi}
        </Text>
        <Button
          as="a"
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="blue"
          size="sm"
          rightIcon={<ExternalLinkIcon />}
        >
          Tonton di YouTube
        </Button>
      </CardBody>
    </Card>
  );

  // HAPUS KOMPONEN MAKALAHCARD
  // const MakalahCard = ({ makalah }) => ( ... )

  // Komponen untuk menampilkan materi pembelajaran - HANYA VIDEO
  const MateriSection = ({ penyakit }) => {
    const materi = materiPenyakit[penyakit.name] || { videos: [] };
    
    // HANYA TAMPILKAN JIKA ADA VIDEO
    if (materi.videos.length === 0) {
      return null;
    }

    return (
      <Box mt={6} p={4} bg="blue.50" borderRadius="lg">
        <Heading size="md" color="blue.700" mb={4}>
          📚 Video Edukasi Tentang {penyakit.name}
        </Heading>
        
        {/* HANYA VIDEO SECTION */}
        <Box>
          <HStack mb={3}>
            <Icon as={VideoIcon} w={5} h={5} color="red.500" />
            <Heading size="sm" color="gray.700">
              Video Edukasi
            </Heading>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {materi.videos.map((video, index) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </SimpleGrid>
        </Box>
        
        {/* HAPUS SELURUH BAGIAN MAKALAH */}
      </Box>
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

  const renderQuestion = (question, index) => (
    <FormControl key={question.id} mb={6} isRequired>
      <FormLabel fontSize="lg" fontWeight="medium" mb={4}>
        {index + 1}. {question.pertanyaan_text}
      </FormLabel>
      <RadioGroup
        value={jawaban[question.id] || ''}
        onChange={(val) => handleJawabanChange(question.id, val)}
      >
        <Stack direction="row" spacing={8}>
          <Radio value="ya" size="lg" colorScheme="purple">
            Ya
          </Radio>
          <Radio value="tidak" size="lg" colorScheme="purple">
            Tidak
          </Radio>
        </Stack>
      </RadioGroup>
      {question.saran && (
        <Text fontSize="sm" color="gray.600" mt={2}>
          💡 {question.saran}
        </Text>
      )}
    </FormControl>
  );

  // TAMPILAN HASIL ANALISIS
  if (showResults) {
    const results = calculateResults();

    return (
      <Box bg="white" minH="100vh" pt={0}>
        <Container maxW="container.md" py={10}>
          <VStack spacing={8} align="stretch">
            {/* Tombol Kembali */}
            <Button
              variant="outline"
              colorScheme="purple"
              leftIcon={<ChevronLeftIcon />}
              onClick={handleBack}
              alignSelf="flex-start"
              mb={4}
            >
              Kembali ke Home
            </Button>

            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={3} color="purple.800">
                🩺 Hasil Skrining Kesehatan
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Berdasarkan jawaban yang Anda berikan
              </Text>
            </Box>

            {/* Hasil Skrining */}
            <Card borderRadius="xl" boxShadow="lg" border="2px" borderColor="purple.200">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">
                  📊 Hasil Skrining Kesehatan
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {results.detectedDiseases.map((disease, index) => (
                    <Box key={index}>
                      <Box p={4} bg={disease.confidence === "Tinggi" ? "red.50" : disease.confidence === "Sedang" ? "orange.50" : "green.50"} borderRadius="md">
                        <HStack justify="space-between" mb={3}>
                          <Heading size="lg" color={disease.confidence === "Tinggi" ? "red.600" : disease.confidence === "Sedang" ? "orange.600" : "green.600"}>
                            {disease.confidence === "Tinggi" ? "⚠️ " : disease.confidence === "Sedang" ? "🔸 " : "✅ "}
                            Anda Terindikasi {disease.name}
                          </Heading>
                          <Badge 
                            colorScheme={disease.confidence === "Tinggi" ? "red" : disease.confidence === "Sedang" ? "orange" : "green"} 
                            fontSize="md"
                            px={3}
                            py={1}
                          >
                            {disease.confidence === "Tinggi" ? "Prioritas Tinggi" : disease.confidence === "Sedang" ? "Perlu Perhatian" : "Kondisi Baik"}
                          </Badge>
                        </HStack>
                        
                        <Box mb={4}>
                          <Text fontWeight="bold" color="gray.700" mb={2}>
                            🎯 Penanganan yang Disarankan:
                          </Text>
                          <VStack spacing={2} align="start">
                            {disease.penanganan.map((item, itemIndex) => (
                              <Text key={itemIndex} color="gray.600">
                                • {item}
                              </Text>
                            ))}
                          </VStack>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color="gray.700" mb={2}>
                            📝 Rekomendasi Jangka Panjang:
                          </Text>
                          <VStack spacing={2} align="start">
                            {disease.rekomendasi.map((item, itemIndex) => (
                              <Text key={itemIndex} color="gray.600">
                                • {item}
                              </Text>
                            ))}
                          </VStack>
                        </Box>
                      </Box>
                      
                      {/* Materi Pembelajaran - HANYA VIDEO */}
                      {disease.name !== "Tidak Terdeteksi Penyakit Serius" && (
                        <MateriSection penyakit={disease} />
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Button Download */}
            <HStack spacing={4}>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                size="lg"
                flex={1}
                onClick={handleDownloadResults}
              >
                Unduh Hasil (TXT)
              </Button>
              <Button
                leftIcon={<PdfIcon />}
                colorScheme="red"
                size="lg"
                flex={1}
                onClick={handleDownloadPDF}
              >
                Unduh Hasil (PDF)
              </Button>
            </HStack>

            <Alert status={results.detectedDiseases[0].confidence === "Tinggi" ? "error" : results.detectedDiseases[0].confidence === "Sedang" ? "warning" : "success"} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold" mb={2}>
                  {results.detectedDiseases[0].confidence === "Tinggi" 
                    ? "⚠️ Penting: Segera Konsultasi dengan Dokter!" 
                    : results.detectedDiseases[0].confidence === "Sedang"
                    ? "💡 Disarankan: Konsultasi dengan Dokter"
                    : "✅ Hasil Menunjukkan Kondisi yang Baik"}
                </Text>
                <Text>
                  {results.detectedDiseases[0].confidence === "Tinggi"
                    ? "Hasil skrining menunjukkan gejala yang memerlukan penanganan medis segera. Diagnosis akhir harus ditentukan oleh tenaga medis profesional melalui pemeriksaan lengkap."
                    : results.detectedDiseases[0].confidence === "Sedang"
                    ? "Hasil menunjukkan beberapa gejala yang perlu dikonsultasikan dengan dokter untuk evaluasi lebih lanjut."
                    : "Tetap jaga kesehatan dengan pola hidup sehat dan lakukan pemeriksaan rutin. Konsultasikan dengan dokter jika muncul gejala baru."}
                </Text>
              </Box>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN FORM (jika showResults = false)
  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Tombol Kembali */}
          <Button
            variant="outline"
            colorScheme="purple"
            leftIcon={<ChevronLeftIcon />}
            onClick={handleBack}
            alignSelf="flex-start"
          >
            Kembali ke Home
          </Button>

          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={3} color="purple.800">
              Skrining Kesehatan Mandiri
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Jawab semua pertanyaan berikut dengan jujur
            </Text>
          </Box>

          {/* Form */}
          <Card borderRadius="xl" boxShadow="lg">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Data Diri */}
                  <Box w="100%">
                    <Heading size="md" color="purple.700" mb={4}>
                      Data Diri
                    </Heading>
                    
                    <FormControl isRequired mb={4}>
                      <FormLabel fontSize="lg" fontWeight="medium">
                        Nama Lengkap
                      </FormLabel>
                      <Input
                        value={formData.nama}
                        onChange={(e) => handleInputChange('nama', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired mb={4}>
                      <FormLabel fontSize="lg" fontWeight="medium">
                        Usia
                      </FormLabel>
                      <NumberInput
                        value={formData.usia}
                        onChange={(value) => handleInputChange('usia', value)}
                        min={1}
                        max={120}
                      >
                        <NumberInputField
                          placeholder="Masukkan usia Anda"
                          size="lg"
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired mb={4}>
                      <FormLabel fontSize="lg" fontWeight="medium">
                        Jenis Kelamin
                      </FormLabel>
                      <RadioGroup
                        value={formData.jenisKelamin || ''}
                        onChange={(value) => handleInputChange('jenisKelamin', value)}
                      >
                        <Stack direction="row" spacing={8}>
                          <Radio value="laki-laki" size="lg" colorScheme="purple">
                            Laki-laki
                          </Radio>
                          <Radio value="perempuan" size="lg" colorScheme="purple">
                            Perempuan
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel fontSize="lg" fontWeight="medium">
                        Email
                      </FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@contoh.com"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="lg" fontWeight="medium">
                        Nomor Telepon
                      </FormLabel>
                      <Input
                        value={formData.telepon}
                        onChange={(e) => handleInputChange('telepon', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        size="lg"
                      />
                    </FormControl>
                  </Box>

                  {/* Pertanyaan Gejala */}
                  <Box w="100%">
                    <Heading size="md" color="purple.700" mb={4}>
                      Pertanyaan Gejala Kesehatan
                    </Heading>

                    {loadingPertanyaan ? (
                      <VStack spacing={4}>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <Skeleton key={item} height="100px" width="100%" borderRadius="md" />
                        ))}
                      </VStack>
                    ) : (
                      <VStack spacing={6}>
                        {pertanyaan.map((question, index) => renderQuestion(question, index))}
                      </VStack>
                    )}
                  </Box>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    Data yang Anda berikan akan dijaga kerahasiaannya dan digunakan hanya untuk tujuan skrining kesehatan.
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    w="100%"
                    size="lg"
                    colorScheme="purple"
                    isLoading={loadingPertanyaan}
                    isDisabled={pertanyaan.length === 0}
                  >
                    {pertanyaan.length === 0 ? 'Memuat Pertanyaan...' : 'Lihat Hasil Skrining'}
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}