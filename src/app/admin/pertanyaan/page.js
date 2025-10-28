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
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { FiTrash2, FiHelpCircle, FiEdit } from 'react-icons/fi';

export default function PertanyaanManagement() {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [formData, setFormData] = useState({
    jenis_penyakit: '',
    pertanyaan_text: '',
    saran: '',
    indikasi: '',
    tingkat_keparahan: 'rendah'
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const penyakitOptions = [
    'Diabetes',
    'Hipertensi', 
    'Jantung',
    'Kolesterol',
    'Asma',
    'Gastrointestinal',
    'Mental Health',
    'Umum'
  ];

  const tingkatKeparahanOptions = [
    { value: 'rendah', label: 'Rendah', color: 'green' },
    { value: 'sedang', label: 'Sedang', color: 'orange' },
    { value: 'tinggi', label: 'Tinggi', color: 'red' }
  ];

  const fetchPertanyaan = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pertanyaan')
        .select('*')
        .order('jenis_penyakit', { ascending: true });
      
      if (error) throw error;
      setPertanyaan(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data pertanyaan',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.pertanyaan_text.trim()) {
        throw new Error('Pertanyaan tidak boleh kosong');
      }

      const { error } = await supabase
        .from('pertanyaan')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Pertanyaan berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        jenis_penyakit: '',
        pertanyaan_text: '',
        saran: '',
        indikasi: '',
        tingkat_keparahan: 'rendah'
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
    } finally {
      setSubmitting(false);
    }
  };

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

  const getTingkatKeparahanColor = (tingkat) => {
    const found = tingkatKeparahanOptions.find(opt => opt.value === tingkat);
    return found ? found.color : 'gray';
  };

  const getTingkatKeparahanLabel = (tingkat) => {
    const found = tingkatKeparahanOptions.find(opt => opt.value === tingkat);
    return found ? found.label : 'Tidak Diketahui';
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Pertanyaan Kesehatan</Heading>
            <Text color="gray.600">Kelola pertanyaan, saran, dan indikasi untuk sistem diagnosa</Text>
          </Box>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              Pertanyaan akan digunakan dalam sistem diagnosa kesehatan pengguna
            </Text>
          </Alert>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Add Pertanyaan Form */}
            <GridItem>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Tambah Pertanyaan Baru</Heading>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Jenis Penyakit</FormLabel>
                        <Select
                          value={formData.jenis_penyakit}
                          onChange={(e) => setFormData(prev => ({ ...prev, jenis_penyakit: e.target.value }))}
                          placeholder="Pilih jenis penyakit"
                        >
                          {penyakitOptions.map((penyakit) => (
                            <option key={penyakit} value={penyakit}>
                              {penyakit}
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

                      <FormControl>
                        <FormLabel>Tingkat Keparahan</FormLabel>
                        <Select
                          value={formData.tingkat_keparahan}
                          onChange={(e) => setFormData(prev => ({ ...prev, tingkat_keparahan: e.target.value }))}
                        >
                          {tingkatKeparahanOptions.map((tingkat) => (
                            <option key={tingkat.value} value={tingkat.value}>
                              {tingkat.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={submitting}
                        leftIcon={<FiHelpCircle />}
                      >
                        Tambah Pertanyaan
                      </Button>
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
                    Daftar Pertanyaan ({pertanyaan.length})
                  </Heading>
                  
                  {pertanyaan.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <FiHelpCircle size={48} color="#CBD5E0" />
                      <Text color="gray.500" mt={4}>
                        Belum ada pertanyaan
                      </Text>
                    </Box>
                  ) : (
                    <Box maxH="600px" overflowY="auto">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Penyakit</Th>
                            <Th>Pertanyaan</Th>
                            <Th>Keparahan</Th>
                            <Th>Aksi</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {pertanyaan.map((item) => (
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
                                  {item.saran && (
                                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                      💡 {item.saran}
                                    </Text>
                                  )}
                                </VStack>
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

          {/* Statistics by Disease Type */}
          {pertanyaan.length > 0 && (
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Statistik per Jenis Penyakit</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  {penyakitOptions.map((penyakit) => {
                    const count = pertanyaan.filter(p => p.jenis_penyakit === penyakit).length;
                    if (count === 0) return null;
                    
                    return (
                      <Card key={penyakit} variant="outline">
                        <CardBody>
                          <VStack spacing={2}>
                            <Badge colorScheme="blue">{penyakit}</Badge>
                            <Text fontSize="2xl" fontWeight="bold">{count}</Text>
                            <Text fontSize="sm" color="gray.600">Pertanyaan</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </AdminLayout>
  );
}