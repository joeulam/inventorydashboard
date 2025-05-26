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
import { useRouter } from "next/navigation";

export default function Category() {
  const [categories, setCategories] = useState<CategoryDataType[]>([]);
  const router = useRouter();
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
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Categories</h1>

          <Table>
            <TableCaption className="text-gray-500">
              A list of all categories you’ve created
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-gray-600">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => router.push(`/category/${item.id}`)}
                  className="hover:bg-gray-100 transition cursor-pointer"
                >
                  <TableCell className="font-medium text-gray-800">
                    {item.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
