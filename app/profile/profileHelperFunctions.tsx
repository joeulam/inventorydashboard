"use client";
import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { getUserData, setStoreName, updateStoreName } from "@/utils/suprabaseInventoryFunctions";

export function useProfile() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if(localStorage.getItem("companyName")){
        const storeDetail = localStorage.getItem("companyName")
        setStoreName(storeDetail!)
      } else{
        const storeDetail = await getUserData()
        setStoreName(storeDetail.store_name)
      }
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      
      setUser(user);
      setEmail(user.email || "");
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  return { email, storeName, error, setError, supabase, user, loading };
}

export async function updateProfile(
  supabase: ReturnType<typeof createClient>,
  setError: (err: string | null) => void,
  setSuccess: (msg: string | null) => void,
  storeName? :string
) {
  setError(null);
  setSuccess(null);
  if(storeName){
    const profileExist = await updateStoreName(storeName)
    localStorage.removeItem("companyName")
    localStorage.setItem("companyName",storeName)
    if(profileExist){
      const error = await setStoreName(storeName)
      if (error) setError(error.message);
      else setSuccess("Profile updated successfully");
      return (error)
    }
  }
  return (null)
}
