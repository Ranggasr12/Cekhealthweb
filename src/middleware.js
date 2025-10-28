// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  console.log('🛣️ Middleware checking:', pathname)
  
  // Skip middleware untuk route public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Untuk route admin, kita akan handle auth di client side
  // Karena Supabase auth butuh client-side
  if (pathname.startsWith('/admin')) {
    console.log('🔐 Admin route accessed:', pathname)
    
    // Untuk sementara, ALLOW SEMUA akses ke admin
    // Auth check akan dilakukan di client side
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}