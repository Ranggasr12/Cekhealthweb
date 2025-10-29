"use client";

import {
  Flex,
  Image,
  HStack,
  Link,
  Button,
  useColorModeValue,
  Box,
  Skeleton,
  Badge
} from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Komponen placeholder untuk SSR
function NavbarSkeleton() {
  return (
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
      height="60px"
    >
      <Skeleton width="100px" height="40px" />
      <HStack spacing={6} display={{ base: "none", md: "flex" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width="60px" height="20px" />
        ))}
      </HStack>
      <HStack spacing={3} display={{ base: "none", md: "flex" }}>
        <Skeleton width="70px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </HStack>
    </Flex>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user);

        // Check if user is admin
        if (session?.user) {
          await checkAdminStatus(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      }
    };

    const checkAdminStatus = async (user) => {
      try {
        // Admin email bypass
        const adminEmails = [
          'admin@cekhealth.com', 
          'test@example.com', 
          'ranggasr1223@gmail.com',
          'rangga@example.com'
        ];
        
        if (adminEmails.includes(user.email)) {
          setIsAdmin(true);
          return;
        }

        // Check database role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user);
        if (session?.user) {
          await checkAdminStatus(session.user);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/video-gallery", label: "Video" },
    { href: "/form", label: "Cek Kesehatan" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  // Add Admin Panel to nav items if user is admin
  if (isAdmin && mounted) {
    navItems.push({
      href: "/admin/dashboard",
      label: "Admin Panel",
      isAdmin: true
    });
  }

  const isActive = (href) => {
    if (!mounted) return false;
    return pathname === href;
  };

  const handleAuth = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render skeleton selama SSR atau belum mounted
  if (!mounted) {
    return <NavbarSkeleton />;
  }

  return (
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
            height="40px"
            alt="Logo HealthCheck" 
            loading="eager"
          />
        </Link>
      </Flex>

      {/* Desktop Navigation */}
      <HStack spacing={6} display={{ base: "none", md: "flex" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            color={isActive(item.href) ? "purple.600" : "gray.700"}
            fontWeight={isActive(item.href) ? "bold" : "medium"}
            bg={item.isAdmin ? "purple.50" : "transparent"}
            px={item.isAdmin ? 3 : 0}
            py={item.isAdmin ? 1 : 0}
            borderRadius={item.isAdmin ? "md" : "none"}
            border={item.isAdmin ? "1px solid" : "none"}
            borderColor={item.isAdmin ? "purple.200" : "transparent"}
            _hover={{ 
              textDecoration: "none", 
              color: item.isAdmin ? "purple.600" : "purple.500",
              transform: "translateY(-1px)",
              bg: item.isAdmin ? "purple.100" : "transparent"
            }}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            gap={1}
          >
            {item.isAdmin && (
              <Box as="span" fontSize="sm">
                🛠️
              </Box>
            )}
            {item.label}
          </Link>
        ))}
      </HStack>

      {/* Auth Buttons */}
      <HStack spacing={3} display={{ base: "none", md: "flex" }}>
        {user ? (
          <>
            {isAdmin && (
              <Badge colorScheme="purple" fontSize="xs" mr={2}>
                Admin
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
              _hover={{ bg: 'purple.50' }}
            >
              👤 Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/login')}
              _hover={{ bg: 'gray.50' }}
            >
              Login
            </Button>
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() => router.push('/register')}
              _hover={{ transform: 'translateY(-1px)' }}
            >
              Daftar
            </Button>
          </>
        )}
      </HStack>

      {/* Mobile Menu Button */}
      <Box display={{ base: "block", md: "none" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAuth}
          _hover={{ bg: 'purple.50' }}
        >
          {user ? '👤' : 'Login'}
        </Button>
        
        {/* Admin link untuk mobile */}
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
            _hover={{ bg: 'purple.50' }}
            ml={2}
          >
             Admin
          </Button>
        )}
      </Box>
    </Flex>
  );
}