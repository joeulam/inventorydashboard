"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const resetPass = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: ' http://invery.vercel.app/login/reset/new-pass',
    })    
    
    if (error) {
      console.error("Reset error:", error.message);
      setError("Failed to send reset email. Please try again.");
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }

    setLoading(false);
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
                resetPass();
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to receive a reset link.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {message && <p className="text-green-600 text-sm">{message}</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Reset"}
                </Button>

                <Button
                  onClick={router.back}
                  variant="secondary"
                  type="button"
                  className="w-full cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
