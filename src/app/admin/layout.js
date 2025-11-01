"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { 
  doc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  Container, 
  Spinner, 
  VStack, 
  Text,
  Alert,
  AlertIcon,
  Button,
  HStack,
  Badge
} from '@chakra-ui/react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminRootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email);
        await checkAdminAccess(user);
      } else {
        // No user, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const checkAdminAccess = async (user) => {
    try {
      // Admin email bypass - GANTI DENGAN EMAIL ADMIN ANDA
      const adminEmails = [
        'admin@cekhealth.com', 
        'ranggasr1223@gmail.com',
        'admin@example.com'
        // Tambahkan email admin lainnya di sini
      ];

      if (adminEmails.includes(user.email)) {
        console.log('✅ Admin access granted via email:', user.email);
        setIsAdmin(true);
        return;
      }

      // Check Firestore for admin role
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            console.log('✅ Admin access granted via Firestore role');
            setIsAdmin(true);
            return;
          }
        }
      } catch (firestoreError) {
        console.log('Firestore not configured, using email-based access');
      }

      // If no admin access found
      console.log('❌ Admin access denied for:', user.email);
      setIsAdmin(false);

    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="purple.500" thickness="3px" />
          <Text color="gray.600" fontSize="lg">Memeriksa izin admin...</Text>
          <Text fontSize="sm" color="gray.500">
            Mengautentikasi pengguna
          </Text>
        </VStack>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Alert 
            status="error" 
            borderRadius="lg"
            variant="left-accent"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            py={6}
          >
            <AlertIcon boxSize={6} />
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                ⚠️ Akses Ditolak
              </Text>
              <Text fontSize="md">
                Diperlukan hak akses administrator
              </Text>
              <HStack spacing={2} mt={2}>
                <Text fontSize="sm" color="gray.600">User:</Text>
                <Badge colorScheme="red" fontSize="sm">
                  {userEmail}
                </Badge>
              </HStack>
            </VStack>
          </Alert>
          
          <VStack spacing={3}>
            <Button 
              onClick={() => router.push('/')}
              colorScheme="blue"
              size="lg"
            >
              Kembali ke Beranda
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Login dengan Akun Lain
            </Button>
          </VStack>

          <Text fontSize="sm" color="gray.500" textAlign="center" maxW="400px">
            Jika Anda merasa ini adalah kesalahan, pastikan email Anda terdaftar 
            sebagai administrator atau hubungi developer sistem.
          </Text>
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