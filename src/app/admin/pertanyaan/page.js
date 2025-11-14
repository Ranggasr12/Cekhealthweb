"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useToast,
  Card,
  CardBody,
  Badge,
  Input,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  SimpleGrid,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch,
  FiRefreshCw,
  FiFileText,
  FiCheckCircle,
  FiList,
  FiSettings,
  FiSave,
  FiDatabase
} from 'react-icons/fi';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/AdminLayout';

// Data semua pertanyaan default - DIUBAH: Menambahkan 2 kelompok baru
const SEMUA_PERTANYAAN = [
  // ==================== SISTEM PERNAPASAN - URUTAN 1 ====================
  {
    pertanyaan_text: "Seberapa berat kesulitan bernapas yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa sering atau berat batuk yang Anda alami selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa berat nyeri atau ketidaknyamanan di dada yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa sering Anda mengalami bunyi mengi saat bernapas selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa berat napas pendek atau cepat yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa berat rasa lelah atau sesak yang Anda rasakan saat beraktivitas ringan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa sering tidur Anda terganggu oleh batuk atau sesak napas selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa berat gangguan akibat dahak berlebihan atau sulit keluar selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa berat rasa berat, nyeri, atau panas di dada yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa berat rasa cemas atau panik yang Anda rasakan akibat kesulitan bernapas selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Pernapasan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== SISTEM KARDIOVASKULER - URUTAN 2 ====================
  {
    pertanyaan_text: "Seberapa berat nyeri atau tekanan di dada yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa berat sesak napas yang Anda alami saat beraktivitas ringan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa sering atau seberapa berat jantung Anda berdebar selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa berat kelelahan yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa berat pembengkakan pada pergelangan kaki, betis, atau tungkai Anda selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa sering atau berat rasa pusing yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa besar gangguan tidur yang Anda alami akibat sesak napas atau nyeri dada selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa berat rasa cemas, takut, atau tertekan yang Anda rasakan akibat keluhan jantung selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa berat nyeri yang menjalar ke bahu, leher, rahang, atau lengan kiri selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa berat keringat berlebih atau rasa panas tiba-tiba yang Anda rasakan selama 7 hari terakhir?",
    jenis_penyakit: "Sistem Kardiovaskuler",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== SISTEM PENCERNAAN - URUTAN 3 ====================
  {
    pertanyaan_text: "Seberapa berat nyeri perut yang Anda rasakan?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa mual dalam 24 jam terakhir?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa sering atau berat muntah yang Anda alami?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa baik nafsu makan Anda? (0 = sangat baik, 10 = sama sekali tidak ada)",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa sering atau berat rasa kembung/perut penuh yang Anda rasakan?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Apakah Anda mengalami kesulitan BAB? (0 = lancar, 10 = sangat sulit / tidak BAB)",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa sering Anda mengalami diare dalam 24 jam terakhir?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa berat rasa panas atau perih di ulu hati Anda?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa besar perubahan berat badan yang Anda rasakan akhir-akhir ini?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa besar gangguan pencernaan mempengaruhi energi atau aktivitas harian Anda?",
    jenis_penyakit: "Sistem Pencernaan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== GANGGUAN NUTRISI - URUTAN 4 ====================
  {
    pertanyaan_text: "Seberapa besar penurunan nafsu makan yang Anda rasakan? (1 = nafsu makan baik, 10 = tidak ada nafsu makan sama sekali)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa khawatir Anda terhadap penurunan berat badan akhir-akhir ini? (1 = tidak khawatir, 10 = sangat khawatir)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa mual dalam 24 jam terakhir? (1 = tidak mual, 10 = mual terus-menerus)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa sering Anda mengalami muntah dalam 24 jam terakhir? (1 = tidak pernah muntah, 10 = muntah sangat sering)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa haus atau mulut kering? (1 = tidak haus, 10 = sangat haus / kering sekali)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa lelah tubuh Anda terasa saat ini? (1 = tidak lelah, 10 = sangat lelah, tidak bertenaga)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa nyeri atau tidak nyaman perut Anda? (1 = tidak nyeri, 10 = nyeri sangat berat)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa sulit Anda menelan makanan atau minuman? (1 = tidak sulit, 10 = tidak bisa menelan sama sekali)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa sedih atau tidak bersemangat karena masalah makan/nutrisi Anda? (1 = tidak sedih, 10 = sangat sedih/putus asa)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Bagaimana Anda menilai kualitas hidup Anda secara keseluruhan saat ini? (1 = sangat buruk, 10 = sangat baik)",
    jenis_penyakit: "Gangguan Nutrisi",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== SISTEM PERKEMIHAN - URUTAN 5 ====================
  {
    pertanyaan_text: "Apakah anda merasakan sakit saat buang air kecil?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Apakah buang air kecil Anda terasa lancar atau tersendat? (1 = sangat lancar, 10 = sangat tersendat)",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Apakah Anda merasa panas atau perih saat buang air kecil?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Bagaimana warna air kencing Anda? (1 = sangat jernih, 10 = sangat keruh/pekat)",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Apakah Anda merasa nyeri di bagian bawah perut?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Apakah Anda merasa sakit di pinggang?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Apakah keluhan buang air kecil membuat tidur Anda terganggu?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Apakah Anda merasa ada bengkak di kaki atau wajah?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Apakah badan Anda terasa lemah karena keluhan buang air kecil?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Apakah jumlah air kencing Anda terasa berkurang?",
    jenis_penyakit: "Sistem Perkemihan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== ENDOKRIN - URUTAN 6 ====================
  {
    pertanyaan_text: "Seberapa besar perubahan berat badan yang Anda rasakan (naik atau turun drastis) dalam beberapa waktu terakhir?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa besar rasa lelah atau kelemahan yang Anda alami hari ini?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Apakah Anda merasa mual atau tidak enak di perut?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa baik nafsu makan Anda saat ini? (0 = sangat baik, 10 = tidak ada nafsu makan sama sekali)",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Apakah Anda merasa sesak napas atau sulit bernapas?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa sedih atau tertekan perasaan Anda hari ini?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa cemas atau gelisah Anda rasakan sekarang?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa buruk kualitas tidur Anda akhir-akhir ini?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa tidak nyaman karena mudah berkeringat, merasa panas/dingin berlebihan, atau tidak tahan suhu?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa sangat haus atau sering buang air kecil karena kondisi Anda?",
    jenis_penyakit: "Endokrin",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== ISTIRAHAT & TIDUR - URUTAN 7 ====================
  {
    pertanyaan_text: "Seberapa sering tidur Anda terganggu atau mudah terbangun selama 7 hari terakhir?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa sulit Anda untuk memulai tidur saat berbaring?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa buruk kondisi Anda saat bangun tidur (lelah, tidak bugar)?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa sangat mengantuk di siang hari?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa sering tidur Anda terganggu oleh mimpi buruk atau gelisah?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa sering Anda terbangun karena harus buang air kecil?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa mengganggu kebisingan, cahaya, suhu, atau lingkungan saat Anda tidur?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa sering pikiran Anda tidak tenang sehingga sulit tidur?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa tidak nyaman dan harus sering mengubah posisi tidur?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa besar kebutuhan Anda terhadap bantuan untuk dapat tidur?",
    jenis_penyakit: "Istirahat & Tidur",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  },

  // ==================== SISTEM PERSYARAFAN - URUTAN 8 ====================
  {
    pertanyaan_text: "Seberapa berat sakit kepala yang Anda rasakan selama 24 jam terakhir?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 1
  },
  {
    pertanyaan_text: "Seberapa sering atau berat rasa pusing/melayang yang Anda rasakan?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 2
  },
  {
    pertanyaan_text: "Seberapa mengganggu rasa kesemutan atau baal pada tubuh Anda?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 3
  },
  {
    pertanyaan_text: "Seberapa berat tremor atau getaran pada tangan/kaki Anda?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 4
  },
  {
    pertanyaan_text: "Seberapa berat kelemahan otot yang Anda rasakan saat melakukan aktivitas?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 5
  },
  {
    pertanyaan_text: "Seberapa besar kesulitan Anda dalam berbicara selama 24 jam terakhir?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 6
  },
  {
    pertanyaan_text: "Seberapa berat gangguan penglihatan yang Anda alami saat ini?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 7
  },
  {
    pertanyaan_text: "Seberapa sulit Anda mengingat atau berkonsentrasi?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 8
  },
  {
    pertanyaan_text: "Seberapa berat perasaan gelisah atau cemas yang Anda rasakan?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 9
  },
  {
    pertanyaan_text: "Seberapa sering Anda merasa sangat mengantuk, lemah kesadaran, atau sulit responsif?",
    jenis_penyakit: "Sistem Persyarafan",
    tipe_pertanyaan: "rating_1_10",
    urutan: 10
  }
];

export default function PertanyaanManagement() {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [filteredPertanyaan, setFilteredPertanyaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const [formData, setFormData] = useState({
    pertanyaan_text: '',
    jenis_penyakit: '',
    tipe_pertanyaan: 'rating_1_10',
    keyword_jawaban: '',
    indikasi: '',
    saran: '',
    penanganan: '',
    rekomendasi: '',
    urutan: 1
  });

  const [bulkUpdateData, setBulkUpdateData] = useState({
    penyakit: '',
    urutan: 1
  });

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isBulkModalOpen, onOpen: onBulkModalOpen, onClose: onBulkModalClose } = useDisclosure();
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  
  const cancelRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const toast = useToast();

  const fetchPertanyaan = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching pertanyaan from Firestore...');
      
      const querySnapshot = await getDocs(collection(db, 'pertanyaan'));
      const pertanyaanData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort manually by urutan and jenis_penyakit
      const sortedData = pertanyaanData.sort((a, b) => {
        const urutanA = a.urutan || 999;
        const urutanB = b.urutan || 999;
        if (urutanA !== urutanB) {
          return urutanA - urutanB;
        }
        return (a.jenis_penyakit || '').localeCompare(b.jenis_penyakit || '');
      });

      console.log('✅ Pertanyaan loaded:', sortedData.length);
      
      setPertanyaan(sortedData);
      setFilteredPertanyaan(sortedData);
      
    } catch (error) {
      console.error('❌ Error fetching pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPertanyaan();
  }, [fetchPertanyaan]);

  useEffect(() => {
    let filtered = pertanyaan;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.pertanyaan_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenis_penyakit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.keyword_jawaban && item.keyword_jawaban.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterJenis) {
      filtered = filtered.filter(item => item.jenis_penyakit === filterJenis);
    }

    if (filterTipe) {
      filtered = filtered.filter(item => item.tipe_pertanyaan === filterTipe);
    }

    setFilteredPertanyaan(filtered);
  }, [pertanyaan, searchTerm, filterJenis, filterTipe]);

  // FUNGSI RESET DATABASE
  const handleResetDatabase = async () => {
    setSubmitting(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'pertanyaan'));
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      toast({
        title: 'Berhasil',
        description: 'Semua pertanyaan berhasil dihapus',
        status: 'success',
        duration: 3000,
      });

      fetchPertanyaan();
      onResetClose();
    } catch (error) {
      console.error('Error resetting database:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus pertanyaan',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // FUNGSI TAMBAH 80 PERTANYAAN (DARI 60 MENJADI 80)
  const handleAddDefaultQuestions = async () => {
    setSubmitting(true);
    
    try {
      console.log('🔄 Adding 80 default questions...');

      const existingData = await getDocs(collection(db, 'pertanyaan'));
      if (existingData.size > 0) {
        toast({
          title: 'Peringatan',
          description: 'Sudah ada pertanyaan di database. Reset dulu jika ingin menambah ulang.',
          status: 'warning',
          duration: 5000,
        });
        return;
      }

      const batch = writeBatch(db);
      
      SEMUA_PERTANYAAN.forEach((question) => {
        const docRef = doc(collection(db, 'pertanyaan'));
        batch.set(docRef, {
          ...question,
          indikasi: '',
          saran: '',
          penanganan: '',
          rekomendasi: '',
          keyword_jawaban: '',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      });

      await batch.commit();

      console.log('✅ 80 pertanyaan berhasil ditambahkan');
      
      toast({
        title: 'Berhasil',
        description: '80 pertanyaan default berhasil ditambahkan ke database',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchPertanyaan();
      
    } catch (error) {
      console.error('❌ Error adding default questions:', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan pertanyaan default: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // FUNGSI BULK UPDATE URUTAN MASAL
  const handleBulkUpdate = async () => {
    if (!bulkUpdateData.penyakit.trim() || !bulkUpdateData.urutan) {
      toast({
        title: 'Error',
        description: 'Pilih penyakit dan isi urutan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setBulkUpdating(true);

    try {
      // Cari semua pertanyaan dengan jenis penyakit yang sama
      const pertanyaanToUpdate = pertanyaan.filter(
        item => item.jenis_penyakit === bulkUpdateData.penyakit
      );

      if (pertanyaanToUpdate.length === 0) {
        toast({
          title: 'Peringatan',
          description: `Tidak ditemukan pertanyaan dengan penyakit "${bulkUpdateData.penyakit}"`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log(`🔄 Bulk updating ${pertanyaanToUpdate.length} pertanyaan for ${bulkUpdateData.penyakit} to urutan ${bulkUpdateData.urutan}`);

      // Gunakan batch write untuk update semua sekaligus
      const batch = writeBatch(db);

      pertanyaanToUpdate.forEach((item) => {
        const docRef = doc(db, 'pertanyaan', item.id);
        batch.update(docRef, {
          urutan: bulkUpdateData.urutan,
          updated_at: serverTimestamp()
        });
      });

      await batch.commit();

      console.log('✅ Bulk update completed');
      
      toast({
        title: 'Berhasil',
        description: `Berhasil update urutan ${pertanyaanToUpdate.length} pertanyaan "${bulkUpdateData.penyakit}" menjadi ${bulkUpdateData.urutan}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      fetchPertanyaan();
      setBulkUpdateData({ penyakit: '', urutan: 1 });
      onBulkModalClose();
      
    } catch (error) {
      console.error('❌ Error bulk updating pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal update urutan pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkUpdateData(prev => ({
      ...prev,
      [name]: name === 'urutan' ? parseInt(value) || 1 : value
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 1
    }));
  };

  // FUNGSI EDIT PERTANYAAN - DIPERBAIKI
  const handleEdit = (item) => {
    console.log('Editing item:', item);
    setFormData({
      pertanyaan_text: item.pertanyaan_text || '',
      jenis_penyakit: item.jenis_penyakit || '',
      tipe_pertanyaan: item.tipe_pertanyaan || 'rating_1_10',
      keyword_jawaban: item.keyword_jawaban || '',
      indikasi: item.indikasi || '',
      saran: item.saran || '',
      penanganan: item.penanganan || '',
      rekomendasi: item.rekomendasi || '',
      urutan: item.urutan || 1
    });
    setEditingId(item.id);
    onModalOpen();
  };

  // FUNGSI SUBMIT PERTANYAAN - DIPERBAIKI
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pertanyaan_text.trim() || !formData.jenis_penyakit.trim()) {
      toast({
        title: 'Error',
        description: 'Pertanyaan dan jenis penyakit harus diisi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.tipe_pertanyaan === 'essay' && !formData.keyword_jawaban.trim()) {
      toast({
        title: 'Error',
        description: 'Keyword jawaban harus diisi untuk pertanyaan essay',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const pertanyaanData = {
        pertanyaan_text: formData.pertanyaan_text.trim(),
        jenis_penyakit: formData.jenis_penyakit.trim(),
        tipe_pertanyaan: formData.tipe_pertanyaan,
        urutan: formData.urutan || 1,
        indikasi: formData.indikasi.trim(),
        saran: formData.saran.trim(),
        penanganan: formData.penanganan.trim(),
        rekomendasi: formData.rekomendasi.trim(),
        updated_at: serverTimestamp()
      };

      if (formData.tipe_pertanyaan === 'essay') {
        pertanyaanData.keyword_jawaban = formData.keyword_jawaban.trim();
      }

      if (editingId) {
        await updateDoc(doc(db, 'pertanyaan', editingId), pertanyaanData);
        toast({
          title: 'Berhasil',
          description: 'Pertanyaan berhasil diperbarui',
          status: 'success',
          duration: 3000,
        });
      } else {
        pertanyaanData.created_at = serverTimestamp();
        await addDoc(collection(db, 'pertanyaan'), pertanyaanData);
        toast({
          title: 'Berhasil',
          description: 'Pertanyaan berhasil ditambahkan',
          status: 'success',
          duration: 3000,
        });
      }

      fetchPertanyaan();
      // Reset form
      setFormData({
        pertanyaan_text: '',
        jenis_penyakit: '',
        tipe_pertanyaan: 'rating_1_10',
        keyword_jawaban: '',
        indikasi: '',
        saran: '',
        penanganan: '',
        rekomendasi: '',
        urutan: 1
      });
      setEditingId(null);
      onModalClose();
      
    } catch (error) {
      console.error('❌ Error saving pertanyaan:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pertanyaan: ' + error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const uniquePenyakit = [...new Set(pertanyaan.map(item => item.jenis_penyakit))].filter(Boolean);

  // Group pertanyaan by penyakit untuk statistik
  const penyakitStats = pertanyaan.reduce((acc, item) => {
    if (!acc[item.jenis_penyakit]) {
      acc[item.jenis_penyakit] = {
        count: 0,
        urutan: item.urutan || 999
      };
    }
    acc[item.jenis_penyakit].count++;
    return acc;
  }, {});

  if (loading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" thickness="3px" />
            <Text color="gray.600">Memuat data pertanyaan...</Text>
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Kelola Pertanyaan Kesehatan</Heading>
            <Text color="gray.600">
              Kelola pertanyaan untuk sistem diagnosa kesehatan - Total: {pertanyaan.length} pertanyaan
            </Text>
          </Box>

          {/* Statistik dan Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="blue.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.length}
                  </Text>
                  <Text color="blue.600" fontSize="sm">Total Pertanyaan</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="green.800" fontSize="2xl" fontWeight="bold">
                    {uniquePenyakit.length}
                  </Text>
                  <Text color="green.600" fontSize="sm">Jenis Penyakit</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="orange.50" border="1px" borderColor="orange.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="orange.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.filter(p => p.tipe_pertanyaan === 'rating_1_10').length}
                  </Text>
                  <Text color="orange.600" fontSize="sm">Rating 1-10</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card bg="purple.50" border="1px" borderColor="purple.200">
              <CardBody>
                <VStack spacing={2}>
                  <Text color="purple.800" fontSize="2xl" fontWeight="bold">
                    {pertanyaan.filter(p => p.tipe_pertanyaan === 'essay').length}
                  </Text>
                  <Text color="purple.600" fontSize="sm">Pertanyaan Essay</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Statistik Urutan Penyakit */}
          {pertanyaan.length > 0 && (
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Statistik Urutan Penyakit</Heading>
                    <Menu>
                      <MenuButton as={Button} colorScheme="purple" leftIcon={<FiSettings />}>
                        Kelola Urutan
                      </MenuButton>
                      <MenuList>
                        <MenuGroup title="Aksi Cepat">
                          <MenuItem icon={<FiSave />} onClick={onBulkModalOpen}>
                            Update Urutan Massal
                          </MenuItem>
                        </MenuGroup>
                      </MenuList>
                    </Menu>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {Object.entries(penyakitStats)
                      .sort(([,a], [,b]) => a.urutan - b.urutan)
                      .map(([penyakit, stats]) => (
                        <Card key={penyakit} size="sm" variant="outline">
                          <CardBody>
                            <VStack spacing={2} align="start">
                              <HStack justify="space-between" w="full">
                                <Badge colorScheme="blue" variant="solid">
                                  Urutan {stats.urutan}
                                </Badge>
                                <Badge colorScheme="green">
                                  {stats.count} pertanyaan
                                </Badge>
                              </HStack>
                              <Text fontWeight="medium" fontSize="sm">{penyakit}</Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Tombol Aksi Utama */}
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <HStack w="full" justify="space-between">
                  <HStack>
                    <Button
                      colorScheme="purple"
                      leftIcon={<FiPlus />}
                      onClick={() => {
                        setFormData({
                          pertanyaan_text: '',
                          jenis_penyakit: '',
                          tipe_pertanyaan: 'rating_1_10',
                          keyword_jawaban: '',
                          indikasi: '',
                          saran: '',
                          penanganan: '',
                          rekomendasi: '',
                          urutan: 1
                        });
                        setEditingId(null);
                        onModalOpen();
                      }}
                    >
                      Tambah Pertanyaan
                    </Button>
                    
                    {pertanyaan.length === 0 && (
                      <Button
                        colorScheme="green"
                        leftIcon={<FiDatabase />}
                        onClick={handleAddDefaultQuestions}
                        isLoading={submitting}
                      >
                        Tambah 80 Pertanyaan Default
                      </Button>
                    )}
                  </HStack>
                  
                  <HStack>
                    <Button
                      variant="outline"
                      leftIcon={<FiRefreshCw />}
                      onClick={fetchPertanyaan}
                      isLoading={loading}
                    >
                      Refresh
                    </Button>
                    {pertanyaan.length > 0 && (
                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={onResetOpen}
                      >
                        Reset Database
                      </Button>
                    )}
                  </HStack>
                </HStack>

                {/* Filter dan Pencarian */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Cari Pertanyaan</FormLabel>
                    <Input
                      placeholder="Cari pertanyaan atau penyakit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Filter Jenis Penyakit</FormLabel>
                    <Select
                      value={filterJenis}
                      onChange={(e) => setFilterJenis(e.target.value)}
                      placeholder="Semua jenis"
                    >
                      {uniquePenyakit.map(penyakit => (
                        <option key={penyakit} value={penyakit}>
                          {penyakit}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Filter Tipe</FormLabel>
                    <Select
                      value={filterTipe}
                      onChange={(e) => setFilterTipe(e.target.value)}
                      placeholder="Semua tipe"
                    >
                      <option value="rating_1_10">Rating 1-10</option>
                      <option value="essay">Essay</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Tabel Pertanyaan */}
          <Card>
            <CardBody>
              {loading ? (
                <VStack spacing={4} align="center" py={8}>
                  <Spinner size="xl" color="purple.500" />
                  <Text>Memuat pertanyaan...</Text>
                </VStack>
              ) : filteredPertanyaan.length === 0 ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">
                      {pertanyaan.length === 0 ? 'Belum ada pertanyaan' : 'Tidak ada pertanyaan yang sesuai filter'}
                    </Text>
                    <Text fontSize="sm">
                      {pertanyaan.length === 0 
                        ? 'Klik "Tambah 80 Pertanyaan Default" untuk memulai' 
                        : 'Coba ubah filter pencarian Anda'}
                    </Text>
                  </Box>
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Urutan</Th>
                        <Th>Pertanyaan</Th>
                        <Th>Jenis Penyakit</Th>
                        <Th>Tipe</Th>
                        <Th>Tanggal</Th>
                        <Th>Aksi</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPertanyaan.map((item) => (
                        <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                          <Td>
                            <Badge colorScheme="purple">
                              {item.urutan || '-'}
                            </Badge>
                          </Td>
                          <Td maxW="400px">
                            <Text fontWeight="medium" noOfLines={3}>
                              {item.pertanyaan_text}
                            </Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue">
                              {item.jenis_penyakit}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme="green">
                              {item.tipe_pertanyaan === 'essay' ? 'Essay' : 'Rating 1-10'}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {item.created_at?.toDate?.().toLocaleDateString('id-ID') || 'N/A'}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FiEdit />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(item)}
                                aria-label="Edit pertanyaan"
                              />
                              <IconButton
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  setDeleteId(item.id);
                                  onDeleteOpen();
                                }}
                                aria-label="Delete pertanyaan"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal Tambah/Edit Pertanyaan - DIPERBAIKI */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Informasi Dasar</Tab>
                <Tab>Informasi Medis (Opsional)</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <FormLabel>Pertanyaan</FormLabel>
                      <Textarea
                        name="pertanyaan_text"
                        value={formData.pertanyaan_text}
                        onChange={handleInputChange}
                        placeholder="Masukkan pertanyaan kesehatan..."
                        rows={3}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Jenis Penyakit</FormLabel>
                      <Input
                        name="jenis_penyakit"
                        value={formData.jenis_penyakit}
                        onChange={handleInputChange}
                        placeholder="Contoh: Sistem Pernapasan, Sistem Kardiovaskuler, Endokrin, dll"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Urutan Penyakit</FormLabel>
                      <NumberInput
                        value={formData.urutan}
                        onChange={(value) => handleNumberChange('urutan', value)}
                        min={1}
                        max={100}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Urutan tampil penyakit dalam skrining (1 = pertama, 2 = kedua, dst)
                      </Text>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tipe Pertanyaan</FormLabel>
                      <Select
                        name="tipe_pertanyaan"
                        value={formData.tipe_pertanyaan}
                        onChange={handleInputChange}
                      >
                        <option value="rating_1_10">Rating 1-10 (Skala Penilaian)</option>
                        <option value="essay">Essay (Jawaban Text)</option>
                      </Select>
                    </FormControl>

                    {formData.tipe_pertanyaan === 'essay' && (
                      <FormControl isRequired>
                        <FormLabel>Keyword Jawaban</FormLabel>
                        <Textarea
                          name="keyword_jawaban"
                          value={formData.keyword_jawaban}
                          onChange={handleInputChange}
                          placeholder="Masukkan keyword yang menandakan jawaban positif (pisahkan dengan koma)"
                          rows={2}
                        />
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Contoh: lelah,lesu,kurang energi,lemah,capai
                        </Text>
                      </FormControl>
                    )}

                    <FormControl>
                      <FormLabel>Indikasi (Opsional)</FormLabel>
                      <Input
                        name="indikasi"
                        value={formData.indikasi}
                        onChange={handleInputChange}
                        placeholder="Indikasi medis dari pertanyaan ini"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold" mb={1}>Informasi Rekomendasi (Opsional)</Text>
                        <Text fontSize="sm">
                          Informasi ini akan ditampilkan kepada pengguna berdasarkan hasil skrining.
                        </Text>
                      </Box>
                    </Alert>

                    <FormControl>
                      <FormLabel>Saran (Opsional)</FormLabel>
                      <Textarea
                        name="saran"
                        value={formData.saran}
                        onChange={handleInputChange}
                        placeholder="Saran untuk pengguna jika jawaban menunjukkan indikasi"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Penanganan (Opsional)</FormLabel>
                      <Textarea
                        name="penanganan"
                        value={formData.penanganan}
                        onChange={handleInputChange}
                        placeholder="Penanganan medis yang disarankan"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Rekomendasi (Opsional)</FormLabel>
                      <Textarea
                        name="rekomendasi"
                        value={formData.rekomendasi}
                        onChange={handleInputChange}
                        placeholder="Rekomendasi gaya hidup atau pengobatan"
                        rows={2}
                      />
                    </FormControl>

                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        <strong>Catatan:</strong> Untuk pertanyaan rating 1-10, sistem akan otomatis memberikan skor berdasarkan pilihan pengguna (1-10).
                      </Text>
                    </Alert>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <HStack w="full" justify="flex-end" spacing={3} pt={6} borderTop="1px" borderColor="gray.200">
              <Button onClick={onModalClose} variant="outline">
                Batal
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={submitting}
                loadingText="Menyimpan..."
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Bulk Update Urutan */}
      <Modal isOpen={isBulkModalOpen} onClose={onBulkModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update Urutan Massal
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  Update urutan untuk semua pertanyaan dengan jenis penyakit yang sama sekaligus.
                </Text>
              </Alert>

              <FormControl isRequired>
                <FormLabel>Pilih Jenis Penyakit</FormLabel>
                <Select
                  name="penyakit"
                  value={bulkUpdateData.penyakit}
                  onChange={handleBulkInputChange}
                  placeholder="Pilih penyakit"
                >
                  {uniquePenyakit.map(penyakit => (
                    <option key={penyakit} value={penyakit}>
                      {penyakit} ({penyakitStats[penyakit]?.count || 0} pertanyaan)
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Urutan Baru</FormLabel>
                <NumberInput
                  value={bulkUpdateData.urutan}
                  onChange={(value) => setBulkUpdateData(prev => ({ ...prev, urutan: parseInt(value) || 1 }))}
                  min={1}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Urutan baru untuk semua pertanyaan "{bulkUpdateData.penyakit}"
                </Text>
              </FormControl>

              {bulkUpdateData.penyakit && (
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold" mb={1}>Akan mengupdate:</Text>
                    <Text fontSize="sm">
                      {penyakitStats[bulkUpdateData.penyakit]?.count || 0} pertanyaan dengan penyakit "{bulkUpdateData.penyakit}"
                    </Text>
                    <Text fontSize="sm">
                      Urutan saat ini: {pertanyaan.find(p => p.jenis_penyakit === bulkUpdateData.penyakit)?.urutan || 'Belum diatur'}
                    </Text>
                  </Box>
                </Alert>
              )}
            </VStack>

            <HStack w="full" justify="flex-end" spacing={3} pt={6} borderTop="1px" borderColor="gray.200">
              <Button onClick={onBulkModalClose} variant="outline">
                Batal
              </Button>
              <Button
                colorScheme="purple"
                isLoading={bulkUpdating}
                loadingText="Updating..."
                onClick={handleBulkUpdate}
                isDisabled={!bulkUpdateData.penyakit}
              >
                Update Massal
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal untuk Reset Database */}
      <AlertDialog
        isOpen={isResetOpen}
        leastDestructiveRef={cancelRef}
        onClose={onResetClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Database
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus SEMUA pertanyaan? Tindakan ini tidak dapat dibatalkan dan akan menghapus {pertanyaan.length} pertanyaan.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onResetClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleResetDatabase} ml={3} isLoading={submitting}>
                Hapus Semua
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Modal untuk Delete Single */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Pertanyaan
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus pertanyaan ini?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={async () => {
                if (!deleteId) return;
                try {
                  await deleteDoc(doc(db, 'pertanyaan', deleteId));
                  toast({
                    title: 'Berhasil',
                    description: 'Pertanyaan berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                  });
                  fetchPertanyaan();
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Gagal menghapus pertanyaan',
                    status: 'error',
                    duration: 5000,
                  });
                } finally {
                  onDeleteClose();
                  setDeleteId(null);
                }
              }} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  );
}