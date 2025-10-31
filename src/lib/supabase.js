import { createClient } from '@supabase/supabase-js'

// ==================== CONFIGURATION ====================
const SUPABASE_CONFIG = {
  // Development credentials (ganti dengan project Supabase Anda)
  development: {
    url: 'https://gcnblwhhxtvvetpzgleq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbmJsd2hoeHR2dmV0cHpnbGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjAwMjksImV4cCI6MjA3NzI5NjAyOX0.gF2u0QNWt1108AwPlHHY9YSYn-ozan4X-GdgOtzmJUA'
  },
  // Production credentials (akan diisi oleh environment variables)
  production: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

// Pilih config berdasarkan environment
const isProduction = process.env.NODE_ENV === 'production';
const config = isProduction ? SUPABASE_CONFIG.production : SUPABASE_CONFIG.development;

// Validasi config
const isMockMode = !config.url || !config.anonKey || 
                  config.url.includes('mock-url') || 
                  config.anonKey.includes('mock-key');

console.log('🔧 Supabase Config:', {
  environment: isProduction ? 'production' : 'development',
  url: config.url ? `${config.url.substring(0, 20)}...` : 'missing',
  anonKey: config.anonKey ? `${config.anonKey.substring(0, 20)}...` : 'missing',
  isMockMode
});

// Buat client Supabase
const supabase = createClient(config.url || 'https://mock-url.supabase.co', config.anonKey || 'mock-key');

// ==================== AUTH FUNCTIONS ====================
export const authSignIn = async (email, password) => {
  if (isMockMode) {
    console.log('🔐 MOCK LOGIN:', { email });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    return { 
      data: { 
        user: { 
          id: 'mock-user-1', 
          email: email,
          role: 'admin',
          aud: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString()
        },
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: {
            id: 'mock-user-1',
            email: email,
            role: 'admin'
          }
        }
      }, 
      error: null 
    };
  }
  
  try {
    console.log('🔐 REAL LOGIN ATTEMPT to:', config.url);
    console.log('📧 Email:', email);
    
    const result = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password.trim() 
    });
    
    console.log('🔐 LOGIN RESULT:', result.error ? `ERROR: ${result.error.message}` : 'SUCCESS');
    return result;
    
  } catch (error) {
    console.error('🔐 LOGIN EXCEPTION:', error);
    return {
      data: null,
      error: error
    };
  }
}

export const authSignOut = async () => {
  if (isMockMode) {
    console.log('🔐 MOCK LOGOUT');
    return { error: null };
  }
  
  return await supabase.auth.signOut();
}

export const getSession = async () => {
  if (isMockMode) {
    console.log('🔐 MOCK GET SESSION');
    return { 
      data: { 
        session: {
          access_token: 'mock-token',
          user: {
            id: 'mock-user-1',
            email: 'admin@cekhealth.com',
            role: 'admin'
          }
        }
      }, 
      error: null 
    };
  }
  
  return await supabase.auth.getSession();
}

export const onAuthStateChange = (callback) => {
  if (isMockMode) {
    console.log('🔐 MOCK AUTH STATE CHANGE');
    const subscription = {
      data: { 
        subscription: { 
          unsubscribe: () => console.log('🔐 Mock unsubscribe') 
        } 
      }
    };
    
    // Simulate signed in state after delay
    setTimeout(() => {
      callback('SIGNED_IN', {
        user: { 
          id: 'mock-user-1', 
          email: 'admin@cekhealth.com',
          role: 'admin'
        }
      });
    }, 500);
    
    return subscription;
  }
  
  return supabase.auth.onAuthStateChange(callback);
}

// ==================== PROFILE FUNCTIONS ====================
export const getProfile = async (userId) => {
  if (isMockMode) {
    console.log('👤 MOCK GET PROFILE:', userId);
    return {
      data: {
        id: userId,
        user_id: userId,
        email: 'admin@cekhealth.com',
        full_name: 'Admin CekHealth',
        role: 'admin',
        avatar_url: null,
        created_at: new Date().toISOString(),
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

    return { data, error };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return { data: null, error };
  }
}

// ... (rest of your existing functions can remain the same)

export { supabase };