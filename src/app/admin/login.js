import { useState } from 'react'
import {
  Box,
  Flex,
  Stack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Card,
  CardBody
} from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (!userData || userData.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Hanya admin yang dapat login')
      }

      toast({
        title: 'Login berhasil!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/admin/dashboard')
    } catch (error) {
      toast({
        title: 'Login gagal',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Card maxW="md" w="full">
        <CardBody p={8}>
          <Stack spacing={6}>
            <Stack align="center">
              <Text fontSize="2xl" fontWeight="bold">
                Admin Login
              </Text>
              <Text color="gray.600">
                CekHealth Management System
              </Text>
            </Stack>

            <form onSubmit={handleLogin}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cekhealth.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={loading}
                  w="full"
                >
                  Login
                </Button>
              </Stack>
            </form>

            <Box p={4} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold">Default Admin:</Text>
              <Text fontSize="sm">Email: admin@cekhealth.com</Text>
              <Text fontSize="sm">Password: admin123</Text>
            </Box>

            <Text textAlign="center" fontSize="sm" color="gray.600">
              Kembali ke{' '}
              <Link href="/" style={{ color: 'blue.500' }}>
                Halaman Utama
              </Link>
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  )
}