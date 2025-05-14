"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";

export function useProfile() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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
      console.log(user)
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) setError(error.message);
      else {
        setEmail(user.email || "");
        setUsername(data.username || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  return { email, username, setUsername, error, setError, supabase, user, loading };
}

export async function updateProfile(
  supabase: ReturnType<typeof createClient>,
  username: string,
  setError: (err: string | null) => void,
  setSuccess: (msg: string | null) => void
) {
  setError(null);
  setSuccess(null);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("users").upsert({
    id: user?.id,
    username,
  });

  if (error) setError(error.message);
  else setSuccess("Profile updated successfully");
}

export default function Profile() {
  const { email, username, setUsername, error, setError, supabase, loading } = useProfile();
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    await updateProfile(supabase, username, setError, setSuccess);
    setUpdating(false);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      {error && <Alert variant="destructive">{error}</Alert>}
      {success && <Alert variant="default">{success}</Alert>}

      <Input value={email} disabled className="max-w-md w-full" />
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="max-w-md w-full"
      />

      <Button onClick={handleUpdate} disabled={updating}>
        {updating ? "Updating..." : "Update Profile"}
      </Button>
    </div>
  );
}
