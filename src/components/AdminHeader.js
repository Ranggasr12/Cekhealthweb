"use client";

import {
  Box,
  Text,
  Button,
  Icon,
  Flex,
  Avatar,
  SkeletonCircle,
  SkeletonText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { getProfile, getSession, authSignOut } from '@/lib/supabase';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function AdminHeader() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      const { error } = await authSignOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
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
}