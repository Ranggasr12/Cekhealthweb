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
  IconButton,
  AspectRatio,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons'

export default function VideoManagement() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setVideos(data || [])
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
          .from('videos')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        showToast('Video berhasil diupdate', 'success')
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([formData])
        
        if (error) throw error
        showToast('Video berhasil ditambahkan', 'success')
        setFormData({ title: '', url: '', description: '' })
      }

      await fetchVideos()
    } catch (error) {
      showToast('Error menyimpan video', 'error')
      console.error('Error saving video:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      url: item.url,
      description: item.description || ''
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (!error) {
        showToast('Video berhasil dihapus', 'success')
        await fetchVideos()
      }
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', url: '', description: '' })
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ''
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : url
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Form Video */}
      <Card>
        <CardHeader>
          <Heading size="md">
            {editingId ? 'Edit Video' : 'Tambah Video Baru'}
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Judul Video</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul video"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>URL Video</FormLabel>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi video (opsional)"
                  rows={3}
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

      {/* Daftar Video */}
      <Card>
        <CardHeader>
          <Heading size="md">Daftar Video</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {videos.map((item) => (
              <Box
                key={item.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="sm">{item.title}</Heading>
                    <HStack>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit video"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Hapus video"
                      />
                    </HStack>
                  </HStack>

                  <AspectRatio ratio={16 / 9}>
                    <Box
                      as="iframe"
                      src={getYouTubeEmbedUrl(item.url)}
                      allowFullScreen
                      borderRadius="md"
                    />
                  </AspectRatio>

                  {item.description && (
                    <Text color="gray.700">{item.description}</Text>
                  )}
                  
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">
                      Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </Text>
                    <Button
                      size="sm"
                      rightIcon={<ExternalLinkIcon />}
                      as="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buka di YouTube
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
            
            {videos.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                Belum ada video
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}