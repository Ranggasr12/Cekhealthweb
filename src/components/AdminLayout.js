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
  SkeletonText,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { getProfile, getSession, authSignOut } from '@/lib/supabase';
import { 
  FiHome, 
  FiHelpCircle, 
  FiVideo, 
  FiSettings, 
  FiLogOut,
  FiUser,
  FiArrowLeft,
  FiBarChart2,
  FiMenu,
  FiEdit,
  FiChevronDown
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
  const toast = useToast();
  
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('purple.50', 'purple.900');
  const mainBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    setMounted(true);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }

      setUser(session?.user);

      if (session?.user) {
        const { data: profileData, error: profileError } = await getProfile(session.user.id);
        
        if (profileError) {
          console.error('Profile error:', profileError);
          return;
        }

        if (profileData) {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const { error } = await authSignOut();
      if (error) throw error;
      
      toast({
        title: 'Berhasil logout',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Gagal logout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isActive = (href) => mounted && pathname === href;

  // Komponen User Menu untuk pojok kanan atas - FIXED untuk hydration
  const UserMenu = () => {
    if (!mounted || loading) {
      return (
        <HStack spacing={3}>
          <SkeletonCircle size="8" />
          <SkeletonText noOfLines={1} width="100px" />
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
        >
          Login
        </Button>
      );
    }

    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={FiChevronDown} />}
          variant="ghost"
          px={3}
          py={2}
          _hover={{ bg: 'gray.100' }}
          _expanded={{ bg: 'gray.100' }}
        >
          <HStack spacing={2}>
            <Avatar
              size="sm"
              name={displayName}
              src={profile?.avatar_url || ''}
              bg="purple.500"
              color="white"
              border="2px solid"
              borderColor="purple.300"
            />
            <Box display={{ base: "none", md: "block" }}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {displayName}
              </Text>
            </Box>
          </HStack>
        </MenuButton>
        <MenuList>
          <Box px={3} py={2}>
            <Text fontSize="sm" fontWeight="medium">
              {displayName}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {user.email}
            </Text>
          </Box>
          <MenuDivider />
          <MenuItem 
            icon={<Icon as={FiUser} />}
            onClick={() => router.push('/profile')}
          >
            Your profile
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            icon={<Icon as={FiLogOut} />}
            onClick={handleLogout}
            color="red.500"
          >
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };

  // Komponen Header untuk pojok kanan atas - FIXED untuk hydration
  const AdminHeader = () => {
    const getPageTitle = (path) => {
      const titles = {
        '/admin/dashboard': 'Dashboard',
        '/admin/pertanyaan': 'Kelola Pertanyaan',
        '/admin/videos': 'Kelola Video',
        '/admin/settings': 'Pengaturan'
      };
      return titles[path] || 'Admin Panel';
    };

    // Date formatting yang konsisten antara server dan client
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
      if (mounted) {
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
        setCurrentTime(now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    }, [mounted]);

    return (
      <Box
        position="fixed"
        top={0}
        right={0}
        left={{ base: 0, md: "280px" }}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        px={{ base: 4, md: 8 }}
        py={4}
        zIndex={900}
        shadow="sm"
      >
        <Flex justify="space-between" align="center">
          {/* Page Title */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              {getPageTitle(pathname)}
            </Text>
            <Text fontSize="sm" color="gray.600">
              HealthCheck Admin Panel
            </Text>
          </Box>

          {/* User Menu di pojok kanan */}
          <HStack spacing={4}>
            {/* Info Tanggal - FIXED untuk hydration */}
            {mounted && (
              <Box 
                display={{ base: "none", md: "block" }}
                textAlign="right"
              >
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {currentDate}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {currentTime}
                </Text>
              </Box>
            )}

            {/* User Menu dengan gambar profil */}
            <UserMenu />
          </HStack>
        </Flex>
      </Box>
    );
  };

  const UserProfileSection = () => {
    if (!mounted || loading) {
      return (
        <HStack spacing={3} p={3} borderRadius="md" bg="gray.50">
          <SkeletonCircle size="10" />
          <Box flex="1">
            <SkeletonText noOfLines={2} spacing="2" />
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

    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const displayEmail = user.email;

    return (
      <VStack 
        spacing={3} 
        p={3} 
        borderRadius="lg" 
        bg="purple.50"
        border="1px"
        borderColor="purple.200"
        cursor="pointer"
        onClick={() => router.push('/profile')}
        _hover={{
          bg: 'purple.100',
          transform: 'translateY(-2px)',
          shadow: 'md'
        }}
        transition="all 0.3s ease"
      >
        <HStack spacing={3} w="full">
          <Box position="relative">
            <Avatar
              size="md"
              name={displayName}
              src={profile?.avatar_url || ''}
              bg="purple.500"
              color="white"
              border="3px solid"
              borderColor="purple.300"
              shadow="sm"
            />
            <Box
              position="absolute"
              bottom={0}
              right={0}
              w="3"
              h="3"
              bg="green.400"
              borderRadius="full"
              border="2px solid white"
            />
          </Box>
          
          <Box flex="1" minW="0">
            <Text 
              fontSize="sm" 
              fontWeight="bold" 
              color="purple.700"
              noOfLines={1}
            >
              {displayName}
            </Text>
            <Text 
              fontSize="xs" 
              color="purple.600"
              noOfLines={1}
            >
              {displayEmail}
            </Text>
            {profile?.username && (
              <Text 
                fontSize="2xs" 
                color="purple.500"
                noOfLines={1}
                mt={0.5}
              >
                @{profile.username}
              </Text>
            )}
          </Box>
          
          <Icon as={FiEdit} color="purple.500" boxSize={4} />
        </HStack>
        
        <Button
          size="xs"
          colorScheme="purple"
          variant="ghost"
          w="full"
          onClick={(e) => {
            e.stopPropagation();
            router.push('/profile');
          }}
        >
          Kelola Profil
        </Button>
      </VStack>
    );
  };

  const SidebarContent = ({ onClose: closeDrawer }) => (
    <VStack align="stretch" spacing={6} h="full">
      {/* Header */}
      <Box textAlign="center" pb={4} borderBottom="1px" borderColor={borderColor}>
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
      <VStack align="stretch" spacing={1} flex="1">
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
              fontWeight={isActive(item.href) ? 'semibold' : 'medium'}
              border={isActive(item.href) ? '1px solid' : '1px solid transparent'}
              borderColor={isActive(item.href) ? 'purple.200' : 'transparent'}
              _hover={{
                bg: hoverBg,
                textDecoration: 'none',
                color: 'purple.600',
                transform: 'translateX(4px)',
                shadow: 'md'
              }}
              transition="all 0.3s ease-in-out"
              onClick={closeDrawer}
            >
              <HStack spacing={3}>
                <Icon 
                  as={IconComponent} 
                  boxSize={5} 
                  color={isActive(item.href) ? 'purple.500' : 'gray.500'}
                />
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
                    h="6"
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
          size="sm"
          variant="outline"
          leftIcon={<Icon as={FiArrowLeft} />}
          onClick={() => {
            router.push('/');
            if (closeDrawer) closeDrawer();
          }}
          _hover={{ 
            bg: 'gray.50',
            transform: 'translateY(-1px)'
          }}
          transition="all 0.2s"
        >
          Kembali ke Site
        </Button>

        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          leftIcon={<Icon as={FiLogOut} />}
          onClick={() => {
            handleLogout();
            if (closeDrawer) closeDrawer();
          }}
          _hover={{ 
            bg: 'red.50',
            transform: 'translateY(-1px)'
          }}
          transition="all 0.2s"
        >
          Keluar
        </Button>
      </VStack>

      {/* Footer Info */}
      <Box pt={3} borderTop="1px" borderColor={borderColor}>
        <Text fontSize="2xs" color="gray.500" textAlign="center">
          HealthCheck v1.0 • Admin System
        </Text>
        <Text fontSize="2xs" color="gray.400" textAlign="center" mt={1}>
          {mounted && user ? `Logged in as ${user.email}` : 'Not logged in'}
        </Text>
      </Box>
    </VStack>
  );

  // Render sederhana selama SSR - tanpa data dinamis
  if (!mounted) {
    return (
      <Box minH="100vh" bg={mainBg}>
        <Box ml={{ base: 0, md: "280px" }} minH="100vh">
          <Box 
            ml={{ base: 0, md: "280px" }}
            minH="100vh"
            w={{ base: "100%", md: "calc(100% - 280px)" }}
            px={{ base: 4, md: 8 }}
            py={{ base: 6, md: 8 }}
            pt={{ base: 24, md: 24 }}
          >
            {children}
          </Box>
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
        top={4}
        left={4}
        zIndex={1100}
      >
        <Button
          onClick={onOpen}
          colorScheme="purple"
          size="md"
          leftIcon={<Icon as={FiMenu} />}
          shadow="lg"
          borderRadius="full"
          _hover={{
            transform: 'scale(1.05)',
            shadow: 'xl'
          }}
          transition="all 0.2s"
        >
          Menu
        </Button>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        w={{ base: "100%", md: "280px" }}
        h="100vh"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        p={6}
        boxShadow="xl"
        zIndex={1000}
        display={{ base: "none", md: "block" }}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'purple.200',
            borderRadius: '24px',
          },
        }}
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
        <DrawerContent bg={sidebarBg} maxW="320px">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={4}>
            <VStack spacing={1}>
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                bgGradient="linear(to-r, purple.600, pink.500)"
                bgClip="text"
              >
                Admin Panel
              </Text>
              <Text fontSize="xs" color="gray.500">
                HealthCheck Management
              </Text>
            </VStack>
          </DrawerHeader>
          <DrawerBody py={4}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* HEADER BARU DI POJOK KANAN ATAS */}
      <AdminHeader />

      {/* Main Content Area - Diberi padding atas untuk header */}
      <Box 
        ml={{ base: 0, md: "280px" }}
        minH="100vh"
        w={{ base: "100%", md: "calc(100% - 280px)" }}
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 8 }}
        pt={{ base: 24, md: 24 }}
      >
        {children}
      </Box>
    </Box>
  );
}