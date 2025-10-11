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
  CardHeader,
  Divider,
  Icon,
  Flex,
} from "@chakra-ui/react";

const HeartIcon = (props) => (
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
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
  </svg>
);

const TeamIcon = (props) => (
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
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
  </svg>
);

const GoalIcon = (props) => (
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
  </svg>
);

const MentorIcon = (props) => (
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
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </svg>
);

export default function AboutPage() {
  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          
          <Box textAlign="center">
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4} color="purple.800">
              Tentang Kami
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="3xl" mx="auto">
              Dedikasi untuk Perawatan Paliatif yang Bermakna
            </Text>
          </Box>

          <Card borderRadius="xl" boxShadow="lg" border="2px" borderColor="purple.100">
            <CardBody p={{ base: 4, md: 8 }}>
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Icon as={TeamIcon} w={{ base: 6, md: 8 }} h={{ base: 6, md: 8 }} color="purple.500" />
                  <Heading size={{ base: "md", md: "lg" }} color="purple.700">
                    Siapa Kami
                  </Heading>
                </HStack>
                
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.700" lineHeight="1.8">
                  <Text as="span" fontWeight="bold" color="purple.600">
                    Website ini dikembangkan oleh 49 mahasiswa Program Studi Keperawatan
                  </Text> sebagai bentuk kepedulian kami terhadap pasien dengan penyakit yang membutuhkan perawatan paliatif.
                </Text>
                
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.700" lineHeight="1.8">
                  Kami percaya bahwa <Text as="span" fontWeight="bold" color="purple.600">setiap individu berhak mendapatkan kualitas hidup terbaik</Text>, bahkan di tengah kondisi penyakit yang sulit disembuhkan.
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="xl" boxShadow="lg">
            <CardHeader bg="purple.50" borderTopRadius="xl">
              <HStack spacing={4}>
                <Icon as={GoalIcon} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} color="purple.500" />
                <Heading size={{ base: "md", md: "lg" }} color="purple.700">
                  Tujuan Pembuatan Web Skrining
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={{ base: 4, md: 8 }}>
              <VStack spacing={6} align="start">
                <HStack spacing={4} align="start">
                  <Box
                    w={6}
                    h={6}
                    borderRadius="full"
                    bg="purple.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                      1
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="purple.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                      Deteksi Dini Gejala
                    </Text>
                    <Text color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                      Membantu masyarakat mengenali gejala-gejala awal yang mungkin memerlukan pendekatan paliatif.
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4} align="start">
                  <Box
                    w={6}
                    h={6}
                    borderRadius="full"
                    bg="purple.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                      2
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="purple.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                      Dukungan Holistik
                    </Text>
                    <Text color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                      Memberikan informasi dan dukungan mengenai aspek fisik, psikologis, sosial, dan spiritual pasien.
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4} align="start">
                  <Box
                    w={6}
                    h={6}
                    borderRadius="full"
                    bg="purple.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                      3
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="purple.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                      Edukasi dan Refleksi
                    </Text>
                    <Text color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                      Menjadi sarana edukasi dan refleksi bagi tenaga kesehatan serta masyarakat tentang pentingnya perawatan holistik di akhir kehidupan.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="xl" boxShadow="lg" border="2px" borderColor="green.100">
            <CardBody p={{ base: 4, md: 8 }}>
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Icon as={MentorIcon} w={{ base: 6, md: 8 }} h={{ base: 6, md: 8 }} color="green.500" />
                  <Heading size={{ base: "md", md: "lg" }} color="green.700">
                    Bimbingan dan Konsultasi
                  </Heading>
                </HStack>
                
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.700" lineHeight="1.8">
                  <Text as="span" fontWeight="bold" color="green.600">
                    Proyek ini dilaksanakan di bawah bimbingan dan konsultasi dari Ibu Sulastri, M.Kep., Sp.Jiwa.
                  </Text> yang dengan penuh dedikasi membimbing kami dalam memahami dan mengimplementasikan konsep keperawatan paliatif secara komprehensif dan manusiawi.
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="xl" boxShadow="lg" bgGradient="linear(to-r, purple.50, pink.50)">
            <CardBody p={{ base: 4, md: 8 }}>
              <VStack spacing={4} textAlign="center">
                <Icon as={HeartIcon} w={{ base: 8, md: 12 }} h={{ base: 8, md: 12 }} color="purple.500" />
                
                <Heading size={{ base: "md", md: "lg" }} color="purple.800">
                  Komitmen Kami
                </Heading>
                
                <Text fontSize={{ base: "lg", md: "xl" }} color="purple.700" fontWeight="medium" maxW="2xl">
                  Melalui kerja sama, semangat belajar, dan empati, kami berkomitmen menghadirkan inovasi kecil yang membawa makna besar bagi pelayanan keperawatan.
                </Text>

                <Divider borderColor="purple.200" my={4} />

                <Flex wrap="wrap" justify="center" gap={6} mt={4}>
                  <Box textAlign="center">
                    <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="purple.600">
                      49
                    </Text>
                    <Text color="purple.700" fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                      Mahasiswa
                    </Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="purple.600">
                      1
                    </Text>
                    <Text color="purple.700" fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                      Tujuan Mulia
                    </Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="purple.600">
                      ∞
                    </Text>
                    <Text color="purple.700" fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                      Empati
                    </Text>
                  </Box>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="xl" boxShadow="md">
            <CardBody p={6}>
              <VStack spacing={2} textAlign="center">
                <Text color="gray.600" fontSize="sm">
                  Program Studi Keperawatan
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Inovasi untuk Kemanusiaan dan Pelayanan Kesehatan
                </Text>
              </VStack>
            </CardBody>
          </Card>

        </VStack>
      </Container>
    </Box>
  );
}