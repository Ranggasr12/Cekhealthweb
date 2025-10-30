import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      console.log('✅ Auth callback successful');
    } catch (error) {
      console.error('❌ Auth callback error:', error);
    }
  }

  // Redirect to admin dashboard after email verification
  return NextResponse.redirect(`${requestUrl.origin}/admin`);
}