// src/utils/checkAdmin.js
import { supabase } from "@/lib/supabase";

export async function ensureAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not_logged_in" };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) return { ok: false, reason: "no_profile" };
  return { ok: profile.role === "admin", role: profile.role, user };
}
