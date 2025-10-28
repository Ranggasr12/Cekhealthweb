// app/admin/layout.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Box, 
  Container, 
  Spinner, 
  VStack, 
  Text,
  Alert,
  AlertIcon,
  Button 
} from '@chakra-ui/react';

export default function AdminRootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('🔐 Starting client-side admin check...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setError('Gagal memeriksa session');
        return;
      }

      if (!session) {
        console.log('❌ No session found');
        setError('Anda harus login terlebih dahulu');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      console.log('✅ Session found for:', session.user.email);

      // Check user role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('❌ Profile error:', profileError);
        
        // Jika table tidak ada atau profile tidak ditemukan
        if (profileError.code === 'PGRST116' || profileError.code === '42P01') {
          setError('Table profiles tidak ditemukan. Silakan buat table di Supabase.');
        } else {
          setError('Gagal memuat profil pengguna');
        }
        return;
      }

      console.log('📊 User role:', profile?.role);

      if (!profile || profile.role !== 'admin') {
        console.log('❌ User is not admin');
        setError('Anda tidak memiliki akses admin');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      console.log('🎉 Admin access granted!');
      setIsAdmin(true);
      
    } catch (error) {
      console.error('❌ Admin check error:', error);
      setError('Terjadi kesalahan saat memeriksa akses');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    checkAdminAccess();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="purple.500" />
          <Text>Memeriksa akses admin...</Text>
          <Text fontSize="sm" color="gray.500">
            Harap tunggu sebentar
          </Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Akses Ditolak</Text>
              <Text fontSize="sm">{error}</Text>
            </Box>
          </Alert>
          
          <Button colorScheme="blue" onClick={handleRetry}>
            Coba Lagi
          </Button>
          
          <Button variant="outline" onClick={() => router.push('/')}>
            Kembali ke Home
          </Button>

          {/* Debug Info */}
          <Box p={4} bg="gray.50" borderRadius="md" width="100%">
            <Text fontSize="sm" fontWeight="bold" mb={2}>Debug Info:</Text>
            <Text fontSize="sm">• Pastikan table 'profiles' ada di Supabase</Text>
            <Text fontSize="sm">• Pastikan user memiliki role 'admin'</Text>
            <Text fontSize="sm">• Error: {error}</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  return isAdmin ? (
    <div className="admin-layout">
      {children}
    </div>
  ) : null;
}