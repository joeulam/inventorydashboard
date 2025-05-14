'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { redirect } from "next/navigation";

export default function Home() {
  const router = useRouter();  
  useEffect(() => {
    const fetchTodos = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (user) {
        redirect('/dashboard');
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <Button className='cursor-pointer' onClick={() => router.push('/login')}>Login</Button>
      <Button className='cursor-pointer' variant="outline" onClick={() => router.push('/signUp')}>Sign Up</Button>
    </div>
  );
}
