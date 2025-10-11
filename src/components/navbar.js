"use client";

import {
  Flex,
  Heading,
  Image,
  HStack,
  Link,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { usePathname } from 'next/navigation';
import { HamburgerIcon } from '@chakra-ui/icons';

export default function Navbar() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const activeColor = useColorModeValue("purple.600", "purple.300");
  const inactiveColor = useColorModeValue("gray.700", "gray.300");
  const hoverColor = useColorModeValue("purple.500", "purple.200");

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/video-gallery", label: "Video" },
    { href: "/form", label: "Cek Kesehatan" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
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
        boxShadow="0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 5px -1px rgba(0, 0, 0, 0.03)"
        _after={{
          content: '""',
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(128, 90, 213, 0.1) 20%, rgba(128, 90, 213, 0.2) 50%, rgba(128, 90, 213, 0.1) 80%, transparent 100%)"
        }}
      >
        <Flex align="center">
          <Link href="/">
            <Image
              src="/images/Logo.svg"
              alt="HealthCheck Logo"
              width={{ base: "70px", md: "80px", lg: "90px" }}
              height="auto"
              objectFit="contain"
              draggable="false"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.05)",
                opacity: 0.9
              }}
              fallback={
                <Heading size={{ base: "sm", md: "md" }} color="purple.600">
                  HealthCheck
                </Heading>
              }
            />
          </Link>
        </Flex>

        <HStack 
          spacing={{ base: 4, md: 6, lg: 8 }} 
          fontWeight="medium" 
          color="gray.700"
          display={{ base: "none", md: "flex" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              color={isActive(item.href) ? activeColor : inactiveColor}
              fontWeight={isActive(item.href) ? "semibold" : "medium"}
              position="relative"
              _hover={{
                color: hoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s ease"
              fontSize={{ base: "sm", lg: "md" }}
              {...(isActive(item.href) && {
                _after: {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "0",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "purple.500",
                  borderRadius: "full"
                }
              })}
            >
              {item.label}
            </Link>
          ))}
        </HStack>

        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          color="gray.700"
          onClick={onOpen}
          _hover={{ bg: "purple.50", color: "purple.600" }}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center" justify="space-between">
              <Heading size="md">Menu</Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" py={4}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  color={isActive(item.href) ? activeColor : inactiveColor}
                  fontWeight={isActive(item.href) ? "semibold" : "medium"}
                  py={2}
                  px={4}
                  borderRadius="md"
                  _hover={{
                    bg: "purple.50",
                    color: "purple.600",
                    textDecoration: "none"
                  }}
                  transition="all 0.2s"
                >
                  {item.label}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}