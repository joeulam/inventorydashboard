"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPassword(){
  const [password, setPassword] = useState("")
  const router = useRouter()
  const updatePassword = async () => {
    const supabase = createClient();
    await supabase.auth.updateUser({ password: password })
    router.push(`/app/dashboard`)
  }
  return(
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
    <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">New password</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
              <Button onClick={updatePassword} type="button" className="w-full cursor-pointer">
                Submit
              </Button>
              
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
      </div>
  )
}