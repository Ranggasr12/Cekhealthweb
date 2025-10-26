"use client";

import {
  Flex,
  Heading,
  Image,
  HStack,
  Link,
  Button,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/video-gallery", label: "Video" },
    { href: "/form", label: "Cek Kesehatan" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => pathname === href;

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);

        // Ambil role di tabel profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        setRole(profile?.role || "user");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6, lg: 20 }}
        py={4}
        bg="white"
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="md"
      >
        <Flex align="center">
          <Link href="/">
            <Image src="/images/Logo.svg" width="90px" alt="Logo" />
          </Link>
        </Flex>

        {/* MENU DESKTOP */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              color={isActive(item.href) ? "purple.600" : "gray.700"}
              fontWeight={isActive(item.href) ? "bold" : "medium"}
            >
              {item.label}
            </Link>
          ))}

          {/* AUTH BUTTONS */}
          {loading ? (
            <Spinner size="sm" />
          ) : user ? (
            <>
              {role === "admin" && (
                <Button colorScheme="purple" size="sm" onClick={() => router.push("/admin")}>
                  Dashboard Admin
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button colorScheme="purple" size="sm" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </HStack>

        {/* MOBILE MENU BUTTON */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
        />
      </Flex>

      {/* DRAWER MOBILE MENU */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  {item.label}
                </Link>
              ))}

              {!loading && (
                user ? (
                  <>
                    {role === "admin" && (
                      <Button colorScheme="purple" onClick={() => router.push("/admin")}>
                        Dashboard Admin
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="purple" onClick={() => router.push("/login")}>
                    Login
                  </Button>
                )
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
