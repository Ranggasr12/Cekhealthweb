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
  // ... rest of your mock data
];

export const mockVideos = [
  // ... your mock videos
];

export const mockPertanyaan = [
  // ... your mock questions
];

export const mockUsers = [
  // ... your mock users
];