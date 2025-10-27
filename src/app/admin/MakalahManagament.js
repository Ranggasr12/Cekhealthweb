'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Box,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  useToast,
  Tag,
  IconButton,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

export default function MakalahManagement() {
  const [makalah, setMakalah] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  })
  const [editingId, setEditingId] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchMakalah()
  }, [])

  const fetchMakalah = async () => {
    const { data, error } = await supabase
      .from('makalah')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setMakalah(data || [])
    }
  }

  const showToast = (title, status) => {
    toast({
      title,
      status,
      duration: 3000,
      isClosable: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        const { error } = await supabase
          .from('makalah')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)

        if (error) throw error
        showToast('Makalah berhasil diupdate', 'success')
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('makalah')
          .insert([formData])
        
        if (error) throw error
        showToast('Makalah berhasil ditambahkan', 'success')
        setFormData({ title: '', content: '', author: '' })
      }

      await fetchMakalah()
    } catch (error) {
      showToast('Error menyimpan makalah', 'error')
      console.error('Error saving makalah:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      author: item.author || ''
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus makalah ini?')) {
      const { error } = await supabase
        .from('makalah')
        .delete()
        .eq('id', id)

      if (!error) {
        showToast('Makalah berhasil dihapus', 'success')
        await fetchMakalah()
      }
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', content: '', author: '' })
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Form Makalah */}
      <Card>
        <CardHeader>
          <Heading size="md">
            {editingId ? 'Edit Makalah' : 'Tambah Makalah Baru'}
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Judul Makalah</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul makalah"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Penulis</FormLabel>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nama penulis (opsional)"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Konten</FormLabel>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Isi konten makalah"
                  rows={6}
                />
              </FormControl>

              <HStack spacing={3}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Menyimpan..."
                >
                  {editingId ? 'Update' : 'Simpan'}
                </Button>
                
                {editingId && (
                  <Button onClick={cancelEdit} variant="outline">
                    Batal
                  </Button>
                )}
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>

      {/* Daftar Makalah */}
      <Card>
        <CardHeader>
          <Heading size="md">Daftar Makalah</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {makalah.map((item) => (
              <Box
                key={item.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Heading size="sm">{item.title}</Heading>
                    <HStack>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit makalah"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Hapus makalah"
                      />
                    </HStack>
                  </HStack>
                  
                  {item.author && (
                    <Text fontSize="sm" color="gray.600">
                      Oleh: {item.author}
                    </Text>
                  )}
                  
                  <Text noOfLines={3} color="gray.700">
                    {item.content}
                  </Text>
                  
                  <Text fontSize="xs" color="gray.500">
                    Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </Text>
                </VStack>
              </Box>
            ))}
            
            {makalah.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                Belum ada makalah
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}