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
  Badge
} from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { 
  getSession, 
  onAuthStateChange, 
  authSignOut,
  supabase 
} from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/makalah", label: "Makalah" },
    { href: "/video-gallery", label: "Video" },
    { href: "/form", label: "Cek Kesehatan" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => pathname === href;

  useEffect(() => {
    loadUserData();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (event === 'SIGNED_IN' && session) {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
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
      const { data: { session }, error } = await getSession();
      console.log("Session loaded:", session);
      
      if (error) {
        console.error("Session error:", error);
      }

      // Check if we're in mock mode
      const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-url');
      setIsMockMode(isMock);
      
      if (session?.user) {
        setUser(session.user);

        // Try to get user profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (!profileError && profile) {
            setRole(profile.role || "user");
          } else {
            setRole("user");
          }
        } catch (profileError) {
          console.error("Profile error:", profileError);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setIsMockMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authSignOut();
      setUser(null);
      setRole(null);
      router.push("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    if (isMockMode) {
      // Mock login untuk development
      setUser({ 
        id: 'mock-user-1', 
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' }
      });
      setRole('user');
      onClose();
    } else {
      router.push("/login");
      onClose();
    }
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
          <Link href="/">
            <Image 
              src="/images/Logo.svg" 
              width="100px" 
              alt="Logo HealthCheck" 
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
              _hover={{ color: "purple.500", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
        </HStack>

        {/* Desktop Auth Section */}
        <HStack spacing={3} display={{ base: "none", md: "flex" }}>
          {isMockMode && (
            <Badge colorScheme="yellow" fontSize="xs">
              Demo
            </Badge>
          )}
          
          {loading ? (
            <Spinner size="sm" color="purple.500" />
          ) : user ? (
            <HStack spacing={3}>
              {role === "admin" && (
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={() => router.push("/admin")}
                >
                  Admin Dashboard
                </Button>
              )}
              
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<ChevronDownIcon />}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={user.email?.[0]?.toUpperCase() || 'U'}
                      bg="purple.500"
                      color="white"
                    />
                    <Text fontSize="sm" display={{ base: "none", lg: "block" }}>
                      {user.email?.split('@')[0] || 'User'}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push("/profile")}>
                    Profil Saya
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} color="red.600">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <Button
              colorScheme="purple"
              size="sm"
              onClick={handleLogin}
            >
              {isMockMode ? "Demo Login" : "Login"}
            </Button>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
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
          <DrawerBody py={4}>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  color={isActive(item.href) ? "purple.600" : "gray.700"}
                  fontWeight={isActive(item.href) ? "bold" : "normal"}
                  py={2}
                  _hover={{ textDecoration: "none", bg: "gray.50" }}
                  borderRadius="md"
                  px={2}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Auth Section Mobile */}
              <Box pt={4} borderTopWidth="1px">
                {loading ? (
                  <Flex justify="center">
                    <Spinner size="sm" color="purple.500" />
                  </Flex>
                ) : user ? (
                  <VStack spacing={3} align="stretch">
                    <Box p={2} bg="purple.50" borderRadius="md">
                      <Text fontSize="sm" fontWeight="bold" color="purple.600">
                        Hi, {user.email?.split('@')[0]}
                      </Text>
                      <Text fontSize="xs" color="purple.500">
                        {role === "admin" ? "Administrator" : "User"}
                      </Text>
                    </Box>
                    
                    {role === "admin" && (
                      <Button
                        colorScheme="purple"
                        size="sm"
                        onClick={() => {
                          router.push("pages/admin/dashboard");
                          onClose();
                        }}
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push("/profile");
                        onClose();
                      }}
                    >
                      Profil Saya
                    </Button>
                    
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      isLoading={loading}
                    >
                      Logout
                    </Button>
                  </VStack>
                ) : (
                  <Button
                    colorScheme="purple"
                    width="full"
                    onClick={handleLogin}
                  >
                    {isMockMode ? "Demo Login" : "Login"}
                  </Button>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}