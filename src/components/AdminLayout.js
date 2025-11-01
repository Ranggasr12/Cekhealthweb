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
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Avatar,
  SkeletonCircle,
  SkeletonText
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { 
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  FiHome, 
  FiHelpCircle, 
  FiVideo, 
  FiSettings, 
  FiLogOut,
  FiUser,
  FiArrowLeft,
  FiBarChart2,
  FiMenu
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('purple.50', 'purple.900');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    setMounted(true);
    
    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        // Load user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          } else {
            // Default profile jika belum ada
            setProfile({
              full_name: user.displayName || user.email.split('@')[0],
              email: user.email,
              role: 'admin'
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          setProfile({
            full_name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: 'admin'
          });
        }
      } else {
        setUser(null);
        setProfile(null);
        // Redirect to login if not authenticated
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const menuItems = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: FiBarChart2,
      description: 'Overview sistem'
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
      label: 'Pengaturan', 
      icon: FiSettings,
      description: 'Pengaturan sistem'
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href) => mounted && pathname === href;

  const UserProfileSection = () => {
    if (loading) {
      return (
        <HStack spacing={3} p={2} borderRadius="md" bg="gray.50">
          <SkeletonCircle size="8" />
          <Box flex="1">
            <SkeletonText noOfLines={2} spacing="1" />
          </Box>
        </HStack>
      );
    }

    if (!user) {
      return (
        <Button
          size="sm"
          colorScheme="purple"
          variant="outline"
          leftIcon={<Icon as={FiUser} />}
          onClick={() => router.push('/login')}
          w="full"
        >
          Login
        </Button>
      );
    }

    return (
      <HStack 
        spacing={3} 
        p={2} 
        borderRadius="md" 
        bg="purple.50"
        border="1px"
        borderColor="purple.200"
        cursor="pointer"
        onClick={() => router.push('/profile')}
        _hover={{
          bg: 'purple.100',
          transform: 'translateY(-1px)',
          shadow: 'sm'
        }}
        transition="all 0.2s"
      >
        <Avatar
          size="sm"
          name={profile?.full_name || user.email}
          src={profile?.photoURL || ''}
          bg="purple.500"
          color="white"
          border="2px solid"
          borderColor="purple.300"
        />
        <Box flex="1" minW="0">
          <Text 
            fontSize="sm" 
            fontWeight="semibold" 
            color="purple.700"
            noOfLines={1}
          >
            {profile?.full_name || user.displayName || user.email}
          </Text>
          <Text 
            fontSize="xs" 
            color="purple.600"
            noOfLines={1}
          >
            {user.email}
          </Text>
        </Box>
        <Icon as={FiUser} color="purple.500" boxSize={3} />
      </HStack>
    );
  };

  const SidebarContent = ({ onClose: closeDrawer }) => (
    <VStack align="stretch" spacing={6}>
      {/* Header */}
      <Box textAlign="center" pb={3} borderBottom="1px" borderColor={borderColor}>
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          bgGradient="linear(to-r, purple.600, pink.500)"
          bgClip="text"
          mb={1}
        >
          Admin Panel
        </Text>
        <Text fontSize="xs" color="gray.500">
          HealthCheck Management
        </Text>
      </Box>

      {/* User Profile Section */}
      <UserProfileSection />

      {/* Navigation Menu */}
      <VStack align="stretch" spacing={1}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              display="block"
              p={2}
              borderRadius="md"
              bg={isActive(item.href) ? 'purple.50' : 'transparent'}
              color={isActive(item.href) ? 'purple.600' : 'gray.700'}
              fontWeight={isActive(item.href) ? 'semibold' : 'medium'}
              border={isActive(item.href) ? '1px solid' : '1px solid transparent'}
              borderColor={isActive(item.href) ? 'purple.200' : 'transparent'}
              _hover={{
                bg: hoverBg,
                textDecoration: 'none',
                color: 'purple.600',
                transform: 'translateX(2px)',
                boxShadow: 'sm'
              }}
              transition="all 0.2s ease-in-out"
              onClick={closeDrawer}
            >
              <HStack spacing={2}>
                <Icon as={IconComponent} boxSize={4} />
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
                    w="2px"
                    h="4"
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
      <VStack align="stretch" spacing={2}>
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Icon as={FiArrowLeft} />}
          onClick={() => {
            router.push('/');
            if (closeDrawer) closeDrawer();
          }}
          _hover={{ bg: 'gray.50' }}
          transition="all 0.2s"
        >
          Kembali ke Site
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Icon as={FiUser} />}
          onClick={() => {
            router.push('/profile');
            if (closeDrawer) closeDrawer();
          }}
          _hover={{ bg: 'blue.50' }}
          transition="all 0.2s"
        >
          Kelola Profil
        </Button>

        <Button
          size="xs"
          colorScheme="red"
          variant="outline"
          leftIcon={<Icon as={FiLogOut} />}
          onClick={() => {
            handleLogout();
            if (closeDrawer) closeDrawer();
          }}
          _hover={{ bg: 'red.50' }}
          transition="all 0.2s"
        >
          Keluar
        </Button>
      </VStack>

      {/* Footer Info */}
      <Box pt={2} borderTop="1px" borderColor={borderColor}>
        <Text fontSize="2xs" color="gray.500" textAlign="center">
          HealthCheck v1.0
        </Text>
      </Box>
    </VStack>
  );

  // Render sederhana selama SSR
  if (!mounted) {
    return (
      <Box minH="100vh" bg={mainBg}>
        <Box ml={{ base: 0, md: "220px" }} minH="100vh">
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={mainBg} suppressHydrationWarning>
      {/* Mobile Menu Button */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        top={3}
        left={3}
        zIndex={1100}
      >
        <Button
          onClick={onOpen}
          colorScheme="purple"
          size="sm"
          leftIcon={<Icon as={FiMenu} />}
          shadow="md"
        >
          Menu
        </Button>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        w={{ base: "100%", md: "220px" }}
        h="100vh"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        p={4}
        boxShadow="md"
        zIndex={1000}
        display={{ base: "none", md: "block" }}
        overflowY="auto"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg} maxW="260px">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={2}>
            <Text 
              fontSize="lg" 
              fontWeight="bold" 
              bgGradient="linear(to-r, purple.600, pink.500)"
              bgClip="text"
            >
              Admin Panel
            </Text>
          </DrawerHeader>
          <DrawerBody py={3}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        ml={{ base: 0, md: "220px" }}
        minH="100vh"
        w={{ base: "100%", md: "calc(100% - 220px)" }}
        px={{ base: 3, md: 6 }}
        py={4}
        pt={{ base: 12, md: 4 }}
      >
        {children}
      </Box>
    </Box>
  );
}