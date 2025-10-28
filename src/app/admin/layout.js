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
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('🔐 Admin Layout - Starting access check...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setError('Authentication error');
        setLoading(false);
        return;
      }

      if (!session) {
        console.log('❌ No session - Redirecting to login');
        setError('Please login first');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      setUserEmail(session.user.email);
      console.log('✅ Session found for:', session.user.email);

      // 🚨 EMERGENCY BYPASS FOR DEPLOYMENT
      // Untuk sementara, allow akses admin berdasarkan email
      const adminEmails = ['admin@cekhealth.com', 'test@example.com', 'rangga@example.com'];
      if (adminEmails.includes(session.user.email)) {
        console.log('🚨 EMERGENCY BYPASS: Granting admin access to:', session.user.email);
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Check role dari database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      console.log('📊 Database check result:', { profile, profileError });

      if (profileError) {
        console.error('❌ Profile error:', profileError);
        setError('Database connection issue');
        setLoading(false);
        return;
      }

      if (profile?.role === 'admin') {
        console.log('✅ Admin access granted from database');
        setIsAdmin(true);
      } else {
        console.log('❌ Access denied - Not admin in database');
        setError('Admin access required');
        setTimeout(() => router.push('/'), 3000);
      }
      
    } catch (error) {
      console.error('❌ Admin check error:', error);
      setError('System error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="purple.500" />
          <Text>Checking admin permissions...</Text>
          <Text fontSize="sm" color="gray.500">
            Verifying access for: {userEmail}
          </Text>
        </VStack>
      </Container>
    );
  }

  if (error && !isAdmin) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Access Denied</Text>
              <Text fontSize="sm">{error}</Text>
              <Text fontSize="sm">User: {userEmail}</Text>
            </Box>
          </Alert>
          
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
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