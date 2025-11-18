"use client";

import { useEffect, useState } from 'react';
import { 
  Heading, 
  Text, 
  VStack,
  Box,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Spinner,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Flex,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { 
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';
import { 
  FiUsers, 
  FiActivity, 
  FiVideo, 
  FiHelpCircle, 
  FiSettings,
  FiSearch,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiTrash2,
  FiEye,
  FiDownload,
  FiFileText,
  FiFile,
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';

// Konstanta untuk pagination
const ITEMS_PER_PAGE = 10;

// Fungsi untuk membuat PDF yang rapi
const createProfessionalPDF = (screenings, getMainDisease, formatDateShort) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = margin;

  // Colors
  const colors = {
    primary: [41, 128, 185],
    secondary: [52, 152, 219],
    header: [44, 62, 80],
    text: [108, 117, 125],
    border: [222, 226, 230]
  };

  // Header
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN HASIL SKRINING KESEHATAN', pageWidth / 2, 12, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistem CEKHEALTH - Pusat Assessment Kesehatan Digital', pageWidth / 2, 18, { align: 'center' });

  yPosition = 35;

  // Metadata
  doc.setFontSize(8);
  doc.setTextColor(...colors.text);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition);
  
  doc.text(`Total Data: ${screenings.length} hasil skrining`, pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 8;

  // Summary Statistics
  const totalScreenings = screenings.length;
  const avgPercentage = Math.round(screenings.reduce((sum, s) => sum + s.persentase, 0) / totalScreenings);
  const highRisk = screenings.filter(s => s.persentase >= 70).length;
  const mediumRisk = screenings.filter(s => s.persentase >= 40 && s.persentase < 70).length;
  const lowRisk = screenings.filter(s => s.persentase < 40).length;

  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(...colors.secondary);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
  doc.text('SUMMARY STATISTIK', margin + 3, yPosition + 4);

  yPosition += 10;

  doc.setFontSize(7);
  doc.setTextColor(...colors.text);
  const stats = [
    `Rata-rata Skor: ${avgPercentage}%`,
    `Risiko Tinggi: ${highRisk}`,
    `Risiko Sedang: ${mediumRisk}`,
    `Risiko Rendah: ${lowRisk}`
  ];

  stats.forEach((stat, index) => {
    const xPos = margin + (index * ((pageWidth - 2 * margin) / 4));
    doc.text(stat, xPos, yPosition);
  });

  yPosition += 12;

  // Table Header
  doc.setFillColor(...colors.header);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');

  const columns = [
    { label: 'NO', width: 8 },
    { label: 'NAMA', width: 35 },
    { label: 'USIA', width: 12 },
    { label: 'JK', width: 10 },
    { label: 'HASIL UTAMA', width: 40 },
    { label: 'SKOR', width: 18 },
    { label: '%', width: 12 },
    { label: 'RISIKO', width: 18 },
    { label: 'TANGGAL', width: 25 }
  ];

  let xPos = margin;
  columns.forEach(col => {
    doc.text(col.label, xPos + 2, yPosition + 4);
    xPos += col.width;
  });

  yPosition += 8;

  // Table Rows
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'normal');

  screenings.forEach((screening, index) => {
    // Check page break
    if (yPosition > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPosition = margin;
      
      // Redraw header on new page
      doc.setFillColor(...colors.header);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      
      let headerX = margin;
      columns.forEach(col => {
        doc.text(col.label, headerX + 2, yPosition + 4);
        headerX += col.width;
      });
      
      yPosition += 8;
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'normal');
    }

    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPosition - 1, pageWidth - 2 * margin, 5, 'F');
    }

    const mainDisease = getMainDisease(screening.hasil_deteksi);
    
    const rowData = [
      (index + 1).toString(),
      screening.nama.length > 20 ? screening.nama.substring(0, 20) + '...' : screening.nama,
      screening.usia.toString(),
      screening.jenis_kelamin === 'laki-laki' ? 'L' : 'P',
      mainDisease.name.length > 25 ? mainDisease.name.substring(0, 25) + '...' : mainDisease.name,
      `${screening.total_skor}/${screening.max_skor}`,
      `${screening.persentase}%`,
      mainDisease.risk,
      formatDateShort(screening.created_at)
    ];

    xPos = margin;
    doc.setFontSize(6);
    
    rowData.forEach((cell, cellIndex) => {
      doc.text(cell, xPos + 2, yPosition + 3);
      xPos += columns[cellIndex].width;
    });

    yPosition += 5;
  });

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(...colors.text);
    doc.text(
      `Halaman ${i} dari ${totalPages} • CEKHEALTH - Sistem Assessment Kesehatan`,
      pageWidth / 2,
      doc.internal.pageSize.height - 8,
      { align: 'center' }
    );
  }

  return doc;
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingScreenings, setLoadingScreenings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const router = useRouter();
  const toast = useToast();

  // Responsive values
  const gridColumns = useBreakpointValue({ 
    base: 2, 
    sm: 4 
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadStats();
        await loadScreenings();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadStats = async () => {
    try {
      const [
        videosSnapshot,
        pertanyaanSnapshot,
        usersSnapshot,
        diagnosaSnapshot
      ] = await Promise.all([
        getCountFromServer(collection(db, 'videos')),
        getCountFromServer(collection(db, 'pertanyaan')),
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(collection(db, 'hasil_diagnosa'))
      ]);

      setStats({
        videos: videosSnapshot.data().count || 0,
        pertanyaan: pertanyaanSnapshot.data().count || 0,
        users: usersSnapshot.data().count || 0,
        diagnosa: diagnosaSnapshot.data().count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        videos: 0,
        pertanyaan: 0,
        users: 0,
        diagnosa: 0
      });
    }
  };

  const loadScreenings = async (page = 1, reset = false) => {
    try {
      setLoadingScreenings(true);
      
      let screeningsQuery = query(
        collection(db, 'hasil_diagnosa'),
        orderBy('created_at', 'desc'),
        limit(ITEMS_PER_PAGE + 1)
      );

      if (page > 1 && lastVisible && !reset) {
        screeningsQuery = query(screeningsQuery, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(screeningsQuery);
      const screeningsData = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const hasilDeteksi = Array.isArray(data.hasil?.detectedDiseases) 
          ? data.hasil.detectedDiseases 
          : [];
        
        const totalSkor = data.hasil?.totalSkor || 0;
        const maxSkor = data.hasil?.maxSkor || 0;
        const persentase = data.hasil?.persentase || calculatePercentage(totalSkor, maxSkor);

        screeningsData.push({
          id: doc.id,
          nama: data.nama || 'Tidak ada nama',
          usia: data.usia || 'Tidak ada usia',
          jenis_kelamin: data.jenis_kelamin || 'Tidak ada',
          total_skor: totalSkor,
          max_skor: maxSkor,
          persentase: persentase,
          penyakit_terdeteksi: hasilDeteksi.length,
          created_at: data.created_at?.toDate?.() || new Date(),
          hasil_deteksi: hasilDeteksi,
          jawaban: data.jawaban || {},
          hasil_data: data.hasil || {}
        });
        lastDoc = doc;
      });

      const hasNext = screeningsData.length > ITEMS_PER_PAGE;
      if (hasNext) {
        screeningsData.pop();
        setLastVisible(lastDoc);
      } else {
        setLastVisible(null);
      }
      
      setHasNextPage(hasNext);
      
      if (reset) {
        setScreenings(screeningsData);
        setCurrentPage(1);
      } else {
        setScreenings(screeningsData);
      }
      
      const countSnapshot = await getCountFromServer(collection(db, 'hasil_diagnosa'));
      setTotalItems(countSnapshot.data().count);

    } catch (error) {
      console.error('Error loading screenings:', error);
      setScreenings([]);
    } finally {
      setLoadingScreenings(false);
    }
  };

  // ==================== FUNGSI DOWNLOAD YANG DIPERBAIKI ====================

  // Download sebagai PDF yang rapi
  const downloadPDF = () => {
    try {
      const doc = createProfessionalPDF(screenings, getMainDisease, formatDateShort);
      doc.save(`laporan-skrining-${formatDateForFilename()}.pdf`);
      
      toast({
        title: 'Berhasil',
        description: 'Laporan PDF berhasil diunduh',
        status: 'success',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat file PDF',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Download sebagai Excel/CSV yang rapi
  const downloadCSV = () => {
    try {
      const dataToExport = screenings.map((screening, index) => {
        const mainDisease = getMainDisease(screening.hasil_deteksi);
        
        return {
          'No': index + 1,
          'Nama Lengkap': screening.nama,
          'Usia': screening.usia,
          'Jenis Kelamin': screening.jenis_kelamin,
          'Hasil Utama': mainDisease.name,
          'Total Skor': screening.total_skor,
          'Skor Maksimal': screening.max_skor,
          'Persentase': screening.persentase,
          'Kategori Risiko': mainDisease.risk,
          'Jumlah Penyakit Terdeteksi': screening.penyakit_terdeteksi,
          'Tanggal Skrining': formatDateExcel(screening.created_at),
          'Waktu Skrining': formatTime(screening.created_at),
          'Detail Penyakit': screening.hasil_deteksi.map(d => `${d.name} (${d.persentase || 0}%)`).join('; ')
        };
      });

      // Add summary row
      const summary = {
        'No': 'SUMMARY',
        'Nama Lengkap': '',
        'Usia': '',
        'Jenis Kelamin': '',
        'Hasil Utama': '',
        'Total Skor': '',
        'Skor Maksimal': '',
        'Persentase': `Rata-rata: ${Math.round(screenings.reduce((sum, s) => sum + s.persentase, 0) / screenings.length)}%`,
        'Kategori Risiko': `Tinggi: ${screenings.filter(s => s.persentase >= 70).length}, Sedang: ${screenings.filter(s => s.persentase >= 40 && s.persentase < 70).length}, Rendah: ${screenings.filter(s => s.persentase < 40).length}`,
        'Jumlah Penyakit Terdeteksi': '',
        'Tanggal Skrining': '',
        'Waktu Skrining': '',
        'Detail Penyakit': ''
      };

      const allData = [...dataToExport, summary];

      const headers = Object.keys(allData[0]);
      const csvContent = [
        // Header dengan styling
        '\uFEFF' + headers.join(','),
        // Data rows
        ...allData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle special characters and commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadFile(blob, `laporan-skrining-${formatDateForFilename()}.csv`, 'CSV');
      
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat file CSV',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Download sebagai TXT (Laporan Detail)
  const downloadTXT = () => {
    try {
      const timestamp = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let content = `LAPORAN HASIL SKRINING KESEHATAN\n`;
      content += `SISTEM CEKHEALTH\n`;
      content += `=${'='.repeat(50)}\n\n`;
      
      content += `INFORMASI LAPORAN:\n`;
      content += `• Tanggal Cetak: ${timestamp}\n`;
      content += `• Total Data: ${screenings.length} hasil skrining\n\n`;
      
      // Summary Statistics
      const avgPercentage = Math.round(screenings.reduce((sum, s) => sum + s.persentase, 0) / screenings.length);
      const highRisk = screenings.filter(s => s.persentase >= 70).length;
      const mediumRisk = screenings.filter(s => s.persentase >= 40 && s.persentase < 70).length;
      const lowRisk = screenings.filter(s => s.persentase < 40).length;
      
      content += `STATISTIK SUMMARY:\n`;
      content += `• Rata-rata Persentase: ${avgPercentage}%\n`;
      content += `• Risiko Tinggi: ${highRisk} orang\n`;
      content += `• Risiko Sedang: ${mediumRisk} orang\n`;
      content += `• Risiko Rendah: ${lowRisk} orang\n\n`;
      
      content += `DETAIL HASIL SKRINING:\n`;
      content += `=${'='.repeat(50)}\n\n`;
      
      screenings.forEach((screening, index) => {
        const mainDisease = getMainDisease(screening.hasil_deteksi);
        
        content += `[DATA ${index + 1}]\n`;
        content += `Nama          : ${screening.nama}\n`;
        content += `Usia          : ${screening.usia} tahun\n`;
        content += `Jenis Kelamin : ${screening.jenis_kelamin}\n`;
        content += `Hasil Utama   : ${mainDisease.name}\n`;
        content += `Skor          : ${screening.total_skor}/${screening.max_skor} (${screening.persentase}%)\n`;
        content += `Tingkat Risiko: ${mainDisease.risk}\n`;
        content += `Tanggal       : ${formatDateExcel(screening.created_at)}\n`;
        
        if (screening.hasil_deteksi.length > 0) {
          content += `Penyakit Terdeteksi:\n`;
          screening.hasil_deteksi.forEach((disease, idx) => {
            const diseaseRisk = disease.riskCategory || getRiskCategory(disease.persentase || 0).label;
            content += `  ${idx + 1}. ${disease.name} - ${diseaseRisk} (${disease.persentase || 0}%)\n`;
          });
        }
        
        content += `\n${'-'.repeat(60)}\n\n`;
      });
      
      content += `CATATAN PENTING:\n`;
      content += `=${'='.repeat(50)}\n`;
      content += `• Hasil ini merupakan assessment awal dan tidak menggantikan konsultasi dokter\n`;
      content += `• Disarankan untuk konsultasi lebih lanjut dengan tenaga kesehatan profesional\n`;
      content += `• Data dikelola oleh Sistem CEKHEALTH\n`;
      content += `• Laporan ini dibuat secara otomatis pada ${timestamp}\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      downloadFile(blob, `laporan-detail-skrining-${formatDateForFilename()}.txt`, 'TXT');
      
    } catch (error) {
      console.error('Error generating TXT:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat file TXT',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Download sebagai JSON (Data Mentah)
  const downloadJSON = () => {
    try {
      const dataToExport = {
        metadata: {
          generated_at: new Date().toISOString(),
          total_records: screenings.length,
          system: 'CEKHEALTH Screening System',
          version: '1.0'
        },
        summary: {
          average_percentage: Math.round(screenings.reduce((sum, s) => sum + s.persentase, 0) / screenings.length),
          high_risk_count: screenings.filter(s => s.persentase >= 70).length,
          medium_risk_count: screenings.filter(s => s.persentase >= 40 && s.persentase < 70).length,
          low_risk_count: screenings.filter(s => s.persentase < 40).length
        },
        screenings: screenings.map(screening => ({
          id: screening.id,
          patient_info: {
            nama: screening.nama,
            usia: screening.usia,
            jenis_kelamin: screening.jenis_kelamin
          },
          screening_results: {
            total_skor: screening.total_skor,
            max_skor: screening.max_skor,
            persentase: screening.persentase,
            penyakit_terdeteksi: screening.penyakit_terdeteksi,
            hasil_utama: getMainDisease(screening.hasil_deteksi),
            detail_penyakit: screening.hasil_deteksi.map(disease => ({
              name: disease.name,
              persentase: disease.persentase || 0,
              risk_category: disease.riskCategory || getRiskCategory(disease.persentase || 0).label
            }))
          },
          timestamp: screening.created_at.toISOString(),
          metadata: {
            data_type: 'screening_result',
            version: '1.0'
          }
        }))
      };

      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      downloadFile(blob, `data-skrining-${formatDateForFilename()}.json`, 'JSON');
      
    } catch (error) {
      console.error('Error generating JSON:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat file JSON',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Fungsi bantu untuk download
  const downloadFile = (blob, filename, format) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil Download',
      description: `File ${format} berhasil diunduh`,
      status: 'success',
      duration: 3000,
    });
  };

  const formatDateForFilename = () => {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  };

  const formatDateShort = (date) => {
    if (!date) return '-';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatTime = (date) => {
    if (!date) return '-';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  // ==================== FUNGSI LAINNYA ====================

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      loadScreenings(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      loadScreenings(currentPage - 1);
    }
  };

  const handleRefresh = () => {
    loadScreenings(1, true);
  };

  const handleDeleteScreening = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data skrining ini?')) {
      try {
        await deleteDoc(doc(db, 'hasil_diagnosa', id));
        await loadScreenings(currentPage, true);
        toast({
          title: 'Berhasil',
          description: 'Data skrining berhasil dihapus',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error deleting screening:', error);
        toast({
          title: 'Error',
          description: 'Gagal menghapus data skrining',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleViewDetails = (screening) => {
    localStorage.setItem('screeningDetail', JSON.stringify(screening));
    router.push('/admin/screening-detail');
  };

  // Fungsi untuk mendapatkan kategori risiko berdasarkan persentase
  const getRiskCategory = (persentase) => {
    if (persentase >= 70) return { label: 'Tinggi', color: 'red' };
    if (persentase >= 40) return { label: 'Sedang', color: 'orange' };
    return { label: 'Rendah', color: 'green' };
  };

  // Fungsi untuk mendapatkan penyakit utama yang terdeteksi
  const getMainDisease = (hasilDeteksi) => {
    try {
      if (!hasilDeteksi || !Array.isArray(hasilDeteksi) || hasilDeteksi.length === 0) {
        return { 
          name: 'Tidak ada indikasi', 
          risk: 'Rendah',
          persentase: 0
        };
      }
      
      const validDetections = hasilDeteksi.filter(item => 
        item && typeof item === 'object' && 'name' in item
      );
      
      if (validDetections.length === 0) {
        return { 
          name: 'Tidak ada indikasi', 
          risk: 'Rendah',
          persentase: 0
        };
      }
      
      const sorted = [...validDetections].sort((a, b) => {
        const persentaseA = a.persentase || 0;
        const persentaseB = b.persentase || 0;
        return persentaseB - persentaseA;
      });
      
      const mainDisease = sorted[0];
      
      return {
        name: mainDisease.name || 'Tidak diketahui',
        risk: mainDisease.riskCategory || getRiskCategory(mainDisease.persentase || 0).label,
        persentase: mainDisease.persentase || 0
      };
    } catch (error) {
      console.error('Error in getMainDisease:', error);
      return { 
        name: 'Error parsing data', 
        risk: 'Rendah',
        persentase: 0
      };
    }
  };

  // Format tanggal menjadi lebih readable
  const formatDate = (date) => {
    if (!date) return '-';
    try {
      const now = new Date();
      const dateObj = date instanceof Date ? date : new Date(date);
      const diffMs = now - dateObj;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;
      
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatDateExcel = (date) => {
    if (!date) return '-';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  // Fungsi untuk menghitung persentase
  const calculatePercentage = (total, max) => {
    if (!max || max === 0) return 0;
    return Math.round((total / max) * 100);
  };

  // Filter data berdasarkan search term
  const filteredScreenings = screenings.filter(screening => {
    const mainDisease = getMainDisease(screening.hasil_deteksi);
    return (
      screening.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mainDisease.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <Box 
          ml={{ base: 0, md: "10px" }}
          mt="60px"
          px={4}
          py={6}
        >
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Memuat dashboard...</Text>
          </VStack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box 
        ml={{ base: 0, md: "10px" }}
        mt="60px"
        minH="calc(100vh - 60px)"
        bg="gray.50"
        px={4}
        py={4}
        width={{ 
          base: "100%", 
          md: "calc(100vw - 290px)",
          lg: "calc(100vw - 300px)" 
        }}
        maxW="100%"
        overflow="hidden"
      >
        <VStack spacing={4} align="stretch" width="100%">
          
          {/* Header */}
          <Box width="100%">
            <VStack spacing={1} align="start">
              <Heading size="lg" color="gray.800" fontWeight="bold">
                Dashboard Admin
              </Heading>
              <Text fontSize="md" color="gray.600">
                Kelola sistem diagnosa kesehatan dengan konfigurasi lengkap
              </Text>
            </VStack>
          </Box>

          {/* Statistics Grid */}
          <SimpleGrid columns={gridColumns} spacing={3} width="100%">
            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="purple.600">
                    {stats.users || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Pengguna
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    {stats.diagnosa || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Diagnosa
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {stats.videos || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Video
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
              <CardBody p={3}>
                <VStack spacing={1} align="start">
                  <Text fontSize="xl" fontWeight="bold" color="orange.600">
                    {stats.pertanyaan || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Pertanyaan
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Quick Actions Header */}
          <HStack justify="space-between" align="center" width="100%">
            <Heading size="md" color="gray.800">
              Quick Actions
            </Heading>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="purple"
              size="sm"
              variant="solid"
            >
              Tambah Konten
            </Button>
          </HStack>

          {/* Search and Filter Section */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
            <CardBody p={4}>
              <SimpleGrid 
                columns={{ base: 1, md: 3 }} 
                spacing={4}
                width="100%"
              >
                <InputGroup size="sm" width="100%">
                  <InputLeftElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Cari nama atau penyakit..." 
                    borderRadius="md"
                    width="100%"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                
                <Select 
                  placeholder="Filter Bulan" 
                  size="sm" 
                  borderRadius="md" 
                  width="100%"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="januari">Januari 2024</option>
                  <option value="februari">Februari 2024</option>
                  <option value="maret">Maret 2024</option>
                </Select>

                <Select 
                  placeholder="Filter Status" 
                  size="sm" 
                  borderRadius="md" 
                  width="100%"
                >
                  <option>Semua Status</option>
                  <option>Risiko Tinggi</option>
                  <option>Risiko Sedang</option>
                  <option>Risiko Rendah</option>
                </Select>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Quick Actions Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} width="100%">
            {/* Button 1 - Kelola Pertanyaan */}
            <Button
              leftIcon={<Icon as={FiHelpCircle} />}
              colorScheme="blue"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/pertanyaan')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="blue.200"
              _hover={{ bg: 'blue.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Kelola Pertanyaan
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Kuesioner kesehatan
                </Text>
              </Box>
            </Button>

            {/* Button 2 - Kelola Video */}
            <Button
              leftIcon={<Icon as={FiVideo} />}
              colorScheme="green"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/videos')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="green.200"
              _hover={{ bg: 'green.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Kelola Video
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Konten edukasi
                </Text>
              </Box>
            </Button>

            {/* Button 3 - Pengaturan */}
            <Button
              leftIcon={<Icon as={FiSettings} />}
              colorScheme="purple"
              size="md"
              height="70px"
              onClick={() => router.push('/admin/settings')}
              justifyContent="flex-start"
              variant="outline"
              border="1px"
              borderColor="purple.200"
              _hover={{ bg: 'purple.50' }}
              width="100%"
              whiteSpace="normal"
              textAlign="left"
              px={3}
            >
              <Box textAlign="left" width="100%">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  Pengaturan
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  Pengaturan sistem
                </Text>
              </Box>
            </Button>
          </SimpleGrid>

          {/* Hasil Skrining dengan Fitur Download */}
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200" borderRadius="md" width="100%">
            <CardBody p={4} width="100%">
              <VStack spacing={4} align="stretch" width="100%">
                {/* Header dengan Actions */}
                <Flex justify="space-between" align="center" width="100%">
                  <Heading size="md" color="gray.800">
                    Hasil Skrining ({totalItems} total)
                  </Heading>
                  <HStack spacing={2}>
                    {/* Menu Download */}
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        leftIcon={<FiDownload />}
                        colorScheme="blue"
                        isDisabled={screenings.length === 0}
                      >
                        Download Laporan
                      </MenuButton>
                      <MenuList>
                        <MenuItem icon={<FiFileText />} onClick={downloadPDF}>
                          📊 Laporan PDF (Rapi)
                        </MenuItem>
                        <MenuItem icon={<FiFile />} onClick={downloadCSV}>
                          📈 Excel/CSV (Terstruktur)
                        </MenuItem>
                        <MenuItem icon={<FiFileText />} onClick={downloadTXT}>
                          📝 Laporan Detail (TXT)
                        </MenuItem>
                        <MenuItem icon={<FiFile />} onClick={downloadJSON}>
                          💾 Data Mentah (JSON)
                        </MenuItem>
                      </MenuList>
                    </Menu>

                    <Tooltip label="Refresh data">
                      <IconButton
                        aria-label="Refresh data"
                        icon={<FiRefreshCw />}
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={loadingScreenings}
                      />
                    </Tooltip>
                  </HStack>
                </Flex>

                {/* Tabel Excel-like */}
                <Box width="100%" overflowX="auto" border="1px" borderColor="gray.200" borderRadius="md">
                  {loadingScreenings ? (
                    <VStack py={8} spacing={4}>
                      <Spinner size="lg" color="purple.500" />
                      <Text color="gray.600">Memuat data skrining...</Text>
                    </VStack>
                  ) : filteredScreenings.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Icon as={FiActivity} fontSize="32px" color="gray.400" mb={3} />
                      <Text color="gray.500">
                        {screenings.length === 0 ? 'Belum ada data skrining' : 'Tidak ada hasil pencarian'}
                      </Text>
                    </Box>
                  ) : (
                    <>
                      <Table variant="simple" size="sm" minWidth="1000px">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="5%" textAlign="center">NO</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="15%">NAMA LENGKAP</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="8%" textAlign="center">USIA</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="10%" textAlign="center">JENIS KELAMIN</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="15%">HASIL UTAMA</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="8%" textAlign="center">SKOR</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="10%" textAlign="center">PERSENTASE</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="10%" textAlign="center">RISIKO</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="12%" textAlign="center">TANGGAL</Th>
                            <Th fontWeight="bold" color="gray.700" fontSize="xs" width="7%" textAlign="center">AKSI</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredScreenings.map((screening, index) => {
                            const mainDisease = getMainDisease(screening.hasil_deteksi);
                            const riskCategory = getRiskCategory(screening.persentase);
                            const percentage = screening.persentase;
                            const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                            
                            return (
                              <Tr key={screening.id} _hover={{ bg: 'gray.50' }} borderBottom="1px" borderColor="gray.100">
                                <Td width="5%" textAlign="center" fontSize="sm" color="gray.600">
                                  {rowNumber}
                                </Td>
                                <Td width="15%">
                                  <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                                    {screening.nama}
                                  </Text>
                                </Td>
                                <Td width="8%" textAlign="center" fontSize="sm" color="gray.600">
                                  {screening.usia}
                                </Td>
                                <Td width="10%" textAlign="center">
                                  <Badge 
                                    colorScheme={screening.jenis_kelamin === 'laki-laki' ? 'blue' : 'pink'} 
                                    fontSize="xs" 
                                    px={2} 
                                    py={1}
                                    variant="subtle"
                                  >
                                    {screening.jenis_kelamin}
                                  </Badge>
                                </Td>
                                <Td width="15%">
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" color="gray.800" fontWeight="medium" noOfLines={1}>
                                      {mainDisease.name}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                      {screening.penyakit_terdeteksi} kategori terdeteksi
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td width="8%" textAlign="center" fontSize="sm" color="gray.600">
                                  {screening.total_skor}/{screening.max_skor}
                                </Td>
                                <Td width="10%" textAlign="center">
                                  <Badge 
                                    colorScheme={
                                      percentage >= 70 ? 'red' : 
                                      percentage >= 40 ? 'orange' : 'green'
                                    }
                                    fontSize="xs" 
                                    px={2} 
                                    py={1}
                                    variant="subtle"
                                  >
                                    {percentage}%
                                  </Badge>
                                </Td>
                                <Td width="10%" textAlign="center">
                                  <Badge 
                                    colorScheme={riskCategory.color} 
                                    fontSize="xs" 
                                    px={2} 
                                    py={1}
                                  >
                                    {riskCategory.label}
                                  </Badge>
                                </Td>
                                <Td width="12%" textAlign="center" fontSize="xs" color="gray.500">
                                  {formatDateExcel(screening.created_at)}
                                </Td>
                                <Td width="7%" textAlign="center">
                                  <HStack spacing={1} justify="center">
                                    <Tooltip label="Lihat Detail">
                                      <IconButton
                                        aria-label="View details"
                                        icon={<FiEye />}
                                        size="xs"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleViewDetails(screening)}
                                      />
                                    </Tooltip>
                                    <Tooltip label="Hapus Data">
                                      <IconButton
                                        aria-label="Delete screening"
                                        icon={<FiTrash2 />}
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDeleteScreening(screening.id)}
                                      />
                                    </Tooltip>
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>

                      {/* Pagination Controls */}
                      <Flex justify="space-between" align="center" p={4} bg="gray.50" borderTop="1px" borderColor="gray.200">
                        <Text fontSize="sm" color="gray.600">
                          Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari {totalItems} hasil
                        </Text>
                        
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            leftIcon={<FiArrowLeft />}
                            onClick={handlePrevPage}
                            isDisabled={currentPage === 1}
                            variant="outline"
                          >
                            Sebelumnya
                          </Button>
                          
                          <HStack spacing={1}>
                            {currentPage > 1 && (
                              <Button size="sm" variant="outline" onClick={() => setCurrentPage(1)}>
                                1
                              </Button>
                            )}
                            {currentPage > 2 && <Text>...</Text>}
                            <Button size="sm" colorScheme="purple" variant="solid">
                              {currentPage}
                            </Button>
                            {hasNextPage && (
                              <Button size="sm" variant="outline" onClick={handleNextPage}>
                                {currentPage + 1}
                              </Button>
                            )}
                          </HStack>
                          
                          <Button
                            size="sm"
                            rightIcon={<FiArrowRight />}
                            onClick={handleNextPage}
                            isDisabled={!hasNextPage}
                            variant="outline"
                          >
                            Berikutnya
                          </Button>
                        </HStack>
                      </Flex>
                    </>
                  )}
                </Box>

                {/* Summary Statistics */}
                {filteredScreenings.length > 0 && (
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                    <Card bg="blue.50" border="1px" borderColor="blue.200">
                      <CardBody p={3}>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="blue.700" fontWeight="medium">
                            Rata-rata Persentase
                          </Text>
                          <Text fontSize="lg" color="blue.800" fontWeight="bold">
                            {Math.round(
                              filteredScreenings.reduce((sum, screening) => sum + screening.persentase, 0) / filteredScreenings.length
                            )}%
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card bg="green.50" border="1px" borderColor="green.200">
                      <CardBody p={3}>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="green.700" fontWeight="medium">
                            Risiko Rendah
                          </Text>
                          <Text fontSize="lg" color="green.800" fontWeight="bold">
                            {filteredScreenings.filter(screening => screening.persentase < 40).length}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card bg="red.50" border="1px" borderColor="red.200">
                      <CardBody p={3}>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="red.700" fontWeight="medium">
                            Risiko Tinggi
                          </Text>
                          <Text fontSize="lg" color="red.800" fontWeight="bold">
                            {filteredScreenings.filter(screening => screening.persentase >= 70).length}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                )}
              </VStack>
            </CardBody>
          </Card>

        </VStack>
      </Box>
    </AdminLayout>
  );
}