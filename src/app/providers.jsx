"use client";

import { ChakraProvider } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import untuk Navbar dengan ssr: false
const Navbar = dynamic(() => import('@/components/navbar'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '64px', 
      background: 'white', 
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div>Loading...</div>
    </div>
  )
});

export default function Providers({ children }) {
  const pathname = usePathname();
  
  // Jangan tampilkan navbar di halaman admin
  const showNavbar = !pathname?.startsWith('/admin');

  return (
    <ChakraProvider>
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </ChakraProvider>
  );
}