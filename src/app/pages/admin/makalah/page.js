import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FiTrash2, FiDownload } from 'react-icons/fi'

export default function MakalahManagement() {
  const [makalah, setMakalah] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    pdf_url: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchMakalah()
  }, [])

  const fetchMakalah = async () => {
    const { data, error } = await supabase
      .from('makalah')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setMakalah(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('makalah')
        .insert([formData])

      if (error) throw error

      toast({
        title: 'Makalah berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      setFormData({
        title: '',
        pdf_url: '',
        description: ''
      })
      fetchMakalah()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('makalah')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Makalah berhasil dihapus!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchMakalah()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <AdminLayout>
      <Box p={4}>
        <Heading mb={6}>Kelola Makalah</Heading>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Add Makalah Form */}
          <GridItem>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Upload Makalah Baru</Heading>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Judul Makalah</FormLabel>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Judul makalah"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>PDF URL</FormLabel>
                      <Input
                        value={formData.pdf_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                        placeholder="https://example.com/makalah.pdf"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Deskripsi</FormLabel>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi makalah"
                        rows={3}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      w="full"
                      isLoading={loading}
                    >
                      Upload Makalah
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </GridItem>

          {/* Makalah List */}
          <GridItem>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Daftar Makalah ({makalah.length})</Heading>
                <Box maxH="500px" overflowY="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Judul</Th>
                        <Th>Tanggal</Th>
                        <Th>Aksi</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {makalah.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">{item.title}</Text>
                              <Text fontSize="sm" color="gray.600" noOfLines={1}>
                                {item.description}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </Text>
                          </Td>
                          <Td>
                            <HStack>
                              <IconButton
                                icon={<FiDownload />}
                                size="sm"
                                colorScheme="blue"
                                onClick={() => window.open(item.pdf_url, '_blank')}
                                aria-label="Download PDF"
                              />
                              <IconButton
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDelete(item.id)}
                                aria-label="Delete makalah"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </AdminLayout>
  )
}