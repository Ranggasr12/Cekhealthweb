import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();

  // Ambil session dari cookie
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika tidak ada session → redirect ke login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Ambil role dari profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // Jika role tidak ditemukan → default guest
  const role = profile?.role ?? "guest";

  // Proteksi route berdasarkan role
  const pathname = req.nextUrl.pathname;

  // Jika user bukan admin tapi akses /admin → tolak
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return res;
}

// Tentukan middleware berjalan dimana saja
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
