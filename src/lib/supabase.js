import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validasi environment variables
const isMockMode = !supabaseUrl || !supabaseAnonKey || 
                  supabaseUrl.includes('mock-url') || 
                  supabaseAnonKey.includes('mock-anon-key');

if (isMockMode) {
  console.warn('⚠️  Supabase environment variables are not set. Using mock data.');
  console.warn('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.warn('   Get them from: https://supabase.com/dashboard/project/_/settings/api');
}

// Buat client Supabase
const supabase = createClient(
  supabaseUrl || 'https://mock-url.supabase.co',
  supabaseAnonKey || 'mock-anon-key'
)

// Export functions yang handle both real and mock mode
export const authSignIn = async (email, password) => {
  if (isMockMode) {
    // Mock successful login untuk development
    console.log('Mock login:', email);
    return { 
      data: { user: { id: 'mock-user-1', email } }, 
      error: null 
    };
  }
  
  return await supabase.auth.signInWithPassword({ email, password });
}

export const authSignOut = async () => {
  if (isMockMode) {
    console.log('Mock logout');
    return { error: null };
  }
  
  return await supabase.auth.signOut();
}

export const getSession = async () => {
  if (isMockMode) {
    // Return null session di mock mode
    return { data: { session: null }, error: null };
  }
  
  return await supabase.auth.getSession();
}

export const onAuthStateChange = (callback) => {
  if (isMockMode) {
    // Mock auth state change
    const subscription = {
      data: { subscription: { unsubscribe: () => {} } }
    };
    // Trigger callback dengan null session
    setTimeout(() => callback('SIGNED_OUT', null), 100);
    return subscription;
  }
  
  return supabase.auth.onAuthStateChange(callback);
}

// ==================== PROFILE FUNCTIONS ====================

export const getProfile = async (userId) => {
  if (isMockMode) {
    console.log('Mock getProfile:', userId);
    return {
      data: {
        id: userId,
        username: 'user123',
        full_name: 'User Mock',
        avatar_url: null,
        updated_at: new Date().toISOString()
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Jika profile tidak ditemukan, buat profile baru
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        return await createProfile(userId);
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return { data: null, error };
  }
}

export const createProfile = async (userId, profileData = {}) => {
  if (isMockMode) {
    console.log('Mock createProfile:', userId);
    return {
      data: {
        id: userId,
        username: 'user123',
        full_name: 'User Mock',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        ...profileData
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: profileData.username || null,
        full_name: profileData.full_name || null,
        avatar_url: profileData.avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { data: null, error };
  }
}

export const updateProfile = async (userId, updates) => {
  if (isMockMode) {
    console.log('Mock updateProfile:', userId, updates);
    return { 
      data: { ...updates, id: userId }, 
      error: null 
    };
  }

  try {
    // Cek apakah profile sudah ada
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    let result;

    if (checkError && checkError.code === 'PGRST116') {
      // Profile tidak ada, buat baru
      result = await createProfile(userId, updates);
    } else {
      // Update profile yang sudah ada
      result = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
    }

    return result;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return { data: null, error };
  }
}

// ==================== AVATAR UPLOAD FUNCTIONS ====================

export const uploadAvatar = async (file, userId) => {
  if (isMockMode) {
    console.log('Mock uploadAvatar:', file.name, userId);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPublicUrl = `https://mock-images.supabase.co/avatars/${userId}/${file.name}`;
    
    return {
      data: { publicUrl: mockPublicUrl },
      error: null
    };
  }

  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Uploading avatar to path:', filePath);

    // Upload file
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Tidak menggunakan upsert untuk menghindari conflict
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('Avatar uploaded successfully:', publicUrl);

    return {
      data: { publicUrl, filePath },
      error: null
    };

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return {
      data: null,
      error: error
    };
  }
}

export const deleteAvatar = async (fileUrl, userId) => {
  if (isMockMode) {
    console.log('Mock deleteAvatar:', fileUrl, userId);
    return { error: null };
  }

  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${userId}/${fileName}`;

    console.log('Deleting avatar from path:', filePath);

    // Delete file from storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) throw error;

    console.log('Avatar deleted successfully');
    return { error: null };

  } catch (error) {
    console.error('Error deleting avatar:', error);
    return { error };
  }
}

export const getAvatarUrl = (filePath) => {
  if (isMockMode) {
    return `https://mock-images.supabase.co/avatars/${filePath}`;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return publicUrl;
}

// ==================== STORAGE MANAGEMENT ====================

export const listUserAvatars = async (userId) => {
  if (isMockMode) {
    console.log('Mock listUserAvatars:', userId);
    return {
      data: [],
      error: null
    };
  }

  return await supabase.storage
    .from('avatars')
    .list(`${userId}`);
}

export const cleanupUserAvatars = async (userId, keepFile = null) => {
  if (isMockMode) {
    console.log('Mock cleanupUserAvatars:', userId, keepFile);
    return { error: null };
  }

  try {
    // List all user's avatar files
    const { data: files, error } = await listUserAvatars(userId);
    if (error) throw error;

    // Filter files to delete (all except the one to keep)
    const filesToDelete = files
      .filter(file => !keepFile || file.name !== keepFile)
      .map(file => `${userId}/${file.name}`);

    if (filesToDelete.length > 0) {
      console.log('Cleaning up avatars:', filesToDelete);
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete);

      if (deleteError) throw deleteError;
    }

    return { error: null };

  } catch (error) {
    console.error('Error cleaning up avatars:', error);
    return { error };
  }
}

// ==================== VALIDATION FUNCTIONS ====================

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, atau GIF.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 5MB.'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

// ==================== AUTH UTILITIES ====================

export const getCurrentUser = async () => {
  if (isMockMode) {
    return {
      data: { user: { id: 'mock-user-1', email: 'mock@example.com' } },
      error: null
    };
  }

  return await supabase.auth.getUser();
}

export const refreshSession = async () => {
  if (isMockMode) {
    return { data: { session: null }, error: null };
  }

  return await supabase.auth.refreshSession();
}

// Export untuk data operations
export { supabase };

// Export mock data untuk development
export const mockMakalah = [
  {
    id: '1',
    title: 'Panduan Kesehatan Jantung',
    description: 'Makalah tentang cara menjaga kesehatan jantung dan mencegah penyakit kardiovaskular',
    pdf_url: '/sample.pdf',
    file_name: 'panduan-jantung.pdf',
    file_size: 2048576,
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockVideos = [
  {
    id: '1',
    title: 'Cara Menjaga Kesehatan Mental',
    description: 'Video edukasi tentang pentingnya kesehatan mental',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://example.com/thumbnail1.jpg',
    duration: '15:30',
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockPertanyaan = [
  {
    id: '1',
    pertanyaan: 'Bagaimana kualitas tidur Anda?',
    kategori: 'tidur',
    skor_min: 0,
    skor_max: 10,
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockUsers = [
  {
    id: 'mock-user-1',
    email: 'user@example.com',
    username: 'user123',
    full_name: 'User Mock',
    avatar_url: null,
    created_at: '2024-01-15T10:00:00Z'
  }
];

// Mock profile data untuk development
export const mockProfile = {
  id: 'mock-user-1',
  username: 'user123',
  full_name: 'User Mock',
  avatar_url: null,
  updated_at: new Date().toISOString()
};