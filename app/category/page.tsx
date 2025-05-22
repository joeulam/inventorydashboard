"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";

import { CategoryDataType } from "@/utils/datatypes";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import router from "next/router";

export default function Category() {
  const [categories, setCategories] = useState<CategoryDataType[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("inventory_categories")
        .select("*");
      if (data) setCategories(data);
      if (error) console.error("Fetch error:", error);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl mb-6">Categories</h1>

          <Table>
            <TableCaption>A list of your Categories</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item, index) => (
                <TableRow
                  onClick={() => router.push(`category/${item.id}`)}
                  key={index}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
