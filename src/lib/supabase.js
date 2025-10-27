import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('=== SUPABASE CONFIGURATION ===')
console.log('URL:', supabaseUrl ? '✓ Loaded' : '✗ Missing')
console.log('Key:', supabaseAnonKey ? '✓ Loaded' : '✗ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)