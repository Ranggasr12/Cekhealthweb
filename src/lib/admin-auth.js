// lib/admin-auth.js
import { supabase } from './supabase';

export const checkAdminAccess = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { hasAccess: false, redirect: '/login' };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      return { hasAccess: false, redirect: '/' };
    }

    if (profile.role !== 'admin') {
      return { hasAccess: false, redirect: '/' };
    }

    return { hasAccess: true, user: session.user, role: profile.role };
    
  } catch (error) {
    console.error('Admin check error:', error);
    return { hasAccess: false, redirect: '/' };
  }
};