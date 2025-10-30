import { Poppins } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/components/navbar';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'HealthCheck - Cek Kesehatan Online',
  description: 'Platform cek kesehatan online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <ChakraProvider>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
        </ChakraProvider>
      </body>
    </html>
  );
}