'use client'
import { useState } from 'react'
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Button,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react'
import { 
  FiFileText, 
  FiVideo, 
  FiHelpCircle, 
  FiUsers,
  FiPlus,
  FiEdit,
  FiTrash2
} from 'react-icons/fi'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  // Stats data
  const stats = [
    { label: 'Total Makalah', value: '12', change: '+2', icon: FiFileText, color: 'blue' },
    { label: 'Total Video', value: '8', change: '+1', icon: FiVideo, color: 'green' },
    { label: 'Total Pertanyaan', value: '25', change: '+5', icon: FiHelpCircle, color: 'purple' },
    { label: 'Admin Aktif', value: '3', change: '+0', icon: FiUsers, color: 'orange' }
  ]

  // Recent activities
  const activities = [
    { action: 'Makalah baru ditambahkan', time: '2 jam lalu', type: 'makalah' },
    { action: 'Video edukasi diupdate', time: '1 hari lalu', type: 'video' },
    { action: 'Pertanyaan baru ditambahkan', time: '3 hari lalu', type: 'question' }
  ]

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl" py={4}>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="blue.600">
                Dashboard Admin
              </Heading>
              <Text color="gray.600">Kelola konten website Cekhealth</Text>
            </VStack>
            
            <HStack spacing={4}>
              <Button 
                colorScheme="blue" 
                leftIcon={<FiPlus />}
                as={Link}
                href="/admin/makalah"
              >
                Tambah Konten
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Navigation */}
      <Box bg="white" shadow="xs">
        <Container maxW="7xl">
          <HStack spacing={8} py={3}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FiUsers },
              { id: 'makalah', label: 'Makalah', icon: FiFileText },
              { id: 'video', label: 'Video', icon: FiVideo },
              { id: 'pertanyaan', label: 'Pertanyaan', icon: FiHelpCircle }
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                leftIcon={<Icon as={item.icon} />}
                onClick={() => setActiveTab(item.id)}
                colorScheme={activeTab === item.id ? 'blue' : 'gray'}
                fontWeight={activeTab === item.id ? 'semibold' : 'normal'}
                borderBottom={activeTab === item.id ? '2px solid' : 'none'}
                borderColor="blue.500"
                borderRadius="none"
                height="auto"
                py={3}
              >
                {item.label}
              </Button>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        {activeTab === 'dashboard' && (
          <VStack spacing={8} align="stretch">
            {/* Statistics Cards */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
              {stats.map((stat, index) => (
                <GridItem key={index}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2}>
                          <Text color="gray.600" fontSize="sm" fontWeight="medium">
                            {stat.label}
                          </Text>
                          <Stat>
                            <StatNumber fontSize="2xl" fontWeight="bold">
                              {stat.value}
                            </StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              {stat.change}
                            </StatHelpText>
                          </Stat>
                        </VStack>
                        <Box
                          p={3}
                          bg={`${stat.color}.100`}
                          borderRadius="lg"
                          color={`${stat.color}.600`}
                        >
                          <Icon as={stat.icon} boxSize={6} />
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>

            {/* Quick Actions */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
                <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box p={3} bg="blue.100" borderRadius="lg" color="blue.600">
                        <Icon as={FiFileText} boxSize={6} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Kelola Makalah</Text>
                        <Text fontSize="sm" color="gray.600">
                          Tambah, edit, atau hapus makalah kesehatan
                        </Text>
                      </VStack>
                      <Button 
                        colorScheme="blue" 
                        size="sm" 
                        width="full"
                        onClick={() => setActiveTab('makalah')}
                      >
                        Kelola Makalah
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box p={3} bg="green.100" borderRadius="lg" color="green.600">
                        <Icon as={FiVideo} boxSize={6} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Kelola Video</Text>
                        <Text fontSize="sm" color="gray.600">
                          Kelola video edukasi kesehatan
                        </Text>
                      </VStack>
                      <Button 
                        colorScheme="green" 
                        size="sm" 
                        width="full"
                        onClick={() => setActiveTab('video')}
                      >
                        Kelola Video
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box p={3} bg="purple.100" borderRadius="lg" color="purple.600">
                        <Icon as={FiHelpCircle} boxSize={6} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Kelola Pertanyaan</Text>
                        <Text fontSize="sm" color="gray.600">
                          Kelola FAQ dan pertanyaan umum
                        </Text>
                      </VStack>
                      <Button 
                        colorScheme="purple" 
                        size="sm" 
                        width="full"
                        onClick={() => setActiveTab('pertanyaan')}
                      >
                        Kelola Pertanyaan
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Recent Activity */}
            <Card bg={cardBg} shadow="md">
              <CardHeader>
                <Heading size="md">Aktivitas Terbaru</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {activities.map((activity, index) => (
                    <HStack key={index} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="medium">{activity.action}</Text>
                      <Text fontSize="sm" color="gray.600">{activity.time}</Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        )}

        {activeTab === 'makalah' && (
          <Box>
            <HStack justify="space-between" mb={6}>
              <Heading size="lg">Kelola Makalah</Heading>
              <Button colorScheme="blue" leftIcon={<FiPlus />}>
                Tambah Makalah
              </Button>
            </HStack>
            <Card bg={cardBg} shadow="md">
              <CardBody>
                <Text>Fitur manajemen makalah akan ditampilkan di sini...</Text>
              </CardBody>
            </Card>
          </Box>
        )}

        {activeTab === 'video' && (
          <Box>
            <HStack justify="space-between" mb={6}>
              <Heading size="lg">Kelola Video</Heading>
              <Button colorScheme="green" leftIcon={<FiPlus />}>
                Tambah Video
              </Button>
            </HStack>
            <Card bg={cardBg} shadow="md">
              <CardBody>
                <Text>Fitur manajemen video akan ditampilkan di sini...</Text>
              </CardBody>
            </Card>
          </Box>
        )}

        {activeTab === 'pertanyaan' && (
          <Box>
            <HStack justify="space-between" mb={6}>
              <Heading size="lg">Kelola Pertanyaan</Heading>
              <Button colorScheme="purple" leftIcon={<FiPlus />}>
                Tambah Pertanyaan
              </Button>
            </HStack>
            <Card bg={cardBg} shadow="md">
              <CardBody>
                <Text>Fitur manajemen pertanyaan akan ditampilkan di sini...</Text>
              </CardBody>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  )
}