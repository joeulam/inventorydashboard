"use client";

import { Sidebar } from "@/components/sidebar";

export default function Supplier() {
  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-hidden p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Supplier</h1>
        </div>
      </main>
    </div>
  );
}
