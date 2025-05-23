"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { hash } = window.location;
    const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
    const refreshToken = new URLSearchParams(hash.substring(1)).get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => setTokenLoaded(true))
        .catch((error) => {
          console.error("Failed to set session:", error.message);
          router.push("/login/reset");
        });
    } else {
      router.push("/login/reset");
    }
  }, []);

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Password update failed:", error.message);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0">
            <form
              className="p-6 md:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                updatePassword();
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">New Password</h1>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={!tokenLoaded}
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
