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
  Badge,
  Link,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

// SVG Icon untuk Chevron Left
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

export default function FormPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    // Data Diri
    nama: '',
    usia: '',
    jenisKelamin: '',
    
    // Pertanyaan Gejala - inisialisasi dengan string kosong
    demensia1: '', demensia2: '', demensia3: '',
    kanker1: '', kanker2: '', kanker3: '',
    jantung1: '', jantung2: '', jantung3: '',
    paru1: '', paru2: '', paru3: '',
    stroke1: '', stroke2: '', stroke3: '',
    hiv1: '', hiv2: '', hiv3: '',
    tbc1: '', tbc2: '', tbc3: '',
    ginjal1: '', ginjal2: '', ginjal3: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowResults(true);
  };

  const handleBack = () => {
    router.push('/');
  };

  const calculateRiskScores = () => {
    const scores = {
      hiv: [formData.hiv1, formData.hiv2, formData.hiv3].filter(val => val === 'ya').length,
      jantung: [formData.jantung1, formData.jantung2, formData.jantung3].filter(val => val === 'ya').length,
      paru: [formData.paru1, formData.paru2, formData.paru3].filter(val => val === 'ya').length,
      kanker: [formData.kanker1, formData.kanker2, formData.kanker3].filter(val => val === 'ya').length,
      demensia: [formData.demensia1, formData.demensia2, formData.demensia3].filter(val => val === 'ya').length,
      tbc: [formData.tbc1, formData.tbc2, formData.tbc3].filter(val => val === 'ya').length,
      ginjal: [formData.ginjal1, formData.ginjal2, formData.ginjal3].filter(val => val === 'ya').length,
      stroke: [formData.stroke1, formData.stroke2, formData.stroke3].filter(val => val === 'ya').length,
    };

    return scores;
  };

  const getVideoRecommendations = (scores) => {
    const recommendations = [];
    
    if (scores.hiv >= 2) {
      recommendations.push({
        title: "Pencegahan HIV/AIDS",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Pentingnya pencegahan dan deteksi dini HIV/AIDS"
      });
    }

    if (scores.jantung >= 2) {
      recommendations.push({
        title: "Kesehatan Jantung",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Cara menjaga kesehatan jantung dan pembuluh darah"
      });
    }

    if (scores.paru >= 2) {
      recommendations.push({
        title: "Kesehatan Paru-paru",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Tips menjaga kesehatan pernapasan dan paru-paru"
      });
    }

    if (scores.kanker >= 2) {
      recommendations.push({
        title: "Deteksi Dini Kanker", 
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Pentingnya deteksi dini dan pencegahan kanker"
      });
    }

    if (scores.demensia >= 2) {
      recommendations.push({
        title: "Pencegahan Demensia",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Tips mencegah dan mengelola gejala demensia"
      });
    }

    if (scores.tbc >= 2) {
      recommendations.push({
        title: "Pengobatan TBC",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Pentingnya pengobatan TBC hingga tuntas"
      });
    }

    if (scores.ginjal >= 2) {
      recommendations.push({
        title: "Kesehatan Ginjal",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Cara menjaga kesehatan ginjal dan pencegahan gagal ginjal"
      });
    }

    if (scores.stroke >= 2) {
      recommendations.push({
        title: "Pencegahan Stroke",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
        description: "Cara mencegah dan mengenali gejala stroke"
      });
    }

    // Jika tidak ada risiko tinggi, berikan video umum
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Gaya Hidup Sehat",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Tips menjaga kesehatan secara umum"
      });
    }

    return recommendations;
  };

  // Fungsi untuk menentukan penyakit berdasarkan gejala
  const determineDiseases = (scores) => {
    const diseases = [];
    
    // HIV/AIDS
    if (scores.hiv >= 2) {
      diseases.push({
        name: "HIV/AIDS",
        confidence: "Tinggi",
        description: "Berdasarkan gejala infeksi berulang dan penurunan berat badan tanpa sebab",
        recommendations: [
          "Konsultasi dengan dokter spesialis penyakit dalam",
          "Lakukan tes HIV untuk konfirmasi",
          "Pemeriksaan CD4 dan viral load jika diperlukan"
        ]
      });
    }

    // Gagal Jantung
    if (scores.jantung >= 2) {
      diseases.push({
        name: "Gagal Jantung",
        confidence: "Tinggi",
        description: "Berdasarkan gejala sesak napas dan pembengkakan tubuh",
        recommendations: [
          "Konsultasi dengan dokter spesialis jantung",
          "Lakukan EKG dan ekokardiografi",
          "Pemeriksaan enzim jantung dan fungsi ginjal"
        ]
      });
    }

    // PPOK
    if (scores.paru >= 2) {
      diseases.push({
        name: "PPOK (Penyakit Paru Obstruktif Kronik)",
        confidence: "Tinggi",
        description: "Berdasarkan gejala batuk kronis dan sesak napas",
        recommendations: [
          "Konsultasi dengan dokter spesialis paru",
          "Lakukan spirometri untuk tes fungsi paru",
          "Rontgen dada dan CT Scan thorax"
        ]
      });
    }

    // Kanker
    if (scores.kanker >= 2) {
      diseases.push({
        name: "Kanker",
        confidence: "Tinggi", 
        description: "Berdasarkan gejala benjolan dan penurunan berat badan yang tidak biasa",
        recommendations: [
          "Segera konsultasi dengan dokter spesialis onkologi",
          "Lakukan pemeriksaan penunjang (USG, CT Scan, Biopsi)",
          "Pemeriksaan laboratorium lengkap"
        ]
      });
    }

    // Demensia
    if (scores.demensia >= 2) {
      diseases.push({
        name: "Demensia",
        confidence: "Tinggi",
        description: "Berdasarkan gejala gangguan memori dan kognitif yang dilaporkan",
        recommendations: [
          "Konsultasi dengan dokter spesialis saraf",
          "Lakukan pemeriksaan MMSE (Mini-Mental State Examination)",
          "Terapi kognitif dan aktivitas stimulasi otak"
        ]
      });
    }

    // TBC
    if (scores.tbc >= 2) {
      diseases.push({
        name: "Tuberkulosis (TBC)",
        confidence: "Tinggi",
        description: "Berdasarkan gejala batuk kronis dan keringat malam",
        recommendations: [
          "Konsultasi dengan dokter spesialis paru",
          "Lakukan tes dahak (BTA) dan rontgen dada",
          "Pengobatan TBC harus dilakukan hingga tuntas"
        ]
      });
    }

    // Gagal Ginjal Kronik
    if (scores.ginjal >= 2) {
      diseases.push({
        name: "Gagal Ginjal Kronik",
        confidence: "Tinggi",
        description: "Berdasarkan gejala lemas, mual, dan penurunan frekuensi buang air kecil",
        recommendations: [
          "Konsultasi dengan dokter spesialis ginjal",
          "Lakukan pemeriksaan kreatinin dan ureum darah",
          "USG ginjal dan pemeriksaan urine lengkap"
        ]
      });
    }

    // Stroke
    if (scores.stroke >= 2) {
      diseases.push({
        name: "Stroke",
        confidence: "Tinggi",
        description: "Berdasarkan gejala kelumpuhan dan gangguan bicara mendadak",
        recommendations: [
          "Segera ke IGD rumah sakit",
          "Konsultasi dengan dokter spesialis saraf",
          "CT Scan atau MRI kepala"
        ]
      });
    }

    // Jika tidak ada penyakit yang terdeteksi dengan gejala tinggi
    if (diseases.length === 0) {
      diseases.push({
        name: "Tidak Terdeteksi Penyakit Serius",
        confidence: "Rendah",
        description: "Berdasarkan gejala yang dilaporkan, tidak terdeteksi indikasi penyakit serius",
        recommendations: [
          "Tetap jaga pola hidup sehat",
          "Lakukan pemeriksaan kesehatan rutin",
          "Konsultasi dokter jika muncul gejala baru"
        ]
      });
    }

    return diseases;
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

  const renderQuestion = (question, field, value) => (
    <FormControl key={field} mb={6}>
      <FormLabel fontSize="lg" fontWeight="medium" mb={4}>
        {question}
      </FormLabel>
      <RadioGroup
        value={value || ''} // Pastikan tidak undefined
        onChange={(val) => handleInputChange(field, val)}
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
    </FormControl>
  );

  // TAMPILAN HASIL ANALISIS
  if (showResults) {
    const scores = calculateRiskScores();
    const videoRecommendations = getVideoRecommendations(scores);
    const detectedDiseases = determineDiseases(scores);

    return (
      <Box bg="white" minH="100vh" pt={0}>
        {/* Hasil Analisis */}
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
                🩺 Hasil Diagnosis Awal
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Berdasarkan analisis gejala yang Anda laporkan
              </Text>
            </Box>

            {/* Diagnosis Utama */}
            <Card borderRadius="xl" boxShadow="lg" border="2px" borderColor="purple.200">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">
                  🎯 Diagnosis yang Terdeteksi
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {detectedDiseases.map((disease, index) => (
                    <Box key={index} p={4} bg={disease.confidence === "Tinggi" ? "red.50" : "green.50"} borderRadius="md">
                      <HStack justify="space-between" mb={3}>
                        <Heading size="lg" color={disease.confidence === "Tinggi" ? "red.600" : "green.600"}>
                          {disease.name}
                        </Heading>
                        <Badge 
                          colorScheme={disease.confidence === "Tinggi" ? "red" : "green"} 
                          fontSize="md"
                          px={3}
                          py={1}
                        >
                          {disease.confidence === "Tinggi" ? "🔄 Perlu Penanganan Segera" : "✅ Kondisi Baik"}
                        </Badge>
                      </HStack>
                      
                      <Text color="gray.700" mb={4}>
                        {disease.description}
                      </Text>
                      
                      <Box>
                        <Text fontWeight="bold" color="gray.700" mb={2}>
                          📋 Rekomendasi Tindakan:
                        </Text>
                        <VStack spacing={2} align="start">
                          {disease.recommendations.map((rec, recIndex) => (
                            <Text key={recIndex} color="gray.600">
                              • {rec}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Detail Gejala */}
            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">
                  📊 Detail Analisis Gejala
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium">HIV/AIDS:</Text>
                    <Badge colorScheme={scores.hiv >= 2 ? "red" : "green"} fontSize="md">
                      {scores.hiv}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Gagal Jantung:</Text>
                    <Badge colorScheme={scores.jantung >= 2 ? "red" : "green"} fontSize="md">
                      {scores.jantung}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">PPOK (Penyakit Paru Obstruktif Kronik):</Text>
                    <Badge colorScheme={scores.paru >= 2 ? "red" : "green"} fontSize="md">
                      {scores.paru}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Kanker:</Text>
                    <Badge colorScheme={scores.kanker >= 2 ? "red" : "green"} fontSize="md">
                      {scores.kanker}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Demensia:</Text>
                    <Badge colorScheme={scores.demensia >= 2 ? "red" : "green"} fontSize="md">
                      {scores.demensia}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">TBC (Tuberkulosis):</Text>
                    <Badge colorScheme={scores.tbc >= 2 ? "red" : "green"} fontSize="md">
                      {scores.tbc}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Gagal Ginjal Kronik:</Text>
                    <Badge colorScheme={scores.ginjal >= 2 ? "red" : "green"} fontSize="md">
                      {scores.ginjal}/3 gejala
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Stroke:</Text>
                    <Badge colorScheme={scores.stroke >= 2 ? "red" : "green"} fontSize="md">
                      {scores.stroke}/3 gejala
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Rekomendasi Video */}
            <Card borderRadius="xl" boxShadow="lg">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">
                  🎥 Video Edukasi Rekomendasi
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6}>
                  {videoRecommendations.map((video, index) => (
                    <Box key={index} w="100%">
                      <Text fontWeight="bold" mb={2} color="purple.600" fontSize="lg">
                        {video.title}
                      </Text>
                      <Text color="gray.600" mb={3}>
                        {video.description}
                      </Text>
                      <Box
                        position="relative"
                        paddingBottom="56.25%"
                        height="0"
                        overflow="hidden"
                        borderRadius="md"
                      >
                        <iframe
                          src={video.url}
                          title={video.title}
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
                    </Box>
                  ))}
                  
                  <Button
                    as={Link}
                    href="/video-gallery"
                    colorScheme="purple"
                    variant="outline"
                    w="100%"
                    size="lg"
                    mt={4}
                  >
                    📺 Jelajahi Lebih Banyak Video Kesehatan
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Alert status={detectedDiseases[0].confidence === "Tinggi" ? "error" : "success"} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold" mb={2}>
                  {detectedDiseases[0].confidence === "Tinggi" 
                    ? "⚠️ Penting: Segera Konsultasi dengan Dokter!" 
                    : "✅ Hasil Menunjukkan Kondisi yang Baik"}
                </Text>
                <Text>
                  {detectedDiseases[0].confidence === "Tinggi"
                    ? "Hasil ini menunjukkan gejala yang memerlukan penanganan medis segera. Diagnosis akhir harus ditentukan oleh tenaga medis profesional melalui pemeriksaan lengkap."
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
    <Box 
      bg="white" 
      minH="100vh"
      position="relative"
      pt={0}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(128, 90, 213, 0.05) 0%, rgba(255, 105, 180, 0.03) 100%)",
        zIndex: 0
      }}
    >
      {/* Form Section */}
      <Container maxW="container.md" py={10} position="relative" zIndex={1}>
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
          <Box textAlign="center" position="relative" zIndex={2}>
            <Heading
              as="h1"
              size="2xl"
              mb={3}
              color="purple.800"
              fontWeight="extrabold"
            >
              Skrining Kesehatan Mandiri
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Jawab semua pertanyaan berikut dengan jujur
            </Text>
          </Box>

          {/* Kotak Background Transparan di Belakang Form */}
          <Box
            position="relative"
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            border="1px"
            borderColor="gray.100"
            _before={{
              content: '""',
              position: "absolute",
              top: "-20px",
              left: "-20px",
              right: "-20px",
              bottom: "-20px",
              bg: "linear-gradient(135deg, rgba(128, 90, 213, 0.1) 0%, rgba(255, 105, 180, 0.05) 50%, rgba(128, 90, 213, 0.1) 100%)",
              borderRadius: "2xl",
              zIndex: -1,
              filter: "blur(10px)",
            }}
          >
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
                      borderRadius="md"
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "purple.500",
                        boxShadow: "0 0 0 1px purple.500"
                      }}
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
                        borderRadius="md"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px purple.500"
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
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
                </Box>

                {/* Pertanyaan Gejala */}
                <Box w="100%">
                  <Heading size="md" color="purple.700" mb={4}>
                    Pertanyaan Gejala Kesehatan
                  </Heading>

                  {/* 24 Pertanyaan Pilihan Ganda Ya/Tidak */}
                  {renderQuestion(
                    "1. Apakah Anda sering mengalami infeksi berulang seperti sariawan, batuk lama, atau diare yang tidak sembuh-sembuh?",
                    "hiv1",
                    formData.hiv1
                  )}
                  
                  {renderQuestion(
                    "2. Apakah berat badan Anda menurun tanpa sebab yang jelas dalam waktu singkat?",
                    "hiv2",
                    formData.hiv2
                  )}
                  
                  {renderQuestion(
                    "3. Apakah Anda sering merasa sangat lemah atau cepat lelah tanpa aktivitas berat?",
                    "hiv3",
                    formData.hiv3
                  )}

                  {renderQuestion(
                    "4. Apakah Anda sering merasa sesak napas saat beraktivitas ringan atau saat berbaring?",
                    "jantung1",
                    formData.jantung1
                  )}
                  
                  {renderQuestion(
                    "5. Apakah kaki atau pergelangan kaki Anda sering bengkak tanpa sebab yang jelas?",
                    "jantung2",
                    formData.jantung2
                  )}
                  
                  {renderQuestion(
                    "6. Apakah Anda cepat lelah meskipun hanya melakukan kegiatan ringan?",
                    "jantung3",
                    formData.jantung3
                  )}

                  {renderQuestion(
                    "7. Apakah Anda sering batuk setiap hari dalam waktu lama (lebih dari beberapa bulan)?",
                    "paru1",
                    formData.paru1
                  )}
                  
                  {renderQuestion(
                    "8. Apakah Anda sering merasa sesak napas, terutama saat berjalan atau menaiki tangga?",
                    "paru2",
                    formData.paru2
                  )}
                  
                  {renderQuestion(
                    "9. Apakah Anda perokok aktif atau pernah merokok dalam waktu lama?",
                    "paru3",
                    formData.paru3
                  )}

                  {renderQuestion(
                    "10. Apakah Anda memiliki benjolan di tubuh yang tidak hilang dalam waktu lama?",
                    "kanker1",
                    formData.kanker1
                  )}
                  
                  {renderQuestion(
                    "11. Apakah berat badan Anda menurun tanpa alasan yang jelas?",
                    "kanker2",
                    formData.kanker2
                  )}
                  
                  {renderQuestion(
                    "12. Apakah Anda sering merasa lemah atau cepat lelah tanpa aktivitas berat?",
                    "kanker3",
                    formData.kanker3
                  )}

                  {renderQuestion(
                    "13. Apakah Anda sering lupa terhadap hal-hal yang baru saja terjadi?",
                    "demensia1",
                    formData.demensia1
                  )}
                  
                  {renderQuestion(
                    "14. Apakah Anda sering merasa bingung dengan waktu, tempat, atau orang di sekitar Anda?",
                    "demensia2",
                    formData.demensia2
                  )}
                  
                  {renderQuestion(
                    "15. Apakah Anda sering kesulitan melakukan kegiatan sehari-hari yang dulu mudah dilakukan?",
                    "demensia3",
                    formData.demensia3
                  )}

                  {renderQuestion(
                    "16. Apakah Anda mengalami batuk terus-menerus selama lebih dari 3 minggu?",
                    "tbc1",
                    formData.tbc1
                  )}
                  
                  {renderQuestion(
                    "17. Apakah Anda pernah mengeluarkan dahak bercampur darah?",
                    "tbc2",
                    formData.tbc2
                  )}
                  
                  {renderQuestion(
                    "18. Apakah berat badan Anda menurun dan sering berkeringat malam hari?",
                    "tbc3",
                    formData.tbc3
                  )}

                  {renderQuestion(
                    "19. Apakah Anda sering merasa lemas, mual, atau tidak nafsu makan dalam waktu lama?",
                    "ginjal1",
                    formData.ginjal1
                  )}
                  
                  {renderQuestion(
                    "20. Apakah frekuensi buang air kecil Anda menurun atau jumlah urine menjadi sangat sedikit?",
                    "ginjal2",
                    formData.ginjal2
                  )}
                  
                  {renderQuestion(
                    "21. Apakah kaki atau wajah Anda sering bengkak tanpa sebab yang jelas?",
                    "ginjal3",
                    formData.ginjal3
                  )}

                  {renderQuestion(
                    "22. Apakah Anda pernah tiba-tiba merasa lemas di salah satu sisi tubuh (misalnya tangan atau wajah)?",
                    "stroke1",
                    formData.stroke1
                  )}
                  
                  {renderQuestion(
                    "23. Apakah Anda pernah sulit bicara atau mengucapkan kata dengan jelas secara tiba-tiba?",
                    "stroke2",
                    formData.stroke2
                  )}
                  
                  {renderQuestion(
                    "24. Apakah penglihatan Anda pernah tiba-tiba kabur atau hilang sebelah?",
                    "stroke3",
                    formData.stroke3
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
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                  _active={{
                    transform: "translateY(0)"
                  }}
                  height="60px"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Lihat Hasil Analisis
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}