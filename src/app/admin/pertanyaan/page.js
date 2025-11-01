"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useToast,
  Card,
  CardBody,
  Badge,
  Input,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Flex,
  SimpleGrid,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch,
  FiRefreshCw,
  FiFileText,
  FiMessageSquare
} from 'react-icons/fi';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';

export default function PertanyaanManagement() {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [filteredPertanyaan, setFilteredPertanyaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterTipe, setFilterTipe] = useState('');

  // Form state - DIPERLUAS dengan field baru
  const [formData, setFormData] = useState({
    pertanyaan_text: '',
    jenis_penyakit: '',
    tipe_pertanyaan: 'ya_tidak',
    score: 1,
    // Field untuk essay
    keyword_jawaban: '',
    // Informasi tambahan
    indikasi: '',
    saran: '',
    penanganan: '',
    rekomendasi: ''
  });

  // Modal states
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const cancelRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const toast = useToast();

  // Fetch data dari Firestore
  const fetchPertanyaan = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching pertanyaan from Firestore...');
      
      const q = query(
        collection(db, 'pertanyaan'), 
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const pertanyaanData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Pertanyaan loaded:', pertanyaanData.length);
      setPertanyaan(pertanyaanData);
      setFilteredPertanyaan(pertanyaanData);
      
    } catch (error) {
      console.error('❌ Error fetching pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPertanyaan();
  }, [fetchPertanyaan]);

  // Filter data
  useEffect(() => {
    let filtered = pertanyaan;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.pertanyaan_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenis_penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.keyword_jawaban && item.keyword_jawaban.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterJenis) {
      filtered = filtered.filter(item => item.jenis_penyakit === filterJenis);
    }

    if (filterTipe) {
      filtered = filtered.filter(item => item.tipe_pertanyaan === filterTipe);
    }

    setFilteredPertanyaan(filtered);
  }, [pertanyaan, searchTerm, filterJenis, filterTipe]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      pertanyaan_text: '',
      jenis_penyakit: '',
      tipe_pertanyaan: 'ya_tidak',
      score: 1,
      keyword_jawaban: '',
      indikasi: '',
      saran: '',
      penanganan: '',
      rekomendasi: ''
    });
    setEditingId(null);
  };

  // Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pertanyaan_text.trim() || !formData.jenis_penyakit.trim()) {
      toast({
        title: 'Error',
        description: 'Pertanyaan dan jenis penyakit harus diisi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi untuk essay questions
    if (formData.tipe_pertanyaan === 'essay' && !formData.keyword_jawaban.trim()) {
      toast({
        title: 'Error',
        description: 'Keyword jawaban harus diisi untuk pertanyaan essay',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const pertanyaanData = {
        ...formData,
        pertanyaan_text: formData.pertanyaan_text.trim(),
        jenis_penyakit: formData.jenis_penyakit.trim(),
        keyword_jawaban: formData.keyword_jawaban.trim(),
        indikasi: formData.indikasi.trim(),
        saran: formData.saran.trim(),
        penanganan: formData.penanganan.trim(),
        rekomendasi: formData.rekomendasi.trim(),
        updated_at: serverTimestamp()
      };

      if (editingId) {
        // Update existing document
        await updateDoc(doc(db, 'pertanyaan', editingId), pertanyaanData);
        console.log('✅ Pertanyaan updated:', editingId);
        
        toast({
          title: 'Berhasil',
          description: 'Pertanyaan berhasil diperbarui',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new document
        pertanyaanData.created_at = serverTimestamp();
        await addDoc(collection(db, 'pertanyaan'), pertanyaanData);
        console.log('✅ Pertanyaan created');
        
        toast({
          title: 'Berhasil',
          description: 'Pertanyaan berhasil ditambahkan',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      // Refresh data dan reset form
      fetchPertanyaan();
      resetForm();
      onModalClose();
      
    } catch (error) {
      console.error('❌ Error saving pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData({
      pertanyaan_text: item.pertanyaan_text || '',
      jenis_penyakit: item.jenis_penyakit || '',
      tipe_pertanyaan: item.tipe_pertanyaan || 'ya_tidak',
      score: item.score || 1,
      keyword_jawaban: item.keyword_jawaban || '',
      indikasi: item.indikasi || '',
      saran: item.saran || '',
      penanganan: item.penanganan || '',
      rekomendasi: item.rekomendasi || ''
    });
    setEditingId(item.id);
    onModalOpen();
  };

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await deleteDoc(doc(db, 'pertanyaan', deleteId));
      console.log('✅ Pertanyaan deleted:', deleteId);
      
      toast({
        title: 'Berhasil',
        description: 'Pertanyaan berhasil dihapus',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchPertanyaan();
      
    } catch (error) {
      console.error('❌ Error deleting pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteId(null);
    }
  };

  // Get unique values untuk filter
  const uniquePenyakit = [...new Set(pertanyaan.map(item => item.jenis_penyakit))].filter(Boolean);
  const uniqueTipe = [...new Set(pertanyaan.map(item => item.tipe_pertanyaan))].filter(Boolean);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID');
    }
    
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat data pertanyaan...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>Kelola Pertanyaan Kesehatan</Heading>
            <Text color="gray.600">
              Kelola pertanyaan untuk sistem diagnosa kesehatan dengan konfigurasi lengkap
            </Text>
          </Box>

          {/* Stats Card */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="blue.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.length}
                  </Text>
                  <Text color="blue.600" fontSize="sm">Total Pertanyaan</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="green.800" fontSize="2xl" fontWeight="bold">
                    {uniquePenyakit.length}
                  </Text>
                  <Text color="green.600" fontSize="sm">Jenis Penyakit</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="orange.50" border="1px" borderColor="orange.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="orange.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.filter(p => p.tipe_pertanyaan === 'ya_tidak').length}
                  </Text>
                  <Text color="orange.600" fontSize="sm">Pertanyaan Ya/Tidak</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="purple.50" border="1px" borderColor="purple.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="purple.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.filter(p => p.tipe_pertanyaan === 'essay').length}
                  </Text>
                  <Text color="purple.600" fontSize="sm">Pertanyaan Essay</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Action Bar */}
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <HStack w="full" justify="space-between">
                  <Button
                    colorScheme="purple"
                    leftIcon={<FiPlus />}
                    onClick={() => {
                      resetForm();
                      onModalOpen();
                    }}
                  >
                    Tambah Pertanyaan
                  </Button>
                  
                  <HStack>
                    <Button
                      variant="outline"
                      leftIcon={<FiRefreshCw />}
                      onClick={fetchPertanyaan}
                      isLoading={loading}
                    >
                      Refresh
                    </Button>
                  </HStack>
                </HStack>

                {/* Search and Filters */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Cari Pertanyaan/Keyword</FormLabel>
                    <Input
                      placeholder="Cari pertanyaan, penyakit, atau keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Filter Jenis Penyakit</FormLabel>
                    <Select
                      value={filterJenis}
                      onChange={(e) => setFilterJenis(e.target.value)}
                      placeholder="Semua jenis"
                    >
                      {uniquePenyakit.map(penyakit => (
                        <option key={penyakit} value={penyakit}>
                          {penyakit}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Filter Tipe Pertanyaan</FormLabel>
                    <Select
                      value={filterTipe}
                      onChange={(e) => setFilterTipe(e.target.value)}
                      placeholder="Semua tipe"
                    >
                      <option value="ya_tidak">Ya/Tidak</option>
                      <option value="essay">Essay</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Pertanyaan Table */}
          <Card>
            <CardBody>
              {pertanyaan.length === 0 ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">Belum ada pertanyaan</Text>
                    <Text fontSize="sm">
                      Tambah pertanyaan pertama Anda untuk sistem diagnosa kesehatan.
                    </Text>
                  </Box>
                </Alert>
              ) : filteredPertanyaan.length === 0 ? (
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Text>Tidak ada pertanyaan yang sesuai dengan filter.</Text>
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Pertanyaan</Th>
                        <Th>Jenis Penyakit</Th>
                        <Th>Tipe</Th>
                        <Th>Score</Th>
                        <Th>Keyword</Th>
                        <Th>Tanggal</Th>
                        <Th>Aksi</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPertanyaan.map((item) => (
                        <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                          <Td maxW="300px">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" noOfLines={2}>
                                {item.pertanyaan_text}
                              </Text>
                              {item.indikasi && (
                                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                  💡 {item.indikasi}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue" variant="subtle">
                              {item.jenis_penyakit}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={item.tipe_pertanyaan === 'essay' ? 'purple' : 'green'}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              px={2}
                              py={1}
                            >
                              {item.tipe_pertanyaan === 'essay' ? <FiFileText size={12} /> : <FiMessageSquare size={12} />}
                              {item.tipe_pertanyaan === 'essay' ? 'Essay' : 'Ya/Tidak'}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme="green">
                              {item.score}
                            </Badge>
                          </Td>
                          <Td>
                            {item.keyword_jawaban ? (
                              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                {item.keyword_jawaban}
                              </Text>
                            ) : (
                              <Text fontSize="sm" color="gray.400">-</Text>
                            )}
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(item.created_at)}</Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FiEdit />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(item)}
                                aria-label="Edit pertanyaan"
                              />
                              <IconButton
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDeleteClick(item.id)}
                                aria-label="Delete pertanyaan"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Informasi Dasar</Tab>
                <Tab>Konfigurasi Essay</Tab>
                <Tab>Informasi Medis</Tab>
              </TabList>

              <TabPanels>
                {/* Tab 1: Informasi Dasar */}
                <TabPanel>
                  <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <FormLabel>Pertanyaan</FormLabel>
                      <Textarea
                        name="pertanyaan_text"
                        value={formData.pertanyaan_text}
                        onChange={handleInputChange}
                        placeholder="Masukkan pertanyaan kesehatan..."
                        rows={3}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Jenis Penyakit</FormLabel>
                      <Input
                        name="jenis_penyakit"
                        value={formData.jenis_penyakit}
                        onChange={handleInputChange}
                        placeholder="Contoh: Anemia, Diabetes, Hipertensi"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tipe Pertanyaan</FormLabel>
                      <Select
                        name="tipe_pertanyaan"
                        value={formData.tipe_pertanyaan}
                        onChange={handleInputChange}
                      >
                        <option value="ya_tidak">Ya/Tidak</option>
                        <option value="essay">Essay (Jawaban Text)</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Score</FormLabel>
                      <Input
                        type="number"
                        name="score"
                        value={formData.score}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Nilai score yang ditambahkan jika jawaban positif
                      </Text>
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Tab 2: Konfigurasi Essay */}
                <TabPanel>
                  <VStack spacing={4}>
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        Konfigurasi ini hanya diperlukan untuk pertanyaan tipe Essay
                      </Text>
                    </Alert>

                    <FormControl isRequired={formData.tipe_pertanyaan === 'essay'}>
                      <FormLabel>Keyword Jawaban</FormLabel>
                      <Textarea
                        name="keyword_jawaban"
                        value={formData.keyword_jawaban}
                        onChange={handleInputChange}
                        placeholder="Masukkan keyword yang menandakan jawaban positif (pisahkan dengan koma)"
                        rows={3}
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Contoh: lelah,lesu,kurang energi,lemah,capai
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Indikasi</FormLabel>
                      <Input
                        name="indikasi"
                        value={formData.indikasi}
                        onChange={handleInputChange}
                        placeholder="Indikasi medis dari pertanyaan ini"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Tab 3: Informasi Medis */}
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Saran</FormLabel>
                      <Textarea
                        name="saran"
                        value={formData.saran}
                        onChange={handleInputChange}
                        placeholder="Saran untuk pengguna jika jawaban positif"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Penanganan</FormLabel>
                      <Textarea
                        name="penanganan"
                        value={formData.penanganan}
                        onChange={handleInputChange}
                        placeholder="Penanganan medis yang disarankan"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Rekomendasi</FormLabel>
                      <Textarea
                        name="rekomendasi"
                        value={formData.rekomendasi}
                        onChange={handleInputChange}
                        placeholder="Rekomendasi gaya hidup atau pengobatan"
                        rows={2}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            {/* Action Buttons */}
            <HStack w="full" justify="flex-end" spacing={3} pt={6} borderTop="1px" borderColor="gray.200">
              <Button onClick={onModalClose} variant="outline">
                Batal
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={submitting}
                loadingText="Menyimpan..."
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Pertanyaan
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  );
}