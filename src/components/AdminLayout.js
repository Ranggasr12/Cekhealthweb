"use client";

import { 
  Box, 
  VStack, 
  HStack, 
  Link, 
  Text, 
  Button,
  useColorModeValue,
  Icon,
  Flex,
  Divider
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  FiHome, 
  FiFileText, 
  FiHelpCircle, 
  FiVideo, 
  FiSettings, 
  FiLogOut,
  FiUser,
  FiArrowLeft
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('purple.50', 'purple.900');

  const menuItems = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: FiHome,
      description: 'Overview'
    },
    { 
      href: '/admin/makalah', 
      label: 'Kelola Makalah', 
      icon: FiFileText,
      description: 'Dokumen kesehatan'
    },
    { 
      href: '/admin/pertanyaan', 
      label: 'Kelola Pertanyaan', 
      icon: FiHelpCircle,
      description: 'Kuesioner kesehatan'
    },
    { 
      href: '/admin/videos', 
      label: 'Kelola Video', 
      icon: FiVideo,
      description: 'Konten edukasi'
    },
    { 
      href: '/admin/settings', 
      label: 'Settings', 
      icon: FiSettings,
      description: 'Pengaturan sistem'
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        w="280px"
        h="100vh"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        p={6}
        boxShadow="sm"
      >
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="purple.600" mb={1}>
              Admin Panel
            </Text>
            <Text fontSize="sm" color="gray.500">
              HealthCheck Management
            </Text>
          </Box>

          {/* Navigation Menu */}
          <VStack align="stretch" spacing={2}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  display="block"
                  p={3}
                  borderRadius="lg"
                  bg={isActive(item.href) ? 'purple.50' : 'transparent'}
                  color={isActive(item.href) ? 'purple.600' : 'gray.700'}
                  fontWeight={isActive(item.href) ? 'bold' : 'medium'}
                  border={isActive(item.href) ? '1px solid' : '1px solid transparent'}
                  borderColor={isActive(item.href) ? 'purple.200' : 'transparent'}
                  _hover={{
                    bg: hoverBg,
                    textDecoration: 'none',
                    color: 'purple.600',
                    transform: 'translateX(4px)'
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={3}>
                    <Icon as={IconComponent} boxSize={5} />
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="inherit">
                        {item.label}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={0.5}>
                        {item.description}
                      </Text>
                    </Box>
                    {isActive(item.href) && (
                      <Box
                        w="4px"
                        h="20px"
                        bgGradient="linear(to-b, purple.500, pink.500)"
                        borderRadius="full"
                      />
                    )}
                  </HStack>
                </Link>
              );
            })}
          </VStack>

          <Divider />

          {/* User Actions */}
          <VStack align="stretch" spacing={3}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Icon as={FiArrowLeft} />}
              onClick={() => router.push('/')}
              _hover={{ bg: 'gray.100' }}
            >
              Kembali ke Site
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Icon as={FiUser} />}
              onClick={() => router.push('/profile')}
              _hover={{ bg: 'gray.100' }}
            >
              Profil Saya
            </Button>

            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FiLogOut} />}
              onClick={handleLogout}
              _hover={{ bg: 'red.50' }}
            >
              Logout
            </Button>
          </VStack>

          {/* Footer Info */}
          <Box pt={4} borderTop="1px" borderColor={borderColor}>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              HealthCheck Admin v1.0
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Main Content Area */}
      <Box ml="280px" minH="100vh">
        {children}
      </Box>
    </Box>
  );
}