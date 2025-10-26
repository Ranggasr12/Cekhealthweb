"use client";

import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data.role !== "admin") router.push("/");
    }
    checkRole();
  }, []);

  return <>{children}</>;
}
