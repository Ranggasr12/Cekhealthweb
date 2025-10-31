"use client";

import { useState, useEffect, useCallback } from 'react';
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
  Select,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Spinner,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { FiTrash2, FiHelpCircle, FiPlus, FiX, FiSettings, FiEdit3, FiSearch, FiAlertTriangle } from 'react-icons/fi';

export default function PertanyaanManagement() {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [jenisPenyakit, setJenisPenyakit] = useState([]);
  const [formData, setFormData] = useState({
    jenis_penyakit: '',
    pertanyaan_text: '',
    tipe_pertanyaan: 'ya_tidak',
    keyword_jawaban: '',
    saran: '',
    indikasi: '',
    tingkat_keparahan: 'rendah',
    score: 1,
    is_positive_indicator: true
  });
  const [newPenyakit, setNewPenyakit] = useState('');
  const [penyakitForm, setPenyakitForm] = useState({
    min_nilai: 0,
    max_nilai: 100
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPenyakit, setLoadingPenyakit] = useState(false);
  const [updatingPenyakit, setUpdatingPenyakit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPenyakit, setFilterPenyakit] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  
  // Modals
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);
  const [editingPertanyaan, setEditingPertanyaan] = useState(null);
  const toast = useToast();

  const tingkatKeparahanOptions = [
    { value: 'rendah', label: 'Rendah', color: 'green', score: 1 },
    { value: 'sedang', label: 'Sedang', color: 'orange', score: 2 },
    { value: 'tinggi', label: 'Tinggi', color: 'red', score: 3 }
  ];

  const tipePertanyaanOptions = [
    { value: 'ya_tidak', label: 'Ya/Tidak' },
    { value: 'essay', label: 'Essay' }
  ];

  // Helper function untuk data default
  const getDefaultPenyakit = () => [
    { id: '1', nama_penyakit: 'Diabetes', min_nilai: 1, max_nilai: 11 },
    { id: '2', nama_penyakit: 'Hipertensi', min_nilai: 1, max_nilai: 15 },
    { id: '3', nama_penyakit: 'Jantung', min_nilai: 0, max_nilai: 25 },
    { id: '4', nama_penyakit: 'Kolesterol', min_nilai: 0, max_nilai: 18 },
    { id: '5', nama_penyakit: 'Asma', min_nilai: 0, max_nilai: 20 },
    { id: '6', nama_penyakit: 'Gastrointestinal', min_nilai: 0, max_nilai: 15 }
  ];

  // Fetch data pertanyaan - DIPERBAIKI
  const fetchPertanyaan = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching pertanyaan dari database...');
      const { data, error } = await supabase
        .from('pertanyaan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetch pertanyaan:', error);
        throw error;
      }
      
      console.log('✅ Pertanyaan berhasil difetch:', data?.length || 0, 'data');
      setPertanyaan(data || []);
    } catch (error) {
      console.error('❌ Error fetching pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pertanyaan: ' + (error.message || 'Unknown error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch data penyakit - VERSION IMPROVED DENGAN ERROR HANDLING
  const fetchJenisPenyakit = useCallback(async () => {
    setLoadingPenyakit(true);
    try {
      console.log('🔄 Fetching jenis penyakit dari database...');
      
      const { data, error } = await supabase
        .from('penyakit_config')
        .select('*')
        .order('nama_penyakit', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetch penyakit:', error);
        
        // Cek jenis error
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.code === '42P01') {
          console.log('ℹ️ Tabel penyakit_config belum tersedia, menggunakan data statis');
          
          // Tampilkan alert info untuk admin
          toast({
            title: 'Database Setup Required',
            description: 'Tabel penyakit_config perlu dibuat di Supabase. Gunakan data statis sementara.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
          });
          
          // Gunakan data statis
          setJenisPenyakit(getDefaultPenyakit());
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Jenis penyakit berhasil difetch:', data?.length || 0, 'data');
      
      // Jika berhasil dan ada data
      if (data && data.length > 0) {
        setJenisPenyakit(data);
      } else {
        // Jika tabel ada tapi kosong, gunakan data statis
        console.log('ℹ️ Tabel penyakit_config kosong, menggunakan data statis');
        setJenisPenyakit(getDefaultPenyakit());
        
        toast({
          title: 'Info',
          description: 'Tabel penyakit_config kosong. Gunakan data statis sementara.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching jenis penyakit:', error);
      
      // Fallback ke data statis
      setJenisPenyakit(getDefaultPenyakit());
      
      toast({
        title: 'Error',
        description: 'Gagal memuat data penyakit. Menggunakan data statis. Error: ' + (error.message || 'Unknown error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingPenyakit(false);
    }
  }, [toast]);

  // Fungsi untuk membuat tabel penyakit_config otomatis
  const createPenyakitConfigTable = async () => {
    try {
      console.log('🔄 Mencoba membuat tabel penyakit_config...');
      
      // Coba insert data default
      const { error } = await supabase
        .from('penyakit_config')
        .insert([
          { nama_penyakit: 'Diabetes', min_nilai: 1, max_nilai: 11 },
          { nama_penyakit: 'Hipertensi', min_nilai: 1, max_nilai: 15 },
          { nama_penyakit: 'Jantung', min_nilai: 0, max_nilai: 25 },
          { nama_penyakit: 'Kolesterol', min_nilai: 0, max_nilai: 18 }
        ]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log('✅ Data penyakit sudah ada');
        } else {
          console.error('❌ Error creating table:', error);
          throw error;
        }
      } else {
        console.log('✅ Tabel penyakit_config berhasil dibuat dengan data default');
      }
    } catch (error) {
      console.error('❌ Error creating penyakit_config table:', error);
      throw error;
    }
  };

  // Initialize data saat component mount
  useEffect(() => {
    console.log('🎯 Initializing Pertanyaan Management...');
    fetchPertanyaan();
    fetchJenisPenyakit();
  }, [fetchPertanyaan, fetchJenisPenyakit]);

  // Auto-create table jika diperlukan
  useEffect(() => {
    const initializeDatabase = async () => {
      // Cek jika tidak ada data penyakit
      if (jenisPenyakit.length === 0 && !loadingPenyakit) {
        try {
          await createPenyakitConfigTable();
          // Refresh data setelah create
          setTimeout(() => fetchJenisPenyakit(), 1000);
        } catch (error) {
          console.log('Tidak dapat membuat tabel, menggunakan data statis');
        }
      }
    };

    initializeDatabase();
  }, [jenisPenyakit.length, loadingPenyakit, fetchJenisPenyakit]);

  useEffect(() => {
    const tingkat = tingkatKeparahanOptions.find(t => t.value === formData.tingkat_keparahan);
    if (tingkat) {
      setFormData(prev => ({ ...prev, score: tingkat.score }));
    }
  }, [formData.tingkat_keparahan]);

  // Filter pertanyaan
  const filteredPertanyaan = pertanyaan.filter(item => {
    const matchesSearch = item.pertanyaan_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.saran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.indikasi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPenyakit = filterPenyakit ? item.jenis_penyakit === filterPenyakit : true;
    const matchesTipe = filterTipe ? item.tipe_pertanyaan === filterTipe : true;
    
    return matchesSearch && matchesPenyakit && matchesTipe;
  });

  // Tambah penyakit baru - DIPERBAIKI
  const handleAddPenyakit = async () => {
    if (!newPenyakit.trim()) {
      toast({
        title: 'Error',
        description: 'Nama penyakit tidak boleh kosong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi nama penyakit unik
    const isDuplicate = jenisPenyakit.some(
      p => p.nama_penyakit.toLowerCase() === newPenyakit.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      toast({
        title: 'Error',
        description: 'Jenis penyakit sudah ada',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi rentang nilai
    const min = parseInt(penyakitForm.min_nilai) || 0;
    const max = parseInt(penyakitForm.max_nilai) || 100;
    
    if (min < 0) {
      toast({
        title: 'Error',
        description: 'Nilai minimum tidak boleh kurang dari 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (max <= min) {
      toast({
        title: 'Error',
        description: 'Nilai maksimum harus lebih besar dari nilai minimum',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('🔄 Menambahkan penyakit baru:', newPenyakit);
      
      const { data, error } = await supabase
        .from('penyakit_config')
        .insert([{ 
          nama_penyakit: newPenyakit.trim(),
          min_nilai: min,
          max_nilai: max
        }])
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Jenis penyakit sudah ada');
        }
        if (error.code === '42P01') {
          throw new Error('Tabel penyakit_config belum dibuat. Silakan buat tabel terlebih dahulu di Supabase.');
        }
        throw error;
      }

      toast({
        title: 'Berhasil',
        description: `Penyakit "${newPenyakit}" berhasil ditambahkan`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewPenyakit('');
      setPenyakitForm({ min_nilai: 0, max_nilai: 100 });
      onClose();
      fetchJenisPenyakit();
      
    } catch (error) {
      console.error('❌ Error adding penyakit:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal menambahkan penyakit. Pastikan tabel sudah dibuat di Supabase.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Tambah pertanyaan - DIPERBAIKI
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.pertanyaan_text.trim()) {
        throw new Error('Pertanyaan tidak boleh kosong');
      }

      if (!formData.jenis_penyakit) {
        throw new Error('Jenis penyakit harus dipilih');
      }

      // Validasi untuk pertanyaan essay harus ada keyword
      if (formData.tipe_pertanyaan === 'essay' && !formData.keyword_jawaban.trim()) {
        throw new Error('Pertanyaan essay harus memiliki keyword jawaban');
      }

      const finalScore = formData.is_positive_indicator ? formData.score : -formData.score;

      console.log('🔄 Menambahkan pertanyaan baru:', {
        jenis_penyakit: formData.jenis_penyakit,
        tipe_pertanyaan: formData.tipe_pertanyaan
      });

      const { error } = await supabase
        .from('pertanyaan')
        .insert([{
          jenis_penyakit: formData.jenis_penyakit,
          pertanyaan_text: formData.pertanyaan_text.trim(),
          tipe_pertanyaan: formData.tipe_pertanyaan,
          keyword_jawaban: formData.tipe_pertanyaan === 'essay' ? formData.keyword_jawaban.trim() : null,
          saran: formData.saran.trim(),
          indikasi: formData.indikasi.trim(),
          tingkat_keparahan: formData.tingkat_keparahan,
          score: finalScore,
          is_positive_indicator: formData.is_positive_indicator
        }]);

      if (error) {
        console.error('❌ Error insert pertanyaan:', error);
        
        if (error.code === '42P01') {
          throw new Error('Tabel pertanyaan belum dibuat. Silakan jalankan SQL schema terlebih dahulu.');
        }
        throw error;
      }

      toast({
        title: 'Pertanyaan berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        jenis_penyakit: '',
        pertanyaan_text: '',
        tipe_pertanyaan: 'ya_tidak',
        keyword_jawaban: '',
        saran: '',
        indikasi: '',
        tingkat_keparahan: 'rendah',
        score: 1,
        is_positive_indicator: true
      });
      fetchPertanyaan();
    } catch (error) {
      console.error('❌ Error adding pertanyaan:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit pertanyaan
  const handleEditPertanyaan = (pertanyaanItem) => {
    setEditingPertanyaan(pertanyaanItem);
    setFormData({
      jenis_penyakit: pertanyaanItem.jenis_penyakit,
      pertanyaan_text: pertanyaanItem.pertanyaan_text,
      tipe_pertanyaan: pertanyaanItem.tipe_pertanyaan || 'ya_tidak',
      keyword_jawaban: pertanyaanItem.keyword_jawaban || '',
      saran: pertanyaanItem.saran || '',
      indikasi: pertanyaanItem.indikasi || '',
      tingkat_keparahan: pertanyaanItem.tingkat_keparahan,
      score: Math.abs(pertanyaanItem.score),
      is_positive_indicator: pertanyaanItem.score > 0
    });
    onEditOpen();
  };

  // Update pertanyaan
  const handleUpdatePertanyaan = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const finalScore = formData.is_positive_indicator ? formData.score : -formData.score;

      const { error } = await supabase
        .from('pertanyaan')
        .update({
          jenis_penyakit: formData.jenis_penyakit,
          pertanyaan_text: formData.pertanyaan_text.trim(),
          tipe_pertanyaan: formData.tipe_pertanyaan,
          keyword_jawaban: formData.tipe_pertanyaan === 'essay' ? formData.keyword_jawaban.trim() : null,
          saran: formData.saran.trim(),
          indikasi: formData.indikasi.trim(),
          tingkat_keparahan: formData.tingkat_keparahan,
          score: finalScore,
          is_positive_indicator: formData.is_positive_indicator,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPertanyaan.id);

      if (error) throw error;

      toast({
        title: 'Pertanyaan berhasil diupdate!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onEditClose();
      setEditingPertanyaan(null);
      setFormData({
        jenis_penyakit: '',
        pertanyaan_text: '',
        tipe_pertanyaan: 'ya_tidak',
        keyword_jawaban: '',
        saran: '',
        indikasi: '',
        tingkat_keparahan: 'rendah',
        score: 1,
        is_positive_indicator: true
      });
      fetchPertanyaan();
    } catch (error) {
      console.error('Error updating pertanyaan:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus pertanyaan
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) return;

    try {
      const { error } = await supabase
        .from('pertanyaan')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Pertanyaan berhasil dihapus!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchPertanyaan();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Hapus penyakit dengan validasi
  const handleDeletePenyakit = async (id, namaPenyakit) => {
    const pertanyaanTerpakai = pertanyaan.filter(p => p.jenis_penyakit === namaPenyakit);
    
    if (pertanyaanTerpakai.length > 0) {
      toast({
        title: 'Tidak dapat menghapus',
        description: `Terdapat ${pertanyaanTerpakai.length} pertanyaan yang menggunakan penyakit "${namaPenyakit}". Hapus pertanyaan tersebut terlebih dahulu.`,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus penyakit "${namaPenyakit}"?`)) return;

    try {
      const { error } = await supabase
        .from('penyakit_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: `Penyakit "${namaPenyakit}" berhasil dihapus`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchJenisPenyakit();
      
      // Reset form jika penyakit yang dihapus sedang dipilih
      if (formData.jenis_penyakit === namaPenyakit) {
        setFormData(prev => ({ ...prev, jenis_penyakit: '' }));
      }
    } catch (error) {
      console.error('Error deleting penyakit:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal menghapus penyakit',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getTingkatKeparahanColor = (tingkat) => {
    const found = tingkatKeparahanOptions.find(opt => opt.value === tingkat);
    return found ? found.color : 'gray';
  };

  const getTingkatKeparahanLabel = (tingkat) => {
    const found = tingkatKeparahanOptions.find(opt => opt.value === tingkat);
    return found ? found.label : 'Tidak Diketahui';
  };

  const getTipePertanyaanLabel = (tipe) => {
    const found = tipePertanyaanOptions.find(opt => opt.value === tipe);
    return found ? found.label : 'Tidak Diketahui';
  };

  // Hitung statistik
  const calculateStats = () => {
    const stats = {
      total: pertanyaan.length,
      ya_tidak: pertanyaan.filter(p => p.tipe_pertanyaan === 'ya_tidak').length,
      essay: pertanyaan.filter(p => p.tipe_pertanyaan === 'essay').length,
      byPenyakit: {}
    };

    jenisPenyakit.forEach(penyakit => {
      stats.byPenyakit[penyakit.nama_penyakit] = pertanyaan.filter(p => p.jenis_penyakit === penyakit.nama_penyakit).length;
    });

    return stats;
  };

  const stats = calculateStats();

  // Fungsi untuk refresh data
  const handleRefreshData = () => {
    fetchPertanyaan();
    fetchJenisPenyakit();
    toast({
      title: 'Data Diperbarui',
      description: 'Data pertanyaan dan penyakit telah diperbarui',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          {/* Header dengan Refresh Button */}
          <HStack justify="space-between">
            <Box>
              <Heading size="lg" mb={2}>Kelola Pertanyaan Kesehatan</Heading>
              <Text color="gray.600">Kelola pertanyaan, scoring, dan sistem diagnosa kesehatan</Text>
            </Box>
            <Button
              onClick={handleRefreshData}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Refresh Data
            </Button>
          </HStack>

          {/* Database Status Alert */}
          {jenisPenyakit.length === 0 && !loadingPenyakit && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold">⚠️ Database Setup Required</Text>
                <Text fontSize="sm">Tabel penyakit_config belum tersedia. Sistem menggunakan data statis sementara.</Text>
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  mt={2}
                  onClick={() => window.open('https://supabase.com/dashboard/project/' + process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID + '/sql', '_blank')}
                >
                  Buat Tabel di Supabase
                </Button>
              </VStack>
            </Alert>
          )}

          {/* Statistik */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">{stats.total}</Text>
                <Text color="gray.600">Total Pertanyaan</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">{stats.ya_tidak}</Text>
                <Text color="gray.600">Pertanyaan Ya/Tidak</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">{stats.essay}</Text>
                <Text color="gray.600">Pertanyaan Essay</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">{jenisPenyakit.length}</Text>
                <Text color="gray.600">Jenis Penyakit</Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Tabs variant="enclosed">
            <TabList>
              <Tab>Kelola Pertanyaan</Tab>
              <Tab>Kelola Penyakit</Tab>
            </TabList>

            <TabPanels>
              {/* Panel Pertanyaan */}
              <TabPanel>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                  {/* Add Pertanyaan Form */}
                  <GridItem>
                    <Card>
                      <CardBody>
                        <Heading size="md" mb={4}>
                          {editingPertanyaan ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                        </Heading>
                        <form onSubmit={editingPertanyaan ? handleUpdatePertanyaan : handleSubmit}>
                          <VStack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Jenis Penyakit</FormLabel>
                              <Select
                                value={formData.jenis_penyakit}
                                onChange={(e) => setFormData(prev => ({ ...prev, jenis_penyakit: e.target.value }))}
                                placeholder="Pilih jenis penyakit"
                              >
                                {jenisPenyakit.map((penyakit) => (
                                  <option key={penyakit.id} value={penyakit.nama_penyakit}>
                                    {penyakit.nama_penyakit}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>Tipe Pertanyaan</FormLabel>
                              <Select
                                value={formData.tipe_pertanyaan}
                                onChange={(e) => setFormData(prev => ({ ...prev, tipe_pertanyaan: e.target.value }))}
                              >
                                {tipePertanyaanOptions.map((tipe) => (
                                  <option key={tipe.value} value={tipe.value}>
                                    {tipe.label}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>Pertanyaan</FormLabel>
                              <Textarea
                                value={formData.pertanyaan_text}
                                onChange={(e) => setFormData(prev => ({ ...prev, pertanyaan_text: e.target.value }))}
                                placeholder="Teks pertanyaan untuk user"
                                rows={3}
                              />
                            </FormControl>

                            {formData.tipe_pertanyaan === 'essay' && (
                              <FormControl isRequired>
                                <FormLabel>Keyword Jawaban</FormLabel>
                                <Input
                                  value={formData.keyword_jawaban}
                                  onChange={(e) => setFormData(prev => ({ ...prev, keyword_jawaban: e.target.value }))}
                                  placeholder="pisahkan dengan koma, contoh: lemas,lelah,pusing"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                  Kata kunci yang dicari dalam jawaban essay (pisahkan dengan koma)
                                </Text>
                              </FormControl>
                            )}

                            <FormControl>
                              <FormLabel>Tipe Indikator</FormLabel>
                              <HStack spacing={4}>
                                <HStack>
                                  <Switch
                                    isChecked={formData.is_positive_indicator}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_positive_indicator: e.target.checked }))}
                                    colorScheme="green"
                                  />
                                  <Text fontSize="sm">
                                    {formData.is_positive_indicator ? 'Indikator Positif' : 'Indikator Negatif'}
                                  </Text>
                                </HStack>
                                <Badge colorScheme={formData.is_positive_indicator ? 'green' : 'red'} fontSize="xs">
                                  {formData.is_positive_indicator ? 'YA menambah score' : 'YA mengurangi score'}
                                </Badge>
                              </HStack>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>Score</FormLabel>
                              <NumberInput
                                value={formData.score}
                                onChange={(value) => setFormData(prev => ({ ...prev, score: parseInt(value) || 1 }))}
                                min={1}
                                max={10}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Tingkat Keparahan</FormLabel>
                              <Select
                                value={formData.tingkat_keparahan}
                                onChange={(e) => setFormData(prev => ({ ...prev, tingkat_keparahan: e.target.value }))}
                              >
                                {tingkatKeparahanOptions.map((tingkat) => (
                                  <option key={tingkat.value} value={tingkat.value}>
                                    {tingkat.label} (Score: {tingkat.score})
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Saran</FormLabel>
                              <Textarea
                                value={formData.saran}
                                onChange={(e) => setFormData(prev => ({ ...prev, saran: e.target.value }))}
                                placeholder="Saran untuk user berdasarkan jawaban"
                                rows={2}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Indikasi</FormLabel>
                              <Textarea
                                value={formData.indikasi}
                                onChange={(e) => setFormData(prev => ({ ...prev, indikasi: e.target.value }))}
                                placeholder="Indikasi kesehatan (untuk analisis internal)"
                                rows={2}
                              />
                            </FormControl>

                            <Button
                              type="submit"
                              colorScheme="blue"
                              w="full"
                              isLoading={submitting}
                              loadingText={editingPertanyaan ? "Mengupdate..." : "Menambahkan..."}
                              leftIcon={<FiHelpCircle />}
                            >
                              {editingPertanyaan ? 'Update Pertanyaan' : 'Tambah Pertanyaan'}
                            </Button>

                            {editingPertanyaan && (
                              <Button
                                w="full"
                                variant="outline"
                                onClick={() => {
                                  onEditClose();
                                  setEditingPertanyaan(null);
                                  setFormData({
                                    jenis_penyakit: '',
                                    pertanyaan_text: '',
                                    tipe_pertanyaan: 'ya_tidak',
                                    keyword_jawaban: '',
                                    saran: '',
                                    indikasi: '',
                                    tingkat_keparahan: 'rendah',
                                    score: 1,
                                    is_positive_indicator: true
                                  });
                                }}
                              >
                                Batal Edit
                              </Button>
                            )}
                          </VStack>
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>

                  {/* Pertanyaan List */}
                  <GridItem>
                    <Card>
                      <CardBody>
                        <Heading size="md" mb={4}>
                          Daftar Pertanyaan ({filteredPertanyaan.length} dari {pertanyaan.length})
                        </Heading>
                        
                        {/* Search and Filter */}
                        <HStack mb={4} spacing={4}>
                          <InputGroup>
                            <InputLeftElement>
                              <FiSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                              placeholder="Cari pertanyaan, saran, atau indikasi..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </InputGroup>
                          <Select
                            placeholder="Filter penyakit"
                            value={filterPenyakit}
                            onChange={(e) => setFilterPenyakit(e.target.value)}
                            maxW="200px"
                          >
                            {jenisPenyakit.map((penyakit) => (
                              <option key={penyakit.id} value={penyakit.nama_penyakit}>
                                {penyakit.nama_penyakit}
                              </option>
                            ))}
                          </Select>
                          <Select
                            placeholder="Filter tipe"
                            value={filterTipe}
                            onChange={(e) => setFilterTipe(e.target.value)}
                            maxW="150px"
                          >
                            <option value="">Semua Tipe</option>
                            {tipePertanyaanOptions.map((tipe) => (
                              <option key={tipe.value} value={tipe.value}>
                                {tipe.label}
                              </option>
                            ))}
                          </Select>
                        </HStack>
                        
                        {loading ? (
                          <Box textAlign="center" py={8}>
                            <Spinner size="lg" />
                            <Text color="gray.500" mt={4}>
                              Memuat data pertanyaan...
                            </Text>
                          </Box>
                        ) : filteredPertanyaan.length === 0 ? (
                          <Box textAlign="center" py={8}>
                            <FiHelpCircle size={48} color="#CBD5E0" />
                            <Text color="gray.500" mt={4}>
                              {pertanyaan.length === 0 ? 'Belum ada pertanyaan' : 'Tidak ada pertanyaan yang sesuai dengan filter'}
                            </Text>
                            {pertanyaan.length === 0 && (
                              <Button mt={4} colorScheme="blue" onClick={handleRefreshData}>
                                Coba Muat Ulang
                              </Button>
                            )}
                          </Box>
                        ) : (
                          <Box maxH="600px" overflowY="auto">
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Penyakit</Th>
                                  <Th>Pertanyaan</Th>
                                  <Th>Tipe</Th>
                                  <Th>Score</Th>
                                  <Th>Keparahan</Th>
                                  <Th>Aksi</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {filteredPertanyaan.map((item) => (
                                  <Tr key={item.id}>
                                    <Td>
                                      <Badge colorScheme="blue" fontSize="xs">
                                        {item.jenis_penyakit}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <VStack align="start" spacing={1}>
                                        <Text noOfLines={2} maxW="300px" fontSize="sm">
                                          {item.pertanyaan_text}
                                        </Text>
                                        {item.tipe_pertanyaan === 'essay' && item.keyword_jawaban && (
                                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                            Keyword: {item.keyword_jawaban}
                                          </Text>
                                        )}
                                        {item.saran && (
                                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                            Saran: {item.saran}
                                          </Text>
                                        )}
                                        <Badge 
                                          colorScheme={item.score > 0 ? 'green' : 'red'} 
                                          fontSize="xs"
                                        >
                                          {item.score > 0 ? 'Positif' : 'Negatif'}
                                        </Badge>
                                      </VStack>
                                    </Td>
                                    <Td>
                                      <Badge 
                                        colorScheme={item.tipe_pertanyaan === 'essay' ? 'purple' : 'green'}
                                        fontSize="xs"
                                      >
                                        {getTipePertanyaanLabel(item.tipe_pertanyaan)}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge 
                                        colorScheme={item.score > 0 ? 'green' : 'red'}
                                        fontSize="sm"
                                      >
                                        {item.score > 0 ? '+' : ''}{item.score}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge 
                                        colorScheme={getTingkatKeparahanColor(item.tingkat_keparahan)}
                                        fontSize="xs"
                                      >
                                        {getTingkatKeparahanLabel(item.tingkat_keparahan)}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <HStack>
                                        <IconButton
                                          icon={<FiEdit3 />}
                                          size="sm"
                                          colorScheme="blue"
                                          variant="ghost"
                                          onClick={() => handleEditPertanyaan(item)}
                                          aria-label="Edit pertanyaan"
                                        />
                                        <IconButton
                                          icon={<FiTrash2 />}
                                          size="sm"
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={() => handleDelete(item.id)}
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
                  </GridItem>
                </Grid>
              </TabPanel>

              {/* Panel Penyakit */}
              <TabPanel>
                <Card>
                  <CardBody>
                    <HStack justify="space-between" mb={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md">Kelola Jenis Penyakit & Rentang Nilai</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {jenisPenyakit.length} penyakit • {pertanyaan.length} pertanyaan
                        </Text>
                      </VStack>
                      <Button
                        leftIcon={<FiPlus />}
                        colorScheme="green"
                        size="sm"
                        onClick={onOpen}
                      >
                        Tambah Penyakit
                      </Button>
                    </HStack>

                    {loadingPenyakit ? (
                      <Box textAlign="center" py={4}>
                        <Spinner size="lg" />
                        <Text mt={2} color="gray.500">Memuat data penyakit...</Text>
                      </Box>
                    ) : jenisPenyakit.length === 0 ? (
                      <Box textAlign="center" py={4}>
                        <FiHelpCircle size={48} color="#CBD5E0" />
                        <Text color="gray.500" mt={2}>Belum ada jenis penyakit</Text>
                        <Button 
                          mt={2} 
                          colorScheme="blue" 
                          size="sm"
                          onClick={onOpen}
                        >
                          Tambah Penyakit Pertama
                        </Button>
                      </Box>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {jenisPenyakit.map((penyakit) => {
                          const totalPertanyaan = pertanyaan.filter(p => p.jenis_penyakit === penyakit.nama_penyakit).length;
                          
                          return (
                            <Card key={penyakit.id} variant="outline">
                              <CardBody>
                                <VStack spacing={3} align="stretch">
                                  <HStack justify="space-between">
                                    <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>
                                      {penyakit.nama_penyakit}
                                    </Badge>
                                    <IconButton
                                      icon={<FiX />}
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => handleDeletePenyakit(penyakit.id, penyakit.nama_penyakit)}
                                      aria-label="Hapus penyakit"
                                    />
                                  </HStack>
                                  
                                  <VStack spacing={2} align="start">
                                    <HStack spacing={4} width="full">
                                      <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color="gray.500">Rentang Nilai</Text>
                                        <Text fontSize="sm" fontWeight="bold">
                                          {penyakit.min_nilai || 0} - {penyakit.max_nilai || 100}
                                        </Text>
                                      </VStack>
                                      <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color="gray.500">Pertanyaan</Text>
                                        <Text fontSize="sm" fontWeight="bold">
                                          {totalPertanyaan}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  </VStack>

                                  <Box>
                                    <HStack justify="space-between" mb={1}>
                                      <Text fontSize="xs" color="gray.600">Rentang Diagnosa:</Text>
                                      <Text fontSize="xs" fontWeight="bold">
                                        {penyakit.min_nilai || 0} - {penyakit.max_nilai || 100}
                                      </Text>
                                    </HStack>
                                  </Box>
                                </VStack>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>

      {/* Modal Tambah Penyakit */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Jenis Penyakit Baru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Penyakit</FormLabel>
                <Input
                  value={newPenyakit}
                  onChange={(e) => setNewPenyakit(e.target.value)}
                  placeholder="Masukkan nama penyakit baru"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nilai Minimum</FormLabel>
                <NumberInput
                  value={penyakitForm.min_nilai}
                  onChange={(value) => setPenyakitForm(prev => ({ ...prev, min_nilai: parseInt(value) || 0 }))}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Nilai Maksimum</FormLabel>
                <NumberInput
                  value={penyakitForm.max_nilai}
                  onChange={(value) => setPenyakitForm(prev => ({ ...prev, max_nilai: parseInt(value) || 100 }))}
                  min={1}
                  max={1000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Batal
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleAddPenyakit}
              leftIcon={<FiPlus />}
            >
              Tambah Penyakit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Edit Pertanyaan */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Pertanyaan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Jenis Penyakit</FormLabel>
                <Select
                  value={formData.jenis_penyakit}
                  onChange={(e) => setFormData(prev => ({ ...prev, jenis_penyakit: e.target.value }))}
                >
                  {jenisPenyakit.map((penyakit) => (
                    <option key={penyakit.id} value={penyakit.nama_penyakit}>
                      {penyakit.nama_penyakit}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tipe Pertanyaan</FormLabel>
                <Select
                  value={formData.tipe_pertanyaan}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipe_pertanyaan: e.target.value }))}
                >
                  {tipePertanyaanOptions.map((tipe) => (
                    <option key={tipe.value} value={tipe.value}>
                      {tipe.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Pertanyaan</FormLabel>
                <Textarea
                  value={formData.pertanyaan_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, pertanyaan_text: e.target.value }))}
                  placeholder="Teks pertanyaan untuk user"
                  rows={3}
                />
              </FormControl>

              {formData.tipe_pertanyaan === 'essay' && (
                <FormControl isRequired>
                  <FormLabel>Keyword Jawaban</FormLabel>
                  <Input
                    value={formData.keyword_jawaban}
                    onChange={(e) => setFormData(prev => ({ ...prev, keyword_jawaban: e.target.value }))}
                    placeholder="pisahkan dengan koma, contoh: lemas,lelah,pusing"
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Tipe Indikator</FormLabel>
                <HStack spacing={4}>
                  <HStack>
                    <Switch
                      isChecked={formData.is_positive_indicator}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_positive_indicator: e.target.checked }))}
                      colorScheme="green"
                    />
                    <Text fontSize="sm">
                      {formData.is_positive_indicator ? 'Indikator Positif' : 'Indikator Negatif'}
                    </Text>
                  </HStack>
                  <Badge colorScheme={formData.is_positive_indicator ? 'green' : 'red'} fontSize="xs">
                    {formData.is_positive_indicator ? 'YA menambah score' : 'YA mengurangi score'}
                  </Badge>
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Score</FormLabel>
                <NumberInput
                  value={formData.score}
                  onChange={(value) => setFormData(prev => ({ ...prev, score: parseInt(value) || 1 }))}
                  min={1}
                  max={10}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Tingkat Keparahan</FormLabel>
                <Select
                  value={formData.tingkat_keparahan}
                  onChange={(e) => setFormData(prev => ({ ...prev, tingkat_keparahan: e.target.value }))}
                >
                  {tingkatKeparahanOptions.map((tingkat) => (
                    <option key={tingkat.value} value={tingkat.value}>
                      {tingkat.label} (Score: {tingkat.score})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Saran</FormLabel>
                <Textarea
                  value={formData.saran}
                  onChange={(e) => setFormData(prev => ({ ...prev, saran: e.target.value }))}
                  placeholder="Saran untuk user berdasarkan jawaban"
                  rows={2}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Indikasi</FormLabel>
                <Textarea
                  value={formData.indikasi}
                  onChange={(e) => setFormData(prev => ({ ...prev, indikasi: e.target.value }))}
                  placeholder="Indikasi kesehatan (untuk analisis internal)"
                  rows={2}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Batal
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdatePertanyaan}
              isLoading={submitting}
            >
              Update Pertanyaan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}