import { NextResponse } from "next/server";
import { supabase } from "./lib/supabaseClient";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const session = await supabase.auth.getSession();

  const adminRoutes = ["/admin", "/admin/makalah", "/admin/video", "/admin/pertanyaan"];

  if (adminRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!session?.data?.session?.user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
