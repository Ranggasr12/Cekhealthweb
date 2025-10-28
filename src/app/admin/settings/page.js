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
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';
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

  // Fetch settings dengan useCallback untuk menghindari infinite loop
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // Jika tabel tidak ada atau tidak ada data, gunakan default settings
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('Using default settings');
          setAppSettings(defaultSettings);
          return;
        }
        throw error;
      }

      if (data) {
        setAppSettings({
          ...defaultSettings,
          ...data
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
      // Cek apakah settings sudah ada
      const { data: existingSettings } = await supabase
        .from('app_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let error;
      
      if (existingSettings?.id) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('app_settings')
          .update({
            ...appSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
        error = updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('app_settings')
          .insert([{
            ...appSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        error = insertError;
      }

      if (error) {
        // Jika tabel belum ada, tampilkan pesan
        if (error.code === '42P01') {
          toast({
            title: 'Tabel belum dibuat',
            description: 'Silakan buat tabel app_settings di Supabase terlebih dahulu',
            status: 'warning',
            duration: 6000,
            isClosable: true,
          });
          return;
        }
        throw error;
      }

      toast({
        title: 'Berhasil',
        description: 'Pengaturan berhasil disimpan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pengaturan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <Box textAlign="center">
            <Text>Memuat pengaturan...</Text>
          </Box>
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
              <HStack justify="space-between">
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