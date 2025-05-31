'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { redirect } from "next/navigation";
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();  

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (user) {
        redirect('/dashboard');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 text-center">
      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src="/undraw_data-reports_l2u3.svg"
          alt="Inventory Illustration"
          className="w-72 mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">Invery</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Manage your inventory with ease. Track stock levels, visualize trends, and stay organized — all in one place.
        </p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="w-full cursor-pointer sm:w-auto px-8 py-6 text-lg"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer sm:w-auto px-8 py-6 text-lg"
            onClick={() => router.push('/signUp')}
          >
            Sign Up
          </Button>
        </motion.div>
      </motion.div>

      <footer className="mt-20 text-xs text-gray-400">
        © {new Date().getFullYear()} Invery. All rights reserved.
      </footer>
    </div>
  );
}
