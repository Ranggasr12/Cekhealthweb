'use client';

import {
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Box,
  Icon,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

export default function MobileNav({ onOpen, user, onLogout, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        CekHealth
      </Text>

      <Flex alignItems="center" gap={4}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        
        <Menu>
          <MenuButton>
            <Flex align="center" gap={2}>
              <Avatar size="sm" src={user?.user_metadata?.avatar_url} />
              <Box display={{ base: 'none', md: 'block' }}>
                <Text fontSize="sm" fontWeight="medium">
                  {user?.email}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Admin
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon as={FiUser} />}>
              Profile
            </MenuItem>
            <MenuItem icon={<Icon as={FiSettings} />}>
              Settings
            </MenuItem>
            <MenuItem 
              icon={<Icon as={FiLogOut} />}
              onClick={onLogout}
              color="red.500"
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}