import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Ambil session user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Kalau tidak login → redirect ke /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = session.user.id;

  // Ambil role user dari tabel `profiles`
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = profile.role;

  const pathname = req.nextUrl.pathname;

  // Jika berusaha masuk ke /admin tapi role bukan admin → alihkan ke dashboard
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

// Tentukan hal yang mau dilindungi
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // tambahkan path sesuai kebutuhan
};
