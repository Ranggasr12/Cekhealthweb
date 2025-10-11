import { Poppins } from "next/font/google";
import Providers from "./providers";
import Navbar from "@/components/navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: 'HealthCheck - Cek Kesehatan Anda',
  description: 'Website untuk memeriksa kondisi kesehatan Anda',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}