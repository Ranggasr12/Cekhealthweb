'use client'
import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('admin@cekhealth.com')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simpan session
    localStorage.setItem('adminEmail', email)
    localStorage.setItem('isAdmin', 'true')
    
    // Show success message
    toast({
      title: 'Login Berhasil!',
      description: 'Mengarahkan ke dashboard admin...',
      status: 'success',
      duration: 1000,
    })

    // Redirect ke halaman admin
    setTimeout(() => {
      window.location.href = '/admin'
    }, 1500)
  }

  return (
    <Container maxW="md" py={10}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              Login Admin Cekhealth
            </Heading>
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl as="form" onSubmit={handleLogin}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email Admin</FormLabel>
                  <Input
                    type="email"
                    placeholder="Masukkan email admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={loading}
                  loadingText="Sedang login..."
                  size="lg"
                >
                  Login ke Dashboard
                </Button>
              </VStack>
            </FormControl>

            <VStack width="full" spacing={3}>
              <Button
                onClick={() => window.location.href = '/admin'}
                colorScheme="green"
                width="full"
                variant="outline"
              >
                Akses Dashboard Langsung
              </Button>
              
              <Text textAlign="center" fontSize="sm" color="gray.600">
                Atau{' '}
                <Link href="/" style={{ color: '#3182CE', fontWeight: 'bold' }}>
                  kembali ke beranda
                </Link>
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}