import { NextResponse } from 'next/server'

export function middleware(request) {
  // Cek jika mengakses halaman admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Cek di cookies atau session
    const adminEmail = request.cookies.get('adminEmail')
    const isAdmin = request.cookies.get('isAdmin')
    
    if (!adminEmail || !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}