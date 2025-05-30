"use client";
import "../globals.css";
import React from "react";
import { SignupForm } from "./signupVisual";


export default function SignUp() {
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-[100%] max-w-sm md:max-w-3xl sm:w-11/12">
      <SignupForm />
      </div>
    </div>
  );
}
