"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [sessionExists, setSessionExists] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionExists(true);
      } else {
        setErrorMsg("You must be logged in to change your password.");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!password.trim() || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (!error) {
      setSuccessMsg("Password updated successfully.");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      console.error("Password update failed:", error.message);
      setErrorMsg("Password update failed. " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            Change Password
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}
              {successMsg && (
                <p className="text-sm text-green-600 font-medium">
                  {successMsg}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!sessionExists}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={!sessionExists || loading}
                
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
