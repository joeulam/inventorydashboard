"use client";
import "../globals.css";
import React from "react";

import { LoginForm } from "./loginVisual";

export default function Login() {
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-[100%] max-w-sm md:max-w-3xl sm:w-11/12">
        <LoginForm />
      </div>
    </div>
  );
}
