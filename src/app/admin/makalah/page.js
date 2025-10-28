"use client";

import { useState, useEffect } from 'react';
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
  Text,
  Alert,
  AlertIcon,
  Progress,
  Select,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { FiTrash2, FiDownload, FiFile, FiUpload, FiX, FiCheck, FiRefreshCw, FiDatabase } from 'react-icons/fi';

export default function MakalahManagement() {
  const [makalah, setMakalah] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'umum',
    author: '',
    institution: '',
    pdf_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const toast = useToast();

  const categories = [
    { value: 'umum', label: 'Kesehatan Umum', color: 'gray' },
    { value: 'jantung', label: 'Kardiologi', color: 'red' },
    { value: 'diabetes', label: 'Diabetes', color: 'orange' },
    { value: 'gaya-hidup', label: 'Gaya Hidup', color: 'green' },
    { value: 'nutrisi', label: 'Nutrisi', color: 'blue' },
    { value: 'mental', label: 'Kesehatan Mental', color: 'purple' },
    { value: 'anak', label: 'Kesehatan Anak', color: 'pink' },
  ];

  useEffect(() => {
    fetchMakalah();
  }, []);

  const fetchMakalah = async () => {
    setLoading(true);
    try {
      console.log('🔄 [DEBUG] Fetching makalah from database...');
      const { data, error } = await supabase
        .from('makalah')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [DEBUG] Database fetch error:', error);
        throw error;
      }
      
      console.log('✅ [DEBUG] Makalah loaded from database:', data);
      setMakalah(data || []);
      setDebugInfo(`✅ Loaded ${data?.length || 0} makalah from database`);
    } catch (error) {
      console.error('❌ [DEBUG] Fetch failed:', error);
      setDebugInfo(`❌ Fetch failed: ${error.message}`);
      toast({
        title: 'Error',
        description: 'Gagal memuat data makalah',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Error',
          description: 'Hanya file PDF yang diizinkan',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Ukuran file maksimal 10MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedFile(file);
      setFormData(prev => ({ ...prev, pdf_url: '' }));
    }
  };

  const uploadFileToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = `makalah/${fileName}`;

      console.log('🔄 [DEBUG] Uploading file to storage...', { fileName, filePath });
      setDebugInfo('Uploading file to storage...');

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ [DEBUG] Storage upload error:', error);
        throw error;
      }

      console.log('✅ [DEBUG] File uploaded to storage:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('🔗 [DEBUG] Public URL:', publicUrl);
      setDebugInfo(`✅ File uploaded: ${fileName}`);
      return publicUrl;
      
    } catch (error) {
      console.error('❌ [DEBUG] Storage upload failed:', error);
      setDebugInfo(`❌ Upload failed: ${error.message}`);
      throw error;
    }
  };

  const saveToDatabase = async (makalahData) => {
    try {
      console.log('💾 [DEBUG] Attempting to save to database:', makalahData);
      setDebugInfo('Saving to database...');

      // Coba INSERT dengan .select() untuk mendapatkan response
      const { data, error } = await supabase
        .from('makalah')
        .insert([makalahData])
        .select(); // ⬅️ INI PENTING untuk mendapatkan response

      if (error) {
        console.error('❌ [DEBUG] Database INSERT error:', error);
        console.error('❌ [DEBUG] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ [DEBUG] Database save successful:', data);
      setDebugInfo(`✅ Saved to database! ID: ${data[0]?.id}`);
      return data;
    } catch (error) {
      console.error('❌ [DEBUG] Database save failed:', error);
      setDebugInfo(`❌ Database save failed: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !formData.pdf_url) {
      toast({
        title: 'Error',
        description: 'Harap pilih file PDF atau masukkan URL PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Judul makalah harus diisi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setDebugInfo('Starting upload process...');

    try {
      let pdfUrl = formData.pdf_url;

      // STEP 1: Upload file jika ada
      if (selectedFile) {
        console.log('📁 [DEBUG] File selected, starting upload...');
        setUploadProgress(30);
        
        pdfUrl = await uploadFileToSupabase(selectedFile);
        setUploadProgress(70);
        console.log('✅ [DEBUG] File upload completed');
      } else {
        console.log('🔗 [DEBUG] Using external URL:', pdfUrl);
        setUploadProgress(50);
      }

      // STEP 2: Prepare data untuk database
      const makalahData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        author: formData.author.trim(),
        institution: formData.institution.trim(),
        pdf_url: pdfUrl,
        file_name: selectedFile ? selectedFile.name : 'External PDF',
        file_size: selectedFile ? selectedFile.size : null,
      };

      console.log('📦 [DEBUG] Data prepared for database:', makalahData);

      // STEP 3: Simpan ke database
      setUploadProgress(80);
      await saveToDatabase(makalahData);
      setUploadProgress(100);

      console.log('🎉 [DEBUG] Entire process completed successfully!');

      toast({
        title: 'Makalah berhasil ditambahkan!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form dan refresh data
      resetForm();
      setTimeout(() => {
        fetchMakalah();
      }, 1000);
      
    } catch (error) {
      console.error('💥 [DEBUG] Entire process failed:', error);
      
      let errorMessage = 'Terjadi kesalahan tidak terduga';
      
      if (error.message.includes('RLS')) {
        errorMessage = 'Error: Tidak memiliki izin (RLS Policy). Pastikan Anda login sebagai admin.';
      } else if (error.message.includes('null value')) {
        errorMessage = 'Error: Data tidak lengkap. Pastikan semua field required terisi.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Error: Masalah koneksi jaringan. Periksa koneksi internet Anda.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, filePath = null) => {
    if (!confirm('Apakah Anda yakin ingin menghapus makalah ini?')) return;

    try {
      console.log('🗑️ [DEBUG] Deleting makalah:', id);
      const { error: dbError } = await supabase
        .from('makalah')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      console.log('✅ [DEBUG] Database delete successful');

      toast({
        title: 'Makalah berhasil dihapus!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchMakalah();
    } catch (error) {
      console.error('❌ [DEBUG] Delete failed:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'umum',
      author: '',
      institution: '',
      pdf_url: ''
    });
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const getCategoryColor = (category) => {
    const foundCategory = categories.find(cat => cat.value === category);
    return foundCategory ? foundCategory.color : 'gray';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const testDatabaseInsert = async () => {
    try {
      setDebugInfo('Testing database INSERT...');
      
      const testData = {
        title: 'TEST - Makalah Test ' + Date.now(),
        description: 'Ini adalah data test',
        category: 'umum',
        author: 'Test Author',
        institution: 'Test Institution',
        pdf_url: 'https://example.com/test.pdf',
        file_name: 'test.pdf',
        file_size: 1000
      };

      console.log('🧪 [DEBUG] Test data:', testData);

      const { data, error } = await supabase
        .from('makalah')
        .insert([testData])
        .select();

      if (error) throw error;

      setDebugInfo(`✅ Test INSERT successful! ID: ${data[0]?.id}`);
      
      // Hapus data test setelah berhasil
      setTimeout(() => {
        supabase.from('makalah').delete().eq('id', data[0]?.id);
      }, 5000);
      
    } catch (error) {
      setDebugInfo(`❌ Test INSERT failed: ${error.message}`);
      console.error('❌ [DEBUG] Test INSERT error:', error);
    }
  };

  const checkTableExists = async () => {
    try {
      setDebugInfo('Checking if table exists...');
      const { data, error } = await supabase
        .from('makalah')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      setDebugInfo('✅ Table "makalah" exists and accessible');
    } catch (error) {
      setDebugInfo(`❌ Table check failed: ${error.message}`);
    }
  };

  return (
    <AdminLayout>
      <Box p={6}>
        <Heading mb={2}>Kelola Makalah</Heading>
        <Text color="gray.600" mb={6}>
          Tambah dan kelola makalah kesehatan untuk ditampilkan ke pengguna
        </Text>

        {/* Debug Info */}
        {debugInfo && (
          <Alert 
            status={debugInfo.includes('❌') ? 'error' : debugInfo.includes('✅') ? 'success' : 'info'} 
            mb={4} 
            borderRadius="md"
          >
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Debug Info:</Text>
              <Text fontSize="sm" fontFamily="monospace">{debugInfo}</Text>
            </Box>
          </Alert>
        )}

        {/* Test Buttons */}
        <HStack spacing={3} mb={4}>
          <Button 
            onClick={checkTableExists}
            size="sm" 
            variant="outline" 
            leftIcon={<FiDatabase />}
          >
            Check Table
          </Button>
          <Button 
            onClick={testDatabaseInsert}
            size="sm" 
            variant="outline" 
            leftIcon={<FiDatabase />}
          >
            Test INSERT
          </Button>
          <Button 
            onClick={fetchMakalah} 
            size="sm" 
            variant="outline" 
            leftIcon={<FiRefreshCw />}
          >
            Refresh Data
          </Button>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Add Makalah Form */}
          <GridItem>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Tambah Makalah Baru</Heading>
                
                <Alert status="info" mb={4} borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Upload file PDF atau gunakan URL PDF eksternal
                  </Text>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Judul Makalah</FormLabel>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Judul makalah kesehatan"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Deskripsi</FormLabel>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi singkat tentang makalah"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <Grid templateColumns="1fr 1fr" gap={4} w="full">
                      <FormControl>
                        <FormLabel>Penulis</FormLabel>
                        <Input
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Nama penulis"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Institusi</FormLabel>
                        <Input
                          value={formData.institution}
                          onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="Nama institusi"
                        />
                      </FormControl>
                    </Grid>

                    {/* File Upload Section */}
                    <FormControl>
                      <FormLabel>Upload PDF</FormLabel>
                      <VStack spacing={3} align="stretch">
                        {!selectedFile ? (
                          <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            p={6}
                            textAlign="center"
                            cursor="pointer"
                            _hover={{ borderColor: 'blue.500', bg: 'blue.50' }}
                            onClick={() => document.getElementById('file-input').click()}
                          >
                            <VStack spacing={2}>
                              <FiUpload size={24} color="#718096" />
                              <Text fontWeight="medium">Klik untuk upload PDF</Text>
                              <Text fontSize="sm" color="gray.500">
                                Max. 10MB • Format PDF
                              </Text>
                            </VStack>
                          </Box>
                        ) : (
                          <Box
                            border="1px solid"
                            borderColor="green.200"
                            borderRadius="md"
                            p={3}
                            bg="green.50"
                          >
                            <HStack justify="space-between">
                              <HStack>
                                <FiFile color="#38A169" />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {selectedFile.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {formatFileSize(selectedFile.size)}
                                  </Text>
                                </VStack>
                              </HStack>
                              <IconButton
                                icon={<FiX />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedFile(null)}
                                aria-label="Remove file"
                              />
                            </HStack>
                          </Box>
                        )}

                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          display="none"
                        />

                        {/* Progress Bar */}
                        {isUploading && (
                          <Box>
                            <Text fontSize="sm" mb={2}>
                              {uploadProgress < 100 ? 'Memproses...' : 'Selesai!'} {uploadProgress}%
                            </Text>
                            <Progress 
                              value={uploadProgress} 
                              colorScheme="blue" 
                              size="sm" 
                              borderRadius="full"
                            />
                          </Box>
                        )}
                      </VStack>
                    </FormControl>

                    {/* Divider */}
                    <HStack w="full" spacing={2}>
                      <Box flex={1} height="1px" bg="gray.200" />
                      <Text fontSize="sm" color="gray.500">ATAU</Text>
                      <Box flex={1} height="1px" bg="gray.200" />
                    </HStack>

                    {/* Alternative: PDF URL */}
                    <FormControl>
                      <FormLabel>Gunakan URL PDF</FormLabel>
                      <Input
                        value={formData.pdf_url}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, pdf_url: e.target.value }));
                          setSelectedFile(null);
                        }}
                        placeholder="https://example.com/makalah.pdf"
                        disabled={!!selectedFile}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      w="full"
                      isLoading={isUploading}
                      loadingText={isUploading ? "Memproses..." : "Menyimpan..."}
                      isDisabled={!formData.title || (!selectedFile && !formData.pdf_url)}
                      leftIcon={isUploading ? undefined : <FiCheck />}
                    >
                      {isUploading ? 'Memproses...' : 'Tambah Makalah'}
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
                <Heading size="md" mb={4}>
                  Daftar Makalah ({makalah.length})
                </Heading>
                
                {loading ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">Memuat makalah...</Text>
                  </Box>
                ) : makalah.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <FiFile size={48} color="#CBD5E0" />
                    <Text color="gray.500" mt={4}>
                      Belum ada makalah di database
                    </Text>
                    <Text fontSize="sm" color="gray.400" mt={2}>
                      File di storage ada, tapi data tidak tersimpan di database
                    </Text>
                  </Box>
                ) : (
                  <Box maxH="600px" overflowY="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Judul & Kategori</Th>
                          <Th>Info</Th>
                          <Th>Tanggal</Th>
                          <Th>Aksi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {makalah.map((item) => (
                          <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium" noOfLines={2}>
                                  {item.title}
                                </Text>
                                <Badge 
                                  colorScheme={getCategoryColor(item.category)}
                                  size="sm"
                                >
                                  {categories.find(cat => cat.value === item.category)?.label || item.category}
                                </Badge>
                                {item.description && (
                                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                    {item.description}
                                  </Text>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                {item.author && (
                                  <Text fontSize="xs" fontWeight="medium">
                                    {item.author}
                                  </Text>
                                )}
                                {item.institution && (
                                  <Text fontSize="xs" color="gray.600">
                                    {item.institution}
                                  </Text>
                                )}
                                <Text fontSize="xs" color="gray.500">
                                  {item.file_name || 'PDF'}
                                </Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Text fontSize="sm">
                                {formatDate(item.created_at)}
                              </Text>
                            </Td>
                            <Td>
                              <HStack>
                                <IconButton
                                  icon={<FiDownload />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                  onClick={() => window.open(item.pdf_url, '_blank')}
                                  aria-label="Download PDF"
                                />
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => handleDelete(item.id, item.pdf_url)}
                                  aria-label="Delete makalah"
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
      </Box>
    </AdminLayout>
  );
}