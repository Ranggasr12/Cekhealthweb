'use client'
import {
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

export default function AdminNavbar({ activeTab, setActiveTab }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleLogout = () => {
    // Clear storage dan redirect ke login
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('isAdmin')
    window.location.href = '/login'
  }

  const tabs = [
    { id: 'makalah', label: 'Makalah' },
    { id: 'video', label: 'Video' },
    { id: 'pertanyaan', label: 'Pertanyaan' },
  ]

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} shadow="sm">
      <Box maxW="7xl" mx="auto" px={4}>
        <Flex justify="space-between" align="center" py={4}>
          <Flex gap={6}>
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                colorScheme={activeTab === tab.id ? 'blue' : 'gray'}
                fontWeight={activeTab === tab.id ? 'semibold' : 'normal'}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>
          
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Flex align="center" gap={2}>
                <Text>Admin Panel</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout} color="red.600">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Box>
  )
}