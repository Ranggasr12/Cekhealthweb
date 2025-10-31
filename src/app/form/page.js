"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Skeleton,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Link,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Image,
  AspectRatio,
  Icon,
  Textarea,
  Progress,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import { ExternalLinkIcon, DownloadIcon as ChakraDownloadIcon } from '@chakra-ui/icons';

// SVG Icons
const ChevronLeftIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
  </svg>
);

const DownloadIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
  </svg>
);

const PdfIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"></path>
  </svg>
);

const VideoIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
  </svg>
);

const EssayIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
  </svg>
);

const YesNoIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
  </svg>
);

export default function FormPage() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pertanyaan, setPertanyaan] = useState([]);
  const [loadingPertanyaan, setLoadingPertanyaan] = useState(true);
  const [materiPenyakit, setMateriPenyakit] = useState({});
  const [loadingMateri, setLoadingMateri] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
    email: '',
    telepon: ''
  });
  const [jawaban, setJawaban] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetchPertanyaan();
  }, []);

  // Fetch pertanyaan dari database
  const fetchPertanyaan = async () => {
    try {
      setLoadingPertanyaan(true);
      const { data, error } = await supabase
        .from('pertanyaan')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching questions:', error);
        // Fallback jika tabel belum ada
        setPertanyaan([]);
        return;
      }
      
      console.log('Pertanyaan loaded:', data?.length || 0);
      setPertanyaan(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pertanyaan',
        status: 'error',
        duration: 5000,
      });
      setPertanyaan([]);
    } finally {
      setLoadingPertanyaan(false);
    }
  };

  // Fetch materi penyakit
  const fetchMateriPenyakit = async (penyakitNames) => {
    if (penyakitNames.length === 0) return;
    
    setLoadingMateri(true);
    try {
      const { data, error } = await supabase
        .from('materi_penyakit')
        .select('*')
        .in('nama_penyakit', penyakitNames)
        .eq('jenis_materi', 'video');
      
      if (error) {
        console.error('Error fetching materials:', error);
        return;
      }

      const groupedMateri = {};
      penyakitNames.forEach(penyakit => {
        groupedMateri[penyakit] = {
          videos: data?.filter(m => m.nama_penyakit === penyakit) || []
        };
      });

      setMateriPenyakit(groupedMateri);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoadingMateri(false);
    }
  };

  // Handler untuk input data diri
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler untuk jawaban ya/tidak
  const handleJawabanChange = (pertanyaanId, value) => {
    setJawaban(prev => ({
      ...prev,
      [pertanyaanId]: value
    }));
  };

  // Handler untuk jawaban essay
  const handleEssayAnswer = (pertanyaanId, value) => {
    setJawaban(prev => ({
      ...prev,
      [pertanyaanId]: value
    }));
  };

  // Fungsi analisis jawaban essay
  const analyzeEssayAnswer = (jawabanText, keywords) => {
    if (!jawabanText || !keywords) return false;
    
    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
    const jawabanLower = jawabanText.toLowerCase();
    
    // Cek apakah ada keyword yang match
    return keywordList.some(keyword => jawabanLower.includes(keyword));
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    // Validasi data diri
    if (!formData.nama.trim()) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Nama lengkap harus diisi',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }

    if (!formData.usia || formData.usia < 1 || formData.usia > 120) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Usia harus antara 1-120 tahun',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }

    if (!formData.jenisKelamin) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Jenis kelamin harus dipilih',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }

    // Validasi pertanyaan
    const unansweredQuestions = pertanyaan.filter(q => {
      const answer = jawaban[q.id];
      if (q.tipe_pertanyaan === 'essay') {
        return !answer || answer.trim().length === 0;
      } else {
        return !answer;
      }
    });

    if (unansweredQuestions.length > 0) {
      toast({
        title: 'Pertanyaan Belum Lengkap',
        description: `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab`,
        status: 'warning',
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  // Fungsi untuk memastikan confidence level valid
  const getValidConfidenceLevel = (confidence) => {
    const level = confidence?.toLowerCase() || 'rendah';
    
    // Pastikan hanya nilai yang diizinkan oleh constraint database
    const validLevels = ['rendah', 'sedang', 'tinggi'];
    return validLevels.includes(level) ? level : 'rendah';
  };

  // Submit form - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log("Form submitted:", { formData, jawaban });
    setShowResults(true);
    
    const results = calculateResults();
    const detectedDiseaseNames = results.detectedDiseases
      .filter(disease => disease.name !== "Tidak Terdeteksi Penyakit Serius")
      .map(disease => disease.name);
    
    if (detectedDiseaseNames.length > 0) {
      await fetchMateriPenyakit(detectedDiseaseNames);
    }

    // Simpan hasil ke database - FIXED confidence_level
    try {
      const confidenceLevel = getValidConfidenceLevel(results.detectedDiseases[0]?.confidence);

      const { error } = await supabase
        .from('hasil_diagnosa')
        .insert([{
          nama: formData.nama,
          usia: parseInt(formData.usia),
          jenis_kelamin: formData.jenisKelamin,
          email: formData.email || null,
          telepon: formData.telepon || null,
          jawaban: jawaban,
          hasil: results,
          total_score: results.detectedDiseases.reduce((sum, disease) => sum + disease.score, 0),
          penyakit_terdeteksi: results.detectedDiseases.map(d => d.name),
          confidence_level: confidenceLevel, // ✅ FIXED
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Database error:', error);
        
        // Fallback: coba insert tanpa confidence_level jika masih error
        const { error: fallbackError } = await supabase
          .from('hasil_diagnosa')
          .insert([{
            nama: formData.nama,
            usia: parseInt(formData.usia),
            jenis_kelamin: formData.jenisKelamin,
            email: formData.email || null,
            telepon: formData.telepon || null,
            jawaban: jawaban,
            hasil: results,
            total_score: results.detectedDiseases.reduce((sum, disease) => sum + disease.score, 0),
            penyakit_terdeteksi: results.detectedDiseases.map(d => d.name),
            confidence_level: null, // ❌ Set null jika masih bermasalah
            created_at: new Date().toISOString()
          }]);

        if (fallbackError) {
          throw fallbackError;
        }
      }
      
      toast({
        title: 'Berhasil',
        description: 'Hasil skrining telah disimpan',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving results:', error);
      // Tetap tampilkan hasil meskipun gagal save
      toast({
        title: 'Info',
        description: 'Hasil skrining ditampilkan, tetapi gagal menyimpan ke database',
        status: 'info',
        duration: 5000,
      });
    }
  };

  // Kalkulasi hasil - FIXED VERSION
  const calculateResults = () => {
    const scores = {};
    const penyakitMap = {};
    const semuaSaran = [];
    const detailAnalisis = [];
    
    pertanyaan.forEach(question => {
      const penyakit = question.jenis_penyakit;
      if (!scores[penyakit]) {
        scores[penyakit] = 0;
        penyakitMap[penyakit] = [];
      }
      
      const jawabanValue = jawaban[question.id];
      let scoreDitambahkan = 0;
      let analisis = '';
      
      if (question.tipe_pertanyaan === 'ya_tidak') {
        // Untuk pertanyaan ya/tidak
        if (jawabanValue === 'ya') {
          scoreDitambahkan = question.score;
          scores[penyakit] += scoreDitambahkan;
          if (question.saran) {
            semuaSaran.push({
              saran: question.saran,
              penyakit: penyakit
            });
          }
          analisis = `Jawaban "Ya" - Score: +${question.score}`;
        } else {
          analisis = `Jawaban "Tidak" - Score: +0`;
        }
      } else if (question.tipe_pertanyaan === 'essay') {
        // Untuk pertanyaan essay - analisis keyword
        if (jawabanValue && analyzeEssayAnswer(jawabanValue, question.keyword_jawaban)) {
          scoreDitambahkan = question.score;
          scores[penyakit] += scoreDitambahkan;
          if (question.saran) {
            semuaSaran.push({
              saran: question.saran,
              penyakit: penyakit
            });
          }
          analisis = `Essay - Keyword terdeteksi - Score: +${question.score}`;
        } else {
          analisis = `Essay - Keyword tidak terdeteksi - Score: +0`;
        }
      }
      
      penyakitMap[penyakit].push({
        pertanyaan: question.pertanyaan_text,
        jawaban: jawabanValue,
        tipe: question.tipe_pertanyaan,
        saran: question.saran,
        indikasi: question.indikasi,
        score: scoreDitambahkan
      });

      detailAnalisis.push({
        pertanyaan: question.pertanyaan_text,
        tipe: question.tipe_pertanyaan,
        analisis: analisis,
        score: scoreDitambahkan
      });
    });

    // Determine diseases with high risk - IMPROVED LOGIC
    const detectedDiseases = [];
    Object.keys(scores).forEach(penyakit => {
      const score = scores[penyakit];
      const totalQuestions = penyakitMap[penyakit].length;
      
      // Hitung persentase berdasarkan total pertanyaan untuk penyakit tersebut
      const maxPossibleScore = totalQuestions * 3; // Asumsi score maks 3 per pertanyaan
      const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;
      
      // Threshold untuk mendeteksi penyakit
      if (percentage >= 30 || score >= 2) {
        // Filter saran untuk penyakit ini saja
        const saranPenyakit = semuaSaran.filter(s => s.penyakit === penyakit).map(s => s.saran);
        
        detectedDiseases.push({
          name: penyakit,
          confidence: percentage >= 60 ? "Tinggi" : percentage >= 40 ? "Sedang" : "Rendah",
          score: score,
          total: totalQuestions,
          percentage: percentage,
          questions: penyakitMap[penyakit],
          saran: saranPenyakit,
          penanganan: getPenanganan(penyakit, percentage),
          rekomendasi: getRekomendasi(penyakit, percentage)
        });
      }
    });

    // Jika tidak ada penyakit terdeteksi
    if (detectedDiseases.length === 0) {
      detectedDiseases.push({
        name: "Tidak Terdeteksi Penyakit Serius",
        confidence: "Rendah",
        score: 0,
        total: 0,
        percentage: 0,
        questions: [],
        saran: ["Pertahankan pola hidup sehat yang sudah Anda jalani"],
        penanganan: [
          "Teruskan pola hidup sehat yang sudah Anda jalani",
          "Monitor kesehatan secara berkala",
          "Lakukan aktivitas fisik ringan secara teratur"
        ],
        rekomendasi: [
          "Tetap jaga pola hidup sehat dengan makan makanan bergizi",
          "Lakukan olahraga rutin minimal 30 menit per hari",
          "Lakukan pemeriksaan kesehatan rutin setahun sekali",
          "Konsultasi dokter jika muncul gejala baru"
        ]
      });
    }

    return {
      scores,
      detectedDiseases,
      detailAnalisis,
      summary: `Terdeteksi ${detectedDiseases.length} potensi kondisi kesehatan`,
      totalPertanyaan: pertanyaan.length,
      pertanyaanTerjawab: Object.keys(jawaban).length
    };
  };

  // Data penanganan berdasarkan penyakit
  const getPenanganan = (penyakit, percentage) => {
    const penanganan = {
      'Diabetes': [
        "Segera konsultasi dengan dokter spesialis penyakit dalam",
        "Lakukan pemeriksaan gula darah lengkap (GDP, 2JPP, HbA1c)",
        "Mulai pengaturan pola makan dengan mengurangi asupan gula dan karbohidrat sederhana",
        "Monitor gula darah mandiri secara rutin",
        "Lakukan aktivitas fisik ringan secara teratur"
      ],
      'Hipertensi': [
        "Konsultasi dengan dokter untuk pengukuran tekanan darah yang akurat",
        "Lakukan pemantauan tekanan darah harian",
        "Mulai terapi non-farmakologi dengan mengurangi garam",
        "Evaluasi faktor risiko kardiovaskular lainnya",
        "Kelola stres dengan teknik relaksasi"
      ],
      'Jantung': [
        "Segera konsultasi dengan dokter spesialis jantung",
        "Lakukan pemeriksaan EKG dan ekokardiografi",
        "Evaluasi faktor risiko jantung secara menyeluruh",
        "Mulai modifikasi gaya hidup jantung sehat",
        "Hindari aktivitas berat mendadak"
      ],
      'Kolesterol': [
        "Konsultasi dengan dokter untuk pemeriksaan lipid profile",
        "Lakukan pemeriksaan kolesterol lengkap (LDL, HDL, Trigliserida)",
        "Mulai diet rendah lemak jenuh dan kolesterol",
        "Tingkatkan aktivitas fisik secara bertahap",
        "Perbanyak konsumsi serat dan omega-3"
      ],
      'Asma': [
        "Konsultasi dengan dokter spesialis paru",
        "Lakukan tes fungsi paru (spirometri)",
        "Identifikasi dan hindari pemicu alergi",
        "Pelajari teknik pernapasan yang benar",
        "Selalu siapkan inhaler emergency"
      ],
      'Gastrointestinal': [
        "Konsultasi dengan dokter spesialis pencernaan",
        "Lakukan pemeriksaan penunjang jika diperlukan",
        "Modifikasi pola makan menjadi lebih teratur",
        "Hindari makanan yang memicu gejala",
        "Kelola stres dengan baik"
      ],
      'Umum': [
        "Konsultasi dengan dokter untuk evaluasi menyeluruh",
        "Lakukan pemeriksaan laboratorium dasar",
        "Terapkan pola hidup sehat secara konsisten",
        "Monitor perkembangan gejala secara berkala",
        "Istirahat yang cukup dan kelola stres"
      ]
    };

    return penanganan[penyakit] || penanganan['Umum'];
  };

  // Data rekomendasi berdasarkan penyakit
  const getRekomendasi = (penyakit, percentage) => {
    const rekomendasi = {
      'Diabetes': [
        "Kontrol rutin ke dokter setiap 3 bulan sekali",
        "Ikuti program edukasi diabetes",
        "Bergabung dengan komunitas diabetes untuk dukungan",
        "Pelajari cara menghitung indeks glikemik makanan",
        "Monitor kaki setiap hari untuk luka atau lecet"
      ],
      'Hipertensi': [
        "Lakukan pemeriksaan tekanan darah mingguan",
        "Ikuti program pengelolaan stres",
        "Kurangi konsumsi kopi dan alkohol",
        "Tingkatkan konsumsi makanan kaya kalium",
        "Jaga berat badan ideal"
      ],
      'Jantung': [
        "Ikuti program rehabilitasi jantung",
        "Pelajari tanda-tanda darurat jantung",
        "Bawa obat emergency jika diperlukan",
        "Hindari aktivitas berat mendadak",
        "Kontrol faktor risiko seperti diabetes dan kolesterol"
      ],
      'Kolesterol': [
        "Perbanyak konsumsi serat larut air",
        "Tingkatkan konsumsi omega-3",
        "Kontrol berat badan ideal",
        "Hindari makanan cepat saji",
        "Olahraga teratur 3-5 kali seminggu"
      ],
      'Asma': [
        "Selalu bawa inhaler emergency",
        "Hindari paparan asap dan polusi",
        "Gunakan masker di tempat berdebu",
        "Lakukan pemanasan sebelum olahraga",
        "Jaga kebersihan lingkungan rumah"
      ],
      'Gastrointestinal': [
        "Makan dengan porsi kecil tapi sering",
        "Kunyah makanan secara perlahan",
        "Hindari berbaring setelah makan",
        "Kelola stres dengan baik",
        "Hindari makanan pedas dan asam berlebihan"
      ],
      'Umum': [
        "Lakukan medical check-up tahunan",
        "Terapkan pola makan seimbang",
        "Olahraga teratur 3-5 kali seminggu",
        "Istirahat yang cukup dan kelola stres",
        "Hindari rokok dan alkohol berlebihan"
      ]
    };

    return rekomendasi[penyakit] || rekomendasi['Umum'];
  };

  // Navigasi
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validasi data diri sebelum lanjut
      if (!formData.nama.trim() || !formData.usia || !formData.jenisKelamin) {
        toast({
          title: 'Data tidak lengkap',
          description: 'Harap lengkapi data diri terlebih dahulu',
          status: 'warning',
          duration: 3000,
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  // Progress calculation
  useEffect(() => {
    if (currentStep === 0) {
      setProgress(10);
    } else if (currentStep === 1) {
      const answered = Object.keys(jawaban).length;
      const total = pertanyaan.length;
      setProgress(10 + (answered / total) * 80);
    } else {
      setProgress(100);
    }
  }, [currentStep, jawaban, pertanyaan.length]);

  // Download hasil sebagai text
  const handleDownloadResults = () => {
    const results = calculateResults();
    const content = `
HASIL SKRINING KESEHATAN
========================

Data Pasien:
- Nama: ${formData.nama}
- Usia: ${formData.usia}
- Jenis Kelamin: ${formData.jenisKelamin}
- Email: ${formData.email || '-'}
- Telepon: ${formData.telepon || '-'}
- Tanggal Pemeriksaan: ${new Date().toLocaleDateString('id-ID')}

${results.summary}

${results.detectedDiseases.map(disease => `
${disease.name.toUpperCase()}
- Tingkat Keyakinan: ${disease.confidence}
- Skor: ${disease.score} dari ${disease.total} pertanyaan
- Persentase: ${disease.percentage.toFixed(1)}%

${disease.saran.length > 0 ? `Saran Khusus:\n${disease.saran.map(saran => `  💡 ${saran}`).join('\n')}\n` : ''}

Penanganan Segera:
${disease.penanganan.map(item => `  • ${item}`).join('\n')}

Rekomendasi Jangka Panjang:
${disease.rekomendasi.map(item => `  • ${item}`).join('\n')}
`).join('\n' + '='.repeat(40) + '\n')}

Detail Analisis:
${results.detailAnalisis.map((item, index) => `
${index + 1}. ${item.pertanyaan}
   Tipe: ${item.tipe === 'essay' ? 'Essay' : 'Ya/Tidak'}
   ${item.analisis}
`).join('\n')}

Catatan:
Hasil ini merupakan skrining awal berdasarkan gejala yang dilaporkan.
Disarankan untuk konsultasi dengan tenaga medis profesional untuk diagnosis yang akurat.

www.cekhealth.com
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hasil-skrining-${formData.nama}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil Download',
      description: 'Hasil skrining telah berhasil diunduh',
      status: 'success',
      duration: 3000,
    });
  };

  // Download hasil sebagai PDF
  const handleDownloadPDF = () => {
    const results = calculateResults();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 150);
    doc.text('HASIL SKRINING KESEHATAN', 105, 20, { align: 'center' });
    
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 25, 190, 25);
    
    let yPosition = 35;
    
    // Data Pasien
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('DATA PASIEN', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Nama: ${formData.nama}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Usia: ${formData.usia} tahun`, 20, yPosition);
    yPosition += 6;
    doc.text(`Jenis Kelamin: ${formData.jenisKelamin}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Email: ${formData.email || '-'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Telepon: ${formData.telepon || '-'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Tanggal Pemeriksaan: ${new Date().toLocaleDateString('id-ID')}`, 20, yPosition);
    yPosition += 15;
    
    // Ringkasan Hasil
    doc.setFontSize(14);
    doc.text('HASIL SKRINING', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(results.summary, 20, yPosition);
    yPosition += 15;
    
    // Detail Hasil Skrining
    doc.setFontSize(14);
    doc.text('DETAIL HASIL', 20, yPosition);
    yPosition += 10;
    
    results.detectedDiseases.forEach((disease, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`ANDA TERINDIKASI: ${disease.name.toUpperCase()}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Status: ${disease.confidence}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Skor: ${disease.score} dari ${disease.total} pertanyaan`, 20, yPosition);
      yPosition += 5;
      doc.text(`Persentase: ${disease.percentage.toFixed(1)}%`, 20, yPosition);
      yPosition += 10;
      
      // Saran Khusus
      if (disease.saran.length > 0) {
        doc.text('SARAN KHUSUS:', 20, yPosition);
        yPosition += 5;
        
        disease.saran.forEach((saran, saranIndex) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`  💡 ${saran}`, 25, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
      }
      
      // Penanganan Segera
      doc.text('PENANGANAN SEGERA:', 20, yPosition);
      yPosition += 5;
      
      disease.penanganan.forEach((item, itemIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`  • ${item}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
      
      // Rekomendasi Jangka Panjang
      doc.text('REKOMENDASI JANGKA PANJANG:', 20, yPosition);
      yPosition += 5;
      
      disease.rekomendasi.forEach((item, itemIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`  • ${item}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 10;
    });
    
    // Catatan Penting
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(150, 0, 0);
    doc.text('CATATAN PENTING:', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const noteText = [
      "Hasil ini merupakan skrining awal berdasarkan gejala yang dilaporkan.",
      "Tidak menggantikan konsultasi dengan tenaga medis profesional.",
      "Disarankan untuk konsultasi dengan dokter untuk diagnosis yang akurat.",
      "Hasil pemeriksaan laboratorium dan pemeriksaan fisik diperlukan untuk konfirmasi."
    ];
    
    noteText.forEach((note, index) => {
      doc.text(`• ${note}`, 20, yPosition);
      yPosition += 5;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Dokumen ini dibuat secara otomatis oleh Sistem CekHealth - www.cekhealth.com', 105, 285, { align: 'center' });
    
    doc.save(`hasil-skrining-${formData.nama}-${new Date().getTime()}.pdf`);
    
    toast({
      title: 'PDF Berhasil Diunduh',
      description: 'Hasil skrining dalam format PDF telah berhasil diunduh',
      status: 'success',
      duration: 3000,
    });
  };

  // Komponen untuk menampilkan video
  const VideoCard = ({ video }) => (
    <Card borderRadius="lg" overflow="hidden" boxShadow="md">
      <AspectRatio ratio={16 / 9}>
        <Box
          as="iframe"
          src={video.url}
          title={video.judul}
          allowFullScreen
        />
      </AspectRatio>
      <CardBody>
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {video.judul}
        </Text>
        <Text color="gray.600" fontSize="sm" mb={3}>
          {video.deskripsi}
        </Text>
        <Button
          as="a"
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="blue"
          size="sm"
          rightIcon={<ExternalLinkIcon />}
        >
          Tonton di YouTube
        </Button>
      </CardBody>
    </Card>
  );

  // Komponen untuk menampilkan materi pembelajaran
  const MateriSection = ({ penyakit }) => {
    const materi = materiPenyakit[penyakit.name] || { videos: [] };
    
    if (materi.videos.length === 0) {
      return null;
    }

    return (
      <Box mt={6} p={4} bg="blue.50" borderRadius="lg">
        <Heading size="md" color="blue.700" mb={4}>
          📚 Video Edukasi Tentang {penyakit.name}
        </Heading>
        
        <Box>
          <HStack mb={3}>
            <Icon as={VideoIcon} w={5} h={5} color="red.500" />
            <Heading size="sm" color="gray.700">
              Video Edukasi
            </Heading>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {materi.videos.map((video, index) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  };

  // Render pertanyaan berdasarkan tipe
  const renderQuestion = (question, index) => {
    if (question.tipe_pertanyaan === 'essay') {
      return (
        <FormControl key={question.id} mb={6} isRequired>
          <FormLabel fontSize="lg" fontWeight="medium" mb={4}>
            <HStack>
              <Icon as={EssayIcon} color="purple.500" />
              <Text>{index + 1}. {question.pertanyaan_text}</Text>
            </HStack>
          </FormLabel>
          <Textarea
            value={jawaban[question.id] || ''}
            onChange={(e) => handleEssayAnswer(question.id, e.target.value)}
            placeholder="Jawab dengan detail pengalaman atau gejala yang Anda rasakan..."
            rows={4}
            size="lg"
          />
          {question.keyword_jawaban && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              💡 Tips: Ceritakan pengalaman Anda secara detail untuk analisis yang lebih akurat
            </Text>
          )}
        </FormControl>
      );
    } else {
      return (
        <FormControl key={question.id} mb={6} isRequired>
          <FormLabel fontSize="lg" fontWeight="medium" mb={4}>
            <HStack>
              <Icon as={YesNoIcon} color="green.500" />
              <Text>{index + 1}. {question.pertanyaan_text}</Text>
            </HStack>
          </FormLabel>
          <RadioGroup
            value={jawaban[question.id] || ''}
            onChange={(val) => handleJawabanChange(question.id, val)}
          >
            <Stack direction="row" spacing={8}>
              <Radio value="ya" size="lg" colorScheme="green">
                Ya
              </Radio>
              <Radio value="tidak" size="lg" colorScheme="red">
                Tidak
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      );
    }
  };

  // Tampilkan loading sampai client-side siap
  if (!isClient) {
    return (
      <Box bg="white" minH="100vh">
        <Container maxW="container.md" py={10}>
          <VStack spacing={8}>
            <Skeleton height="50px" width="300px" />
            <Skeleton height="400px" width="100%" borderRadius="xl" />
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN HASIL ANALISIS
  if (showResults) {
    const results = calculateResults();

    return (
      <Box bg="white" minH="100vh" pt={0}>
        <Container maxW="container.md" py={10}>
          <VStack spacing={8} align="stretch">
            {/* Tombol Kembali */}
            <Button
              variant="outline"
              colorScheme="purple"
              leftIcon={<ChevronLeftIcon />}
              onClick={handleBack}
              alignSelf="flex-start"
              mb={4}
            >
              Kembali ke Form
            </Button>

            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={3} color="purple.800">
                🩺 Hasil Skrining Kesehatan
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Berdasarkan jawaban yang Anda berikan
              </Text>
            </Box>

            {/* Statistik Ringkas */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
              <Card>
                <CardBody textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {results.totalPertanyaan}
                  </Text>
                  <Text color="gray.600">Total Pertanyaan</Text>
                </CardBody>
              </Card>
              <Card>
                <CardBody textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {results.pertanyaanTerjawab}
                  </Text>
                  <Text color="gray.600">Pertanyaan Terjawab</Text>
                </CardBody>
              </Card>
              <Card>
                <CardBody textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {results.detectedDiseases.length}
                  </Text>
                  <Text color="gray.600">Kondisi Terdeteksi</Text>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Hasil Skrining */}
            <Card borderRadius="xl" boxShadow="lg" border="2px" borderColor="purple.200">
              <CardHeader bg="purple.50" borderTopRadius="xl">
                <Heading size="md" color="purple.700">
                  📊 Hasil Skrining Kesehatan
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {results.detectedDiseases.map((disease, index) => (
                    <Box key={index}>
                      <Box p={4} bg={disease.confidence === "Tinggi" ? "red.50" : disease.confidence === "Sedang" ? "orange.50" : "green.50"} borderRadius="md">
                        <HStack justify="space-between" mb={3}>
                          <Heading size="lg" color={disease.confidence === "Tinggi" ? "red.600" : disease.confidence === "Sedang" ? "orange.600" : "green.600"}>
                            {disease.confidence === "Tinggi" ? "⚠️ " : disease.confidence === "Sedang" ? "🔸 " : "✅ "}
                            {disease.name}
                          </Heading>
                          <Badge 
                            colorScheme={disease.confidence === "Tinggi" ? "red" : disease.confidence === "Sedang" ? "orange" : "green"} 
                            fontSize="md"
                            px={3}
                            py={1}
                          >
                            {disease.confidence === "Tinggi" ? "Prioritas Tinggi" : disease.confidence === "Sedang" ? "Perlu Perhatian" : "Kondisi Baik"}
                          </Badge>
                        </HStack>

                        {/* Statistik Penyakit */}
                        <HStack spacing={4} mb={4}>
                          <Badge colorScheme="blue">
                            Skor: {disease.score}/{disease.total}
                          </Badge>
                          <Badge colorScheme="purple">
                            {disease.percentage.toFixed(1)}%
                          </Badge>
                        </HStack>

                        {/* Saran Khusus */}
                        {disease.saran.length > 0 && (
                          <Box mb={4}>
                            <Text fontWeight="bold" color="gray.700" mb={2}>
                              💡 Saran Khusus:
                            </Text>
                            <VStack spacing={2} align="start">
                              {disease.saran.map((saran, saranIndex) => (
                                <Text key={saranIndex} color="gray.600">
                                  • {saran}
                                </Text>
                              ))}
                            </VStack>
                          </Box>
                        )}
                        
                        {/* Penanganan */}
                        <Box mb={4}>
                          <Text fontWeight="bold" color="gray.700" mb={2}>
                            🎯 Penanganan yang Disarankan:
                          </Text>
                          <VStack spacing={2} align="start">
                            {disease.penanganan.map((item, itemIndex) => (
                              <Text key={itemIndex} color="gray.600">
                                • {item}
                              </Text>
                            ))}
                          </VStack>
                        </Box>

                        {/* Rekomendasi */}
                        <Box>
                          <Text fontWeight="bold" color="gray.700" mb={2}>
                            📝 Rekomendasi Jangka Panjang:
                          </Text>
                          <VStack spacing={2} align="start">
                            {disease.rekomendasi.map((item, itemIndex) => (
                              <Text key={itemIndex} color="gray.600">
                                • {item}
                              </Text>
                            ))}
                          </VStack>
                        </Box>
                      </Box>
                      
                      {/* Materi Pembelajaran */}
                      {disease.name !== "Tidak Terdeteksi Penyakit Serius" && (
                        <MateriSection penyakit={disease} />
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Button Download */}
            <HStack spacing={4}>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                size="lg"
                flex={1}
                onClick={handleDownloadResults}
              >
                Unduh Hasil (TXT)
              </Button>
              <Button
                leftIcon={<PdfIcon />}
                colorScheme="red"
                size="lg"
                flex={1}
                onClick={handleDownloadPDF}
              >
                Unduh Hasil (PDF)
              </Button>
            </HStack>

            {/* Alert Status */}
            <Alert status={results.detectedDiseases[0].confidence === "Tinggi" ? "error" : results.detectedDiseases[0].confidence === "Sedang" ? "warning" : "success"} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold" mb={2}>
                  {results.detectedDiseases[0].confidence === "Tinggi" 
                    ? "⚠️ Penting: Segera Konsultasi dengan Dokter!" 
                    : results.detectedDiseases[0].confidence === "Sedang"
                    ? "💡 Disarankan: Konsultasi dengan Dokter"
                    : "✅ Hasil Menunjukkan Kondisi yang Baik"}
                </Text>
                <Text>
                  {results.detectedDiseases[0].confidence === "Tinggi"
                    ? "Hasil skrining menunjukkan gejala yang memerlukan penanganan medis segera. Diagnosis akhir harus ditentukan oleh tenaga medis profesional melalui pemeriksaan lengkap."
                    : results.detectedDiseases[0].confidence === "Sedang"
                    ? "Hasil menunjukkan beberapa gejala yang perlu dikonsultasikan dengan dokter untuk evaluasi lebih lanjut."
                    : "Tetap jaga kesehatan dengan pola hidup sehat dan lakukan pemeriksaan rutin. Konsultasikan dengan dokter jika muncul gejala baru."}
                </Text>
              </Box>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  // TAMPILAN MULTI-STEP FORM
  return (
    <Box bg="white" minH="100vh" pt={0}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Progress Bar */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                {currentStep === 0 ? 'Data Diri' : currentStep === 1 ? 'Pertanyaan Kesehatan' : 'Selesai'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {Math.round(progress)}%
              </Text>
            </HStack>
            <Progress value={progress} colorScheme="purple" size="lg" borderRadius="full" />
          </Box>

          {/* Tombol Kembali */}
          <Button
            variant="outline"
            colorScheme="purple"
            leftIcon={<ChevronLeftIcon />}
            onClick={handleBack}
            alignSelf="flex-start"
          >
            Kembali
          </Button>

          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={3} color="purple.800">
              {currentStep === 0 ? 'Data Diri' : 'Pertanyaan Kesehatan'}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {currentStep === 0 
                ? 'Lengkapi data diri Anda terlebih dahulu' 
                : 'Jawab semua pertanyaan berikut dengan jujur dan detail'}
            </Text>
          </Box>

          {/* Form */}
          <Card borderRadius="xl" boxShadow="lg">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* STEP 1: Data Diri */}
                  {currentStep === 0 && (
                    <Box w="100%">
                      <Heading size="md" color="purple.700" mb={4}>
                        Data Diri
                      </Heading>
                      
                      <FormControl isRequired mb={4}>
                        <FormLabel fontSize="lg" fontWeight="medium">
                          Nama Lengkap
                        </FormLabel>
                        <Input
                          value={formData.nama}
                          onChange={(e) => handleInputChange('nama', e.target.value)}
                          placeholder="Masukkan nama lengkap Anda"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired mb={4}>
                        <FormLabel fontSize="lg" fontWeight="medium">
                          Usia
                        </FormLabel>
                        <NumberInput
                          value={formData.usia}
                          onChange={(value) => handleInputChange('usia', value)}
                          min={1}
                          max={120}
                        >
                          <NumberInputField
                            placeholder="Masukkan usia Anda"
                            size="lg"
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl isRequired mb={4}>
                        <FormLabel fontSize="lg" fontWeight="medium">
                          Jenis Kelamin
                        </FormLabel>
                        <RadioGroup
                          value={formData.jenisKelamin || ''}
                          onChange={(value) => handleInputChange('jenisKelamin', value)}
                        >
                          <Stack direction="row" spacing={8}>
                            <Radio value="laki-laki" size="lg" colorScheme="purple">
                              Laki-laki
                            </Radio>
                            <Radio value="perempuan" size="lg" colorScheme="purple">
                              Perempuan
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>

                      <FormControl mb={4}>
                        <FormLabel fontSize="lg" fontWeight="medium">
                          Email
                        </FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="email@contoh.com"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="lg" fontWeight="medium">
                          Nomor Telepon
                        </FormLabel>
                        <Input
                          value={formData.telepon}
                          onChange={(e) => handleInputChange('telepon', e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          size="lg"
                        />
                      </FormControl>
                    </Box>
                  )}

                  {/* STEP 2: Pertanyaan Kesehatan */}
                  {currentStep === 1 && (
                    <Box w="100%">
                      <Heading size="md" color="purple.700" mb={4}>
                        Pertanyaan Kesehatan
                        <Text fontSize="sm" color="gray.600" fontWeight="normal" mt={1}>
                          {Object.keys(jawaban).length} dari {pertanyaan.length} pertanyaan terjawab
                        </Text>
                      </Heading>

                      {loadingPertanyaan ? (
                        <VStack spacing={4}>
                          {[1, 2, 3, 4, 5].map((item) => (
                            <Skeleton key={item} height="100px" width="100%" borderRadius="md" />
                          ))}
                        </VStack>
                      ) : pertanyaan.length === 0 ? (
                        <Box textAlign="center" py={8}>
                          <Text color="gray.500" mb={4}>
                            Belum ada pertanyaan yang tersedia.
                          </Text>
                          <Button 
                            colorScheme="blue" 
                            onClick={fetchPertanyaan}
                          >
                            Coba Muat Ulang
                          </Button>
                        </Box>
                      ) : (
                        <VStack spacing={6}>
                          {pertanyaan.map((question, index) => renderQuestion(question, index))}
                        </VStack>
                      )}
                    </Box>
                  )}

                  {/* Informasi */}
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" mb={1}>Informasi Penting</Text>
                      <Text fontSize="sm">
                        {currentStep === 0 
                          ? 'Data yang Anda berikan akan dijaga kerahasiaannya dan digunakan hanya untuk tujuan skrining kesehatan.'
                          : 'Jawablah dengan jujur dan detail. Untuk pertanyaan essay, ceritakan pengalaman Anda secara menyeluruh untuk hasil yang lebih akurat.'}
                      </Text>
                    </Box>
                  </Alert>

                  {/* Navigation Buttons */}
                  <HStack w="100%" spacing={4}>
                    {currentStep === 0 ? (
                      <Button
                        onClick={handleNext}
                        w="100%"
                        size="lg"
                        colorScheme="purple"
                      >
                        Lanjut ke Pertanyaan
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        w="100%"
                        size="lg"
                        colorScheme="purple"
                        isLoading={loadingPertanyaan}
                        isDisabled={pertanyaan.length === 0}
                      >
                        {pertanyaan.length === 0 ? 'Memuat Pertanyaan...' : 'Lihat Hasil Skrining'}
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}