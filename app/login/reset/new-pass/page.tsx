"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const waitForSession = async () => {
      if (!code) {
        setErrorMsg("Missing code in URL. Please retry the reset link.");
        setLoading(false);
        return;
      }

      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (data?.session) {
          setSessionLoaded(true);
          break;
        } else if (error) {
          console.error("Exchange failed:", error.message);
          setErrorMsg("Failed to validate session. Please try again.");
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setLoading(false);
    };

    waitForSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });

    if (!error) {
      router.push("/dashboard");
    } else {
      console.error("Password reset failed:", error.message);
      setErrorMsg("Password update failed. Try again later.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">New Password</h1>
                  {loading && (
                    <p className="text-sm text-muted-foreground">
                      Waiting for session...
                    </p>
                  )}
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!sessionLoaded}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!sessionLoaded || loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
