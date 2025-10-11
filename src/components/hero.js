"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Circle,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/form'); // Navigasi ke halaman form
  };

  return (
    <Box
      position="relative"
      w="100vw"
      h="100vh"
      overflow="hidden"
      bgGradient="linear(to-r, white 40%, purple.100 100%)"
    >
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="100%"
        h="220px"
        backgroundImage="url('/images/wave.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="bottom"
        zIndex={10}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 1
        }}
      />

      <Circle
        size="200px"
        bg="purple.200"
        opacity="0.25"
        position="absolute"
        top="15%"
        right="15%"
        zIndex={0}
      />
      <Circle
        size="100px"
        bg="purple.300"
        opacity="0.2"
        position="absolute"
        bottom="20%"
        right="30%"
        zIndex={0}
      />

      <Flex
        direction="row"
        align="center"
        justify="space-between"
        h="100%"
        w="100%"
        maxW="1920px"
        mx="auto"
        px={{ base: 6, md: 20 }}
        position="relative"
        zIndex={2}
      >
        <Box flex="1" pr={{ md: 10 }} zIndex={2}>
          <Heading
            as="h1"
            size="2xl"
            mb={3}
            color="purple.800"
            fontWeight="extrabold"
          >
            Ayo Periksakan
          </Heading>
          <Heading
            as="h2"
            size="xl"
            mb={5}
            color="purple.500"
            fontWeight="extrabold"
          >
            Tentang Keadaan Kesehatanmu
          </Heading>
          <Text color="gray.600" maxW="450px" mb={6}>
            Klik mulai untuk mengetahui bagaimana kondisi Kesehatanmu
          </Text>
          
          <Button
            size="lg"
            borderRadius="full"
            px={8}
            bgGradient="linear(to-r, purple.500, pink.500)"
            color="white"
            _hover={{
              transform: "scale(1.05)",
              bgGradient: "linear(to-r, purple.600, pink.600)",
              boxShadow: "lg"
            }}
            onClick={handleGetStarted}
          >
            Mulai
          </Button>
        </Box>

        <Box
          w={{ base: "10%", md: "60vw" }}
          h="100vh"
          position="relative"
          left={60}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/images/Balc.svg"
            alt="Website illustration"
            w="100%"
            h="100%"
            objectFit="cover"
            draggable="false"
          />
        </Box>
      </Flex>
    </Box>
  );
}