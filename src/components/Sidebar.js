import {
  Box,
  Flex,
  Text,
  VStack,
  Link,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  FiHome,
  FiVideo,
  FiFileText,
  FiHelpCircle,
  FiSettings
} from 'react-icons/fi'

const NavItem = ({ icon, children, href, ...rest }) => {
  const router = useRouter()
  const isActive = router.pathname === href
  
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: 'blue.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

export default function Sidebar({ onClose, ...rest }) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          CekHealth Admin
        </Text>
      </Flex>

      <VStack spacing="1" align="stretch">
        <NavItem icon={FiHome} href="/admin/dashboard">
          Dashboard
        </NavItem>
        <NavItem icon={FiHome} href="/admin/home">
          Edit Home
        </NavItem>
        <NavItem icon={FiVideo} href="/admin/videos">
          Kelola Video
        </NavItem>
        <NavItem icon={FiFileText} href="/admin/makalah">
          Kelola Makalah
        </NavItem>
        <NavItem icon={FiHelpCircle} href="/admin/pertanyaan">
          Kelola Pertanyaan
        </NavItem>
        <NavItem icon={FiSettings} href="/admin/settings">
          Settings
        </NavItem>
      </VStack>
    </Box>
  )
}