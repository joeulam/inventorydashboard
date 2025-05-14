"use client";
import "../globals.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      setError(error.message);
    } else {
      console.log("User signed up:", data.user);
      router.push("/dashboard");
    }
  };
  const back = () => {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-3xl font-semibold">Sign Up</h1>
        {error && (
          <Alert variant="destructive" className="w-full flex flex-row items-center gap-2">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </Alert>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className='cursor-pointer' onClick={handleSignup}>Sign Up</Button>
        <Button className='cursor-pointer' onClick={back}>back</Button>
      </div>
    </div>
  );
}
