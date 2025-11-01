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
  icons: {
    icon: '/favicon.ico', // ✅ Pastikan file ini ada
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* ✅ Manual fallback */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={poppins.className} suppressHydrationWarning>
        <ChakraProvider>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
        </ChakraProvider>
      </body>
    </html>
  );
}