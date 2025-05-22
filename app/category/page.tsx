"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";

import { CategoryDataType } from "@/utils/datatypes";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";

export default function Category() {
  const [categories, setCategories] = useState<CategoryDataType[]>([]);

  const supabase = createClient();



  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("inventory_categories").select("*");
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
          {
            categories.map((item, index) => {
              return(
              <Card className="h-3/12 p-10 mb-5" key={index}>
                {item.name}
              </Card>
              )
            })
          }
          
        </div>
      </main>
    </div>
  );
}
