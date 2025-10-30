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

  // Allow access to login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next()
  }

  // Redirect admin routes to login if not authenticated
  if (pathname.startsWith('/admin')) {
    console.log('🔐 Admin route accessed:', pathname)
    
    // Auth check akan dilakukan di client side untuk admin
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}