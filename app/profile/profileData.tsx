"use client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useProfile, updateProfile } from "./profileHelperFunctions";

export default function Profile() {
  const { email, username, error, setError, supabase, loading } =
    useProfile();
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    await updateProfile(supabase, username, setError, setSuccess);
    setUpdating(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
        Loading profile...
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 space-y-6">

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            value={email}
            disabled
            className="w-full"
          />
        </div>

        {/* <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
        </div> */}

        {error ? (
          <Alert variant="destructive" className="w-full">
            <span className="font-semibold">Error:</span> 
            <span className="ml-12">{error}</span>
          </Alert>
        ):<></>}

        {success && (
          <Alert variant="default" className="w-full">
            {success}
          </Alert>
        )}

        <Button onClick={handleUpdate} disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}
