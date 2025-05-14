"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
      }
      router.push("/");
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-medium">Logging out...</h1>
    </div>
  );
}
