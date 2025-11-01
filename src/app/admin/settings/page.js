"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Switch,
  Card,
  CardBody,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';

// Default settings
const defaultSettings = {
  site_title: 'CekHealth',
  site_description: 'Sistem Diagnosa Kesehatan Online',
  maintenance_mode: false,
  max_questions_per_user: 50,
  contact_email: '',
  admin_notification: true,
};

export default function Settings() {
  const [appSettings, setAppSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Firestore document reference untuk settings
  const settingsDocRef = doc(db, 'app_settings', 'global_settings');

  // Fetch settings dengan useCallback untuk menghindari infinite loop
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const settingsDoc = await getDoc(settingsDocRef);

      if (settingsDoc.exists()) {
        const settingsData = settingsDoc.data();
        setAppSettings({
          ...defaultSettings,
          ...settingsData
        });
      } else {
        // Jika dokumen belum ada, gunakan default settings
        console.log('Settings document not found, using defaults');
        setAppSettings(defaultSettings);
        
        // Buat dokumen settings dengan nilai default
        await setDoc(settingsDocRef, {
          ...defaultSettings,
          created_at: new Date(),
          updated_at: new Date()
        });
        
        toast({
          title: 'Settings Created',
          description: 'Default settings created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Gunakan default settings jika error
      setAppSettings(defaultSettings);
      toast({
        title: 'Info',
        description: 'Menggunakan pengaturan default',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(settingsDocRef, {
        ...appSettings,
        updated_at: new Date()
      });

      toast({
        title: 'Berhasil',
        description: 'Pengaturan berhasil disimpan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Jika dokumen belum ada, buat baru
      if (error.code === 'not-found') {
        try {
          await setDoc(settingsDocRef, {
            ...appSettings,
            created_at: new Date(),
            updated_at: new Date()
          });
          
          toast({
            title: 'Berhasil',
            description: 'Pengaturan berhasil dibuat',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } catch (createError) {
          console.error('Error creating settings:', createError);
          toast({
            title: 'Error',
            description: 'Gagal membuat pengaturan: ' + createError.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Gagal menyimpan pengaturan: ' + error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAppSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (field, isChecked) => {
    setAppSettings(prev => ({
      ...prev,
      [field]: isChecked
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan pengaturan ke default?')) {
      setAppSettings(defaultSettings);
      toast({
        title: 'Berhasil',
        description: 'Pengaturan telah direset ke default',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const exportSettings = () => {
    const settingsJson = JSON.stringify(appSettings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cekhealth-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Berhasil',
      description: 'Pengaturan berhasil di-export',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setAppSettings(prev => ({
          ...prev,
          ...importedSettings
        }));
        
        toast({
          title: 'Berhasil',
          description: 'Pengaturan berhasil di-import',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'File tidak valid',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input file
    event.target.value = '';
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat pengaturan...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Pengaturan Aplikasi</Heading>
            <Text color="gray.600">Kelola pengaturan umum aplikasi CekHealth</Text>
          </Box>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              Perubahan pengaturan akan mempengaruhi seluruh pengguna aplikasi
            </Text>
          </Alert>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* General Settings */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Pengaturan Umum</Heading>
                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel>Judul Situs</FormLabel>
                    <Input
                      value={appSettings.site_title}
                      onChange={(e) => handleInputChange('site_title', e.target.value)}
                      placeholder="CekHealth"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Deskripsi Situs</FormLabel>
                    <Textarea
                      value={appSettings.site_description}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      placeholder="Sistem Diagnosa Kesehatan Online"
                      rows={3}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email Kontak</FormLabel>
                    <Input
                      type="email"
                      value={appSettings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="admin@cekhealth.com"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Maksimal Pertanyaan per User</FormLabel>
                    <Input
                      type="number"
                      value={appSettings.max_questions_per_user}
                      onChange={(e) => handleInputChange('max_questions_per_user', parseInt(e.target.value) || 0)}
                      min={1}
                      max={100}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* System Settings */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Pengaturan Sistem</Heading>
                <VStack spacing={6}>
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <FormLabel htmlFor="maintenance-mode" mb={0}>
                        Maintenance Mode
                      </FormLabel>
                      <Text fontSize="sm" color="gray.600">
                        Nonaktifkan akses pengguna ke aplikasi
                      </Text>
                    </Box>
                    <Switch
                      id="maintenance-mode"
                      isChecked={appSettings.maintenance_mode}
                      onChange={(e) => handleSwitchChange('maintenance_mode', e.target.checked)}
                      colorScheme="red"
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <FormLabel htmlFor="admin-notification" mb={0}>
                        Notifikasi Admin
                      </FormLabel>
                      <Text fontSize="sm" color="gray.600">
                        Aktifkan notifikasi untuk admin
                      </Text>
                    </Box>
                    <Switch
                      id="admin-notification"
                      isChecked={appSettings.admin_notification}
                      onChange={(e) => handleSwitchChange('admin_notification', e.target.checked)}
                      colorScheme="blue"
                    />
                  </FormControl>

                  <Divider />

                  {/* Import/Export Section */}
                  <Box w="full">
                    <Heading size="sm" color="blue.600" mb={4}>
                      Backup & Restore
                    </Heading>
                    <HStack spacing={3}>
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        onClick={exportSettings}
                        flex={1}
                      >
                        Export Settings
                      </Button>
                      <Input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        display="none"
                        id="import-settings"
                      />
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => document.getElementById('import-settings').click()}
                        flex={1}
                      >
                        Import Settings
                      </Button>
                    </HStack>
                  </Box>

                  <Divider />

                  {/* Reset Section */}
                  <Box w="full">
                    <Heading size="sm" color="orange.600" mb={4}>
                      Reset Pengaturan
                    </Heading>
                    <Button
                      colorScheme="orange"
                      variant="outline"
                      onClick={resetToDefaults}
                      w="full"
                    >
                      Reset ke Default
                    </Button>
                  </Box>

                  {/* Danger Zone */}
                  <Box w="full">
                    <Heading size="sm" color="red.600" mb={4}>
                      Zona Berbahaya
                    </Heading>
                    <VStack spacing={4} align="stretch">
                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin mereset semua data?')) {
                            toast({
                              title: 'Fitur dalam pengembangan',
                              status: 'info',
                              duration: 3000,
                            });
                          }
                        }}
                      >
                        Reset Semua Data
                      </Button>
                      
                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus semua log?')) {
                            toast({
                              title: 'Fitur dalam pengembangan',
                              status: 'info',
                              duration: 3000,
                            });
                          }
                        }}
                      >
                        Hapus Semua Log
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Save Button */}
          <Card>
            <CardBody>
              <HStack justify="space-between" flexDir={{ base: 'column', md: 'row' }} gap={4}>
                <Box>
                  <Text fontWeight="bold">Simpan Perubahan</Text>
                  <Text fontSize="sm" color="gray.600">
                    Pastikan semua pengaturan sudah benar sebelum menyimpan
                  </Text>
                </Box>
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    onClick={resetToDefaults}
                  >
                    Reset
                  </Button>
                  <Button
                    colorScheme="blue"
                    isLoading={saving}
                    onClick={handleSaveSettings}
                    size="lg"
                    loadingText="Menyimpan..."
                  >
                    Simpan Pengaturan
                  </Button>
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </AdminLayout>
  );
}