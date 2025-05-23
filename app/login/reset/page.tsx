"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswordReset(){
  const [email, setEmail] = useState("")
  const router = useRouter()
  const resetPass = async () => {
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://invery.vercel.app/login/reset/new-pass',
    })
    console.log("resetted")
  }
  return(
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
    <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Invy account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <Button onClick={resetPass} type="button">Reset</Button>
              <Button onClick={router.back} variant={`secondary`} type="button" className="w-full cursor-pointer">
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
      </div>
  )
}