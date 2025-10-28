'use client';

import { useState, useEffect, useCallback } from 'react'; // TAMBAHKAN useCallback
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  useToast,
  VStack,
  HStack,
  Text,
  Switch,
  Select,
  Divider,
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/AdminLayout';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });
  const [appSettings, setAppSettings] = useState({
    site_name: 'CekHealth',
    site_description: 'Platform kesehatan terpercaya',
    maintenance_mode: false,
    allow_registrations: true,
    max_file_size: 10,
    supported_formats: 'pdf,mp4,jpg,png'
  });
  const toast = useToast();
  const { user } = { user: { id: '1', email: 'admin@cekhealth.com', created_at: new Date().toISOString() } }; // Mock user

  // Pindahkan fetchUserProfile ke useCallback
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user.id]); // Tambahkan user.id sebagai dependency

  const fetchAppSettings = useCallback(async () => {
    // In a real app, you'd fetch these from a settings table
    // For now, we'll use default values
    setAppSettings({
      site_name: 'CekHealth',
      site_description: 'Platform kesehatan terpercaya',
      maintenance_mode: false,
      allow_registrations: true,
      max_file_size: 10,
      supported_formats: 'pdf,mp4,jpg,png'
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
    fetchAppSettings();
  }, [user, fetchUserProfile, fetchAppSettings]); // Tambahkan dependencies

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd save these to a settings table
      // For now, we'll just show a success message
      
      toast({
        title: 'Settings updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating settings',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) throw error;

      toast({
        title: 'Password reset email sent!',
        description: 'Check your email for reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error sending reset email',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Heading mb={6}>Settings</Heading>

        <Tabs 
          variant="enclosed" 
          colorScheme="blue"
          index={activeTab}
          onChange={setActiveTab}
        >
          <TabList>
            <Tab>Profile</Tab>
            <Tab>App Settings</Tab>
            <Tab>Security</Tab>
            <Tab>About</Tab>
          </TabList>

          <TabPanels>
            {/* Profile Settings */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Profile Information</Heading>
                      <form onSubmit={handleProfileUpdate}>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                              value={profileData.full_name}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                full_name: e.target.value
                              }))}
                              placeholder="Your full name"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                              value={profileData.email}
                              isReadOnly
                              bg="gray.50"
                              placeholder="Your email"
                            />
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              Email cannot be changed
                            </Text>
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={loading}
                          >
                            Update Profile
                          </Button>
                        </VStack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Account Overview</Heading>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="medium">Role</Text>
                          <Badge colorScheme="green">Administrator</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontWeight="medium">Status</Text>
                          <Badge colorScheme="blue">Active</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontWeight="medium">Member Since</Text>
                          <Text fontSize="sm">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </Text>
                        </HStack>

                        <Divider />

                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Text fontSize="sm">
                            You have full administrative access to all features.
                          </Text>
                        </Alert>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            {/* App Settings */}
            <TabPanel>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Application Settings</Heading>
                  <form onSubmit={handleAppSettingsUpdate}>
                    <VStack spacing={6} align="stretch">
                      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                        <FormControl>
                          <FormLabel>Site Name</FormLabel>
                          <Input
                            value={appSettings.site_name}
                            onChange={(e) => setAppSettings(prev => ({
                              ...prev,
                              site_name: e.target.value
                            }))}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Max File Size (MB)</FormLabel>
                          <Input
                            type="number"
                            value={appSettings.max_file_size}
                            onChange={(e) => setAppSettings(prev => ({
                              ...prev,
                              max_file_size: parseInt(e.target.value)
                            }))}
                          />
                        </FormControl>
                      </Grid>

                      <FormControl>
                        <FormLabel>Site Description</FormLabel>
                        <Input
                          value={appSettings.site_description}
                          onChange={(e) => setAppSettings(prev => ({
                            ...prev,
                            site_description: e.target.value
                          }))}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Supported File Formats</FormLabel>
                        <Input
                          value={appSettings.supported_formats}
                          onChange={(e) => setAppSettings(prev => ({
                            ...prev,
                            supported_formats: e.target.value
                          }))}
                          placeholder="pdf,mp4,jpg,png"
                        />
                      </FormControl>

                      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0" htmlFor="maintenance-mode">
                            Maintenance Mode
                          </FormLabel>
                          <Switch
                            id="maintenance-mode"
                            isChecked={appSettings.maintenance_mode}
                            onChange={(e) => setAppSettings(prev => ({
                              ...prev,
                              maintenance_mode: e.target.checked
                            }))}
                            colorScheme="blue"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0" htmlFor="allow-registrations">
                            Allow User Registrations
                          </FormLabel>
                          <Switch
                            id="allow-registrations"
                            isChecked={appSettings.allow_registrations}
                            onChange={(e) => setAppSettings(prev => ({
                              ...prev,
                              allow_registrations: e.target.checked
                            }))}
                            colorScheme="blue"
                          />
                        </FormControl>
                      </Grid>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={loading}
                        alignSelf="flex-start"
                      >
                        Save Settings
                      </Button>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Password & Security</Heading>
                      <VStack spacing={4} align="stretch">
                        <Alert status="warning" borderRadius="md">
                          <AlertIcon />
                          <Text fontSize="sm">
                            Last password change: 30 days ago
                          </Text>
                        </Alert>

                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={handlePasswordReset}
                          isLoading={loading}
                        >
                          Send Password Reset Email
                        </Button>

                        <Divider />

                        <Heading size="sm">Session Management</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Current session started: {new Date().toLocaleString()}
                        </Text>
                        
                        <Button
                          colorScheme="red"
                          variant="outline"
                          onClick={() => {/* signOut function */}}
                        >
                          Sign Out All Devices
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Security Logs</Heading>
                      <VStack spacing={3} align="stretch">
                        <Box p={3} bg="gray.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">Login successful</Text>
                          <Text fontSize="xs" color="gray.600">
                            {new Date().toLocaleString()} • From Chrome, Windows
                          </Text>
                        </Box>
                        
                        <Box p={3} bg="gray.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">Password changed</Text>
                          <Text fontSize="xs" color="gray.600">
                            30 days ago • From your account
                          </Text>
                        </Box>

                        <Button size="sm" variant="ghost" alignSelf="flex-start">
                          View All Logs
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            {/* About */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                      <Heading size="lg" mb={2}>CekHealth Admin</Heading>
                      <Text color="gray.600" fontSize="lg">
                        Version 1.0.0
                      </Text>
                    </Box>

                    <Divider />

                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                      <Box>
                        <Heading size="sm" mb={3}>System Information</Heading>
                        <VStack spacing={2} align="stretch">
                          <HStack justify="space-between">
                            <Text fontSize="sm">Framework</Text>
                            <Badge>Next.js</Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">UI Library</Text>
                            <Badge>Chakra UI</Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Database</Text>
                            <Badge colorScheme="green">Supabase</Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Environment</Text>
                            <Badge colorScheme="blue">Development</Badge>
                          </HStack>
                        </VStack>
                      </Box>

                      <Box>
                        <Heading size="sm" mb={3}>Support</Heading>
                        <VStack spacing={3} align="stretch">
                          <Text fontSize="sm">
                            For technical support or questions, please contact:
                          </Text>
                          <Text fontSize="sm" fontWeight="medium">
                            support@cekhealth.com
                          </Text>
                          <Button size="sm" colorScheme="blue" variant="outline">
                            Documentation
                          </Button>
                        </VStack>
                      </Box>
                    </Grid>

                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="medium">Need help?</Text>
                        <Text fontSize="sm">
                          Check our documentation or contact our support team for assistance.
                        </Text>
                      </Box>
                    </Alert>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </AdminLayout>
  );
}