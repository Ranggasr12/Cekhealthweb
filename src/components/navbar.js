"use client";

import {
  Flex,
  Image,
  HStack,
  Link,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  useDisclosure,
  Spinner,
  Box,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  useToast
} from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/video-gallery", label: "Video" },
    { href: "/form", label: "Cek Kesehatan" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => pathname === href;

  useEffect(() => {
    loadUserData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event);
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in:', session.user.email);
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          console.log('🔒 User signed out');
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('🔄 Loading user data...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Session error:", error);
        return;
      }

      // Check if we're in mock mode
      const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-url');
      setIsMockMode(isMock);
      
      if (session?.user) {
        setUser(session.user);
        console.log("✅ User session found:", session.user.email);

        // Try to get user profile from database
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          console.log("📊 Profile query result:", { 
            hasProfile: !!profile, 
            profileError: profileError?.message,
            userId: session.user.id 
          });

          if (!profileError && profile) {
            // Role dari database
            setRole(profile.role);
            console.log("🎯 Role from database:", profile.role);
            
            if (profile.role === 'admin') {
              console.log("🚀 ADMIN ACCESS - Button will appear!");
            }
          } else {
            // Jika profile tidak ditemukan, buat otomatis
            console.log("🔄 Profile not found, creating automatically...");
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                role: 'user',
                full_name: session.user.email.split('@')[0]
              });

            if (!insertError) {
              console.log("✅ Auto-created profile");
              setRole('user');
            } else {
              console.error("❌ Failed to create profile:", insertError);
              setRole('user');
            }
          }

          // 🚨 EMERGENCY OVERRIDE: Auto-admin untuk email tertentu
          const adminEmails = ['admin@cekhealth.com', 'test@example.com', 'rangga@example.com'];
          if (adminEmails.includes(session.user.email)) {
            console.log("🚨 EMERGENCY: Hard coding admin role for:", session.user.email);
            setRole('admin');
          }
          
        } catch (profileError) {
          console.error("❌ Profile error:", profileError);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
        console.log("🔒 No active session");
      }
    } catch (error) {
      console.error("❌ Error loading user:", error);
      setIsMockMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      console.log('✅ Logout successful');
      
      // Reset state
      setUser(null);
      setRole(null);
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
      }
      
      // Redirect to home
      router.push('/');
      onClose();
      
      // Force reload to clear cache
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleLogin = () => {
    router.push("/login");
    onClose();
  };

  const handleAdminDashboard = () => {
    router.push("/admin/dashboard");
    onClose();
  };

  const handleProfile = () => {
    router.push("/profile");
    onClose();
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    return user.email?.split('@')[0] || 'User';
  };

  const getAvatarInitial = () => {
    if (!user) return 'U';
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6, lg: 20 }}
        py={3}
        bg="white"
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="sm"
        borderBottom="1px"
        borderColor="gray.100"
      >
        {/* Logo */}
        <Flex align="center">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Image 
              src="/images/Logo.svg" 
              width="100px" 
              alt="Logo HealthCheck" 
              loading="eager"
            />
          </Link>
          {isMockMode && (
            <Badge colorScheme="yellow" ml={2} fontSize="xs">
              Demo Mode
            </Badge>
          )}
        </Flex>

        {/* Desktop Navigation */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              color={isActive(item.href) ? "purple.600" : "gray.700"}
              fontWeight={isActive(item.href) ? "bold" : "medium"}
              _hover={{ 
                color: "purple.500", 
                textDecoration: "none",
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
              position="relative"
            >
              {item.label}
              {isActive(item.href) && (
                <Box
                  position="absolute"
                  bottom="-8px"
                  left="0"
                  right="0"
                  height="2px"
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  borderRadius="full"
                />
              )}
            </Link>
          ))}
        </HStack>

        {/* Desktop Auth Section */}
        <HStack spacing={3} display={{ base: "none", md: "flex" }}>
          {isMockMode && (
            <Badge colorScheme="yellow" fontSize="xs" variant="subtle">
              Demo
            </Badge>
          )}
          
          {loading ? (
            <Spinner size="sm" color="purple.500" />
          ) : user ? (
            <HStack spacing={3}>
              {/* Admin Dashboard Button - HANYA muncul untuk admin */}
              {role === "admin" && (
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={handleAdminDashboard}
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "md"
                  }}
                  leftIcon={<Text>⚙️</Text>}
                >
                  Admin Dashboard
                </Button>
              )}
              
              {/* User Menu Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  _hover={{ bg: "purple.50" }}
                  _expanded={{ bg: "purple.50" }}
                  px={2}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={getAvatarInitial()}
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                    />
                    <Box textAlign="left" display={{ base: "none", lg: "block" }}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {getDisplayName()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {role === "admin" ? "Administrator" : "User"}
                      </Text>
                    </Box>
                    <ChevronDownIcon fontSize="sm" color="gray.500" />
                  </HStack>
                </MenuButton>
                <MenuList py={2} minW="200px" boxShadow="xl">
                  <MenuItem 
                    onClick={handleProfile}
                    _hover={{ bg: "purple.50" }}
                  >
                    <Text as="span" mr={2}>👤</Text>
                    Profil Saya
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    onClick={handleLogout}
                    _hover={{ bg: "red.50" }}
                    color="red.600"
                  >
                    <Text as="span" mr={2}>🚪</Text>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <HStack spacing={3}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/register")}
                _hover={{ bg: "gray.50" }}
              >
                Daftar
              </Button>
              <Button
                colorScheme="purple"
                size="sm"
                onClick={handleLogin}
                bgGradient="linear(to-r, purple.500, pink.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                  transform: "translateY(-1px)",
                  boxShadow: "md"
                }}
              >
                Login
              </Button>
            </HStack>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          size="md"
          onClick={onOpen}
          _hover={{ bg: "purple.50" }}
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="bold">Menu</Text>
              {isMockMode && (
                <Badge colorScheme="yellow" fontSize="xs">
                  Demo Mode
                </Badge>
              )}
            </Flex>
          </DrawerHeader>
          
          <DrawerBody py={6}>
            <VStack spacing={4} align="stretch">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  px={3}
                  py={2}
                  borderRadius="md"
                  color={isActive(item.href) ? "purple.600" : "gray.700"}
                  bg={isActive(item.href) ? "purple.50" : "transparent"}
                  fontWeight={isActive(item.href) ? "bold" : "medium"}
                  _hover={{
                    bg: "purple.50",
                    textDecoration: "none",
                    color: "purple.600"
                  }}
                  transition="all 0.2s"
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth Section for Mobile */}
              <Box pt={4} borderTopWidth="1px">
                {loading ? (
                  <Flex justify="center">
                    <Spinner size="sm" color="purple.500" />
                  </Flex>
                ) : user ? (
                  <VStack spacing={3} align="stretch">
                    {/* User Info */}
                    <Flex align="center" px={3} py={2} bg="purple.50" borderRadius="md">
                      <Avatar
                        size="sm"
                        name={getAvatarInitial()}
                        bgGradient="linear(to-r, purple.500, pink.500)"
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        mr={3}
                      />
                      <Box flex="1">
                        <Text fontSize="sm" fontWeight="semibold" color="purple.600">
                          {getDisplayName()}
                        </Text>
                        <Text fontSize="xs" color="purple.500">
                          {role === "admin" ? "Administrator" : "User"}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Admin Dashboard Button - HANYA untuk admin */}
                    {role === "admin" && (
                      <Button
                        colorScheme="purple"
                        size="sm"
                        onClick={handleAdminDashboard}
                        leftIcon={<Text>⚙️</Text>}
                        bgGradient="linear(to-r, purple.500, pink.500)"
                        _hover={{
                          bgGradient: "linear(to-r, purple.600, pink.600)"
                        }}
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    
                    {/* Profile Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleProfile}
                      leftIcon={<Text>👤</Text>}
                    >
                      Profil Saya
                    </Button>
                    
                    {/* Logout Button */}
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      leftIcon={<Text>🚪</Text>}
                      isLoading={loading}
                    >
                      Logout
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={3}>
                    <Button
                      variant="outline"
                      width="full"
                      onClick={() => {
                        router.push("/register");
                        onClose();
                      }}
                    >
                      Daftar
                    </Button>
                    <Button
                      colorScheme="purple"
                      width="full"
                      onClick={handleLogin}
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      _hover={{
                        bgGradient: "linear(to-r, purple.600, pink.600)"
                      }}
                    >
                      Login
                    </Button>
                  </VStack>
                )}
              </Box>

              {/* Debug Info - Hanya di development */}
              {process.env.NODE_ENV === 'development' && (
                <Box p={3} bg="gray.50" borderRadius="md" fontSize="xs">
                  <Text fontWeight="bold">Debug Info:</Text>
                  <Text>User: {user ? user.email : 'Not logged in'}</Text>
                  <Text>Role: {role || 'Not set'}</Text>
                  <Text>Mock Mode: {isMockMode ? 'Yes' : 'No'}</Text>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}