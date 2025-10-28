// components/AdminLayout.js
import { 
  Box, 
  VStack, 
  HStack, 
  Link, 
  Text, 
  Button,
  useColorModeValue 
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/makalah', label: 'Kelola Makalah' },
    { href: '/admin/pertanyaan', label: 'Kelola Pertanyaan' },
    { href: '/admin/videos', label: 'Kelola Video' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        w="250px"
        h="100vh"
        bg="white"
        borderRight="1px"
        borderColor={borderColor}
        p={4}
      >
        <VStack align="stretch" spacing={6}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="purple.600">
              Admin Panel
            </Text>
            <Text fontSize="sm" color="gray.500">
              HealthCheck App
            </Text>
          </Box>

          <VStack align="stretch" spacing={2}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                p={3}
                borderRadius="md"
                bg={router.pathname === item.href ? 'purple.50' : 'transparent'}
                color={router.pathname === item.href ? 'purple.600' : 'gray.700'}
                fontWeight={router.pathname === item.href ? 'bold' : 'normal'}
                _hover={{
                  bg: 'purple.50',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
          </VStack>

          <Box pt={4} borderTop="1px" borderColor={borderColor}>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              width="full"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              size="sm"
              variant="ghost"
              width="full"
              mt={2}
              onClick={() => router.push('/')}
            >
              Kembali ke Site
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml="250px" p={8}>
        {children}
      </Box>
    </Box>
  );
}