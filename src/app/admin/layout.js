"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Container, 
  Spinner, 
  VStack, 
  Text,
  Alert,
  AlertIcon,
  Button 
} from '@chakra-ui/react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminRootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email);

      // Admin email bypass
      const adminEmails = ['admin@cekhealth.com', 'test@example.com', 'ranggasr1223@gmail.com'];
      if (adminEmails.includes(session.user.email)) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Check database role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      }
      
    } catch (error) {
      console.error('Admin check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="purple.500" />
          <Text>Memeriksa izin admin...</Text>
        </VStack>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>Akses Ditolak - Diperlukan hak akses admin</Text>
            <Text fontSize="sm">User: {userEmail}</Text>
          </Alert>
          <Button onClick={() => router.push('/')}>
            Kembali ke Beranda
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}