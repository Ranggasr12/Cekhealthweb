"use client";

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Card, 
  CardBody,
  Button,
  Progress,
  Alert,
  AlertIcon,
  HStack,
  Badge
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HasilPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const skor = parseInt(searchParams.get('skor')) || 0;
  const totalPertanyaan = parseInt(searchParams.get('total')) || 0;
  const nama = searchParams.get('nama') || 'Pengguna';

  let kategori = "";
  let saran = "";
  let statusColor = "";
  let progressColor = "";

  if (skor <= 3) {
    kategori = "Sehat ✅";
    saran = "Pertahankan pola hidup sehat dan tetap aktif! Lanjutkan kebiasaan baik Anda.";
    statusColor = "green";
    progressColor = "green";
  } else if (skor <= 7) {
    kategori = "Rentan ⚠️";
    saran = "Mulai perbaiki pola makan dan tidur, serta kurangi stres. Perbanyak aktivitas fisik dan konsumsi makanan bergizi.";
    statusColor = "orange";
    progressColor = "orange";
  } else {
    kategori = "Berisiko Tinggi ❗";
    saran = "Segera konsultasi dengan tenaga medis atau ahli kesehatan. Lakukan pemeriksaan lebih lanjut untuk evaluasi kondisi kesehatan.";
    statusColor = "red";
    progressColor = "red";
  }

  const percentage = totalPertanyaan > 0 ? (skor / (totalPertanyaan * 3)) * 100 : 0;

  const handleBackToForm = () => {
    router.push('/form');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={3} color="purple.600">
            🩺 Hasil Skrining Kesehatan
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Berdasarkan jawaban yang Anda berikan
          </Text>
        </Box>

        {/* User Info */}
        <Card>
          <CardBody>
            <VStack spacing={3} align="start">
              <Text><strong>Nama:</strong> {nama}</Text>
              <Text><strong>Total Pertanyaan:</strong> {totalPertanyaan}</Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Results Card */}
        <Card border="2px" borderColor={`${statusColor}.200`}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Score and Status */}
              <Box textAlign="center">
                <Heading size="lg" mb={2}>
                  Skor: <Text as="span" color={`${statusColor}.600`}>{skor}</Text>
                </Heading>
                <Badge 
                  colorScheme={statusColor} 
                  fontSize="lg" 
                  px={4} 
                  py={2}
                  borderRadius="full"
                >
                  {kategori}
                </Badge>
              </Box>

              {/* Progress Bar */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">Tingkat Risiko</Text>
                  <Text fontSize="sm" color="gray.600">{percentage.toFixed(1)}%</Text>
                </HStack>
                <Progress 
                  value={percentage} 
                  colorScheme={progressColor}
                  size="lg"
                  borderRadius="full"
                />
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.500">Rendah</Text>
                  <Text fontSize="xs" color="gray.500">Tinggi</Text>
                </HStack>
              </Box>

              {/* Saran */}
              <Box>
                <Heading size="md" mb={3} color="gray.700">
                  💡 Rekomendasi
                </Heading>
                <Text color="gray.600" lineHeight="1.6">
                  {saran}
                </Text>
              </Box>

              {/* Alert Based on Result */}
              <Alert status={statusColor === 'red' ? 'error' : statusColor === 'orange' ? 'warning' : 'success'} borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">
                    {statusColor === 'red' 
                      ? "Perhatian Khusus Diperlukan" 
                      : statusColor === 'orange'
                      ? "Perbaikan Gaya Hidup Disarankan"
                      : "Kondisi Kesehatan Baik"}
                  </Text>
                  <Text fontSize="sm">
                    {statusColor === 'red'
                      ? "Disarankan untuk berkonsultasi dengan dokter dalam waktu dekat."
                      : statusColor === 'orange'
                      ? "Monitor kesehatan secara berkala dan terapkan pola hidup sehat."
                      : "Tetap jaga kesehatan dengan pemeriksaan rutin."}
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <HStack spacing={4} justify="center">
          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleBackToForm}
          >
            ⚕️ Cek Kesehatan Lagi
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleBackToHome}
          >
            🏠 Kembali ke Home
          </Button>
        </HStack>

        {/* Disclaimer */}
        <Box p={4} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.700" textAlign="center">
            <strong>Disclaimer:</strong> Hasil ini merupakan skrining awal berdasarkan gejala yang dilaporkan. 
            Tidak menggantikan konsultasi dengan tenaga medis profesional. 
            Untuk diagnosis yang akurat, disarankan berkonsultasi dengan dokter.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}