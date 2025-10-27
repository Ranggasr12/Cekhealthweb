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
  Tag,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: ''
  })
  const [editingId, setEditingId] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setQuestions(data || [])
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
          .from('questions')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        showToast('Pertanyaan berhasil diupdate', 'success')
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('questions')
          .insert([formData])
        
        if (error) throw error
        showToast('Pertanyaan berhasil ditambahkan', 'success')
        setFormData({ question: '', answer: '', category: '' })
      }

      await fetchQuestions()
    } catch (error) {
      showToast('Error menyimpan pertanyaan', 'error')
      console.error('Error saving question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || ''
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)

      if (!error) {
        showToast('Pertanyaan berhasil dihapus', 'success')
        await fetchQuestions()
      }
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ question: '', answer: '', category: '' })
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Form Pertanyaan */}
      <Card>
        <CardHeader>
          <Heading size="md">
            {editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Pertanyaan</FormLabel>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Masukkan pertanyaan"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Jawaban</FormLabel>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Masukkan jawaban"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Kategori</FormLabel>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Kategori (opsional)"
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

      {/* Daftar Pertanyaan */}
      <Card>
        <CardHeader>
          <Heading size="md">Daftar Pertanyaan</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {questions.map((item) => (
              <Box
                key={item.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                      <Heading size="sm">{item.question}</Heading>
                      <Text color="gray.700">{item.answer}</Text>
                      
                      {item.category && (
                        <Tag colorScheme="blue" size="sm">
                          {item.category}
                        </Tag>
                      )}
                    </VStack>
                    
                    <HStack>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit pertanyaan"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Hapus pertanyaan"
                      />
                    </HStack>
                  </HStack>
                  
                  <Text fontSize="xs" color="gray.500">
                    Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </Text>
                </VStack>
              </Box>
            ))}
            
            {questions.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                Belum ada pertanyaan
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}