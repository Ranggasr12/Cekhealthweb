"use client";

import { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Spinner,
  VStack,
  HStack,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Card,
  CardBody,
  Badge
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useRef } from "react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const cancelRef = useRef();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'pertanyaan'), 
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Questions loaded:', questionsData.length);
      setQuestions(questionsData);
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pertanyaan',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuestion(id) {
    try {
      setDeleteLoading(true);
      await deleteDoc(doc(db, 'pertanyaan', id));
      
      toast({
        title: 'Berhasil',
        description: 'Pertanyaan berhasil dihapus',
        status: 'success',
        duration: 3000,
      });
      
      fetchQuestions();
    } catch (error) {
      console.error('❌ Error deleting question:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus pertanyaan',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setDeleteLoading(false);
      setQuestionToDelete(null);
    }
  }

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
  };

  const handleDeleteConfirm = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setQuestionToDelete(null);
  };

  const getQuestionTypeBadge = (type) => {
    const colorScheme = type === 'essay' ? 'purple' : 'green';
    const label = type === 'essay' ? 'Essay' : 'Ya/Tidak';
    
    return (
      <Badge colorScheme={colorScheme} variant="subtle">
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Box p={6}>
        <VStack spacing={4} align="center" justify="center" minH="200px">
          <Spinner size="xl" color="purple.500" />
          <Text>Memuat pertanyaan...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading mb={2}>Daftar Pertanyaan Kesehatan</Heading>
          <Text color="gray.600">
            Kelola semua pertanyaan untuk sistem skrining kesehatan
          </Text>
        </Box>

        {/* Action Bar */}
        <Card>
          <CardBody>
            <HStack justify="space-between">
              <Text fontWeight="medium">
                Total: {questions.length} pertanyaan
              </Text>
              <Link href="/admin/questions/add">
                <Button colorScheme="blue" size="lg">
                  + Tambah Pertanyaan Baru
                </Button>
              </Link>
            </HStack>
          </CardBody>
        </Card>

        {/* Questions Table */}
        {questions.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={10}>
              <Text color="gray.500" mb={4}>
                Belum ada pertanyaan yang tersedia.
              </Text>
              <Link href="/admin/questions/add">
                <Button colorScheme="blue">
                  Tambah Pertanyaan Pertama
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="striped">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Pertanyaan</Th>
                      <Th>Jenis Penyakit</Th>
                      <Th>Tipe</Th>
                      <Th>Score</Th>
                      <Th width="150px">Aksi</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {questions.map((question) => (
                      <Tr key={question.id} _hover={{ bg: 'gray.50' }}>
                        <Td maxW="400px">
                          <Text noOfLines={2} fontWeight="medium">
                            {question.pertanyaan_text}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {question.jenis_penyakit}
                          </Badge>
                        </Td>
                        <Td>
                          {getQuestionTypeBadge(question.tipe_pertanyaan)}
                        </Td>
                        <Td>
                          <Badge colorScheme="green">
                            {question.score}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Link href={`/admin/questions/edit/${question.id}`}>
                              <Button size="sm" colorScheme="yellow" variant="outline">
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              colorScheme="red" 
                              variant="outline"
                              onClick={() => handleDeleteClick(question)}
                              isLoading={deleteLoading && questionToDelete?.id === question.id}
                            >
                              Hapus
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={!!questionToDelete}
        leastDestructiveRef={cancelRef}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Pertanyaan
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus pertanyaan ini?
              {questionToDelete && (
                <Box mt={2} p={3} bg="red.50" borderRadius="md">
                  <Text fontWeight="medium">{questionToDelete.pertanyaan_text}</Text>
                </Box>
              )}
              <Text mt={3} color="red.600" fontWeight="medium">
                Tindakan ini tidak dapat dibatalkan.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleDeleteCancel}>
                Batal
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDeleteConfirm} 
                ml={3}
                isLoading={deleteLoading}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}