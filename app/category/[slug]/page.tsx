"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { InventoryItem } from "@/utils/datatypes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const slug = useParams();
  const supabase = createClient();

  const [categoryName, setCategoryName] = useState<string>("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all categories
      const { data: categories, error: catError } = await supabase
        .from("inventory_categories")
        .select("*");

      if (catError) {
        console.error("Category fetch error:", catError.message);
        return;
      }

      // Find category by id
      const matchedCategory = categories.find((cat) => cat.id === slug.slug);
      if (matchedCategory) {
        setCategoryName(matchedCategory.name);
      } else {
        setCategoryName("Unknown Category");
      }

      // Fetch inventory items where category_id matches
      const { data: inventoryData, error: invError } = await supabase
        .from("inventory")
        .select("*")
        .eq("category_id", slug.slug);

      if (invError) {
        console.error("Inventory fetch error:", invError.message);
        return;
      }

      setItems(inventoryData);
    };

fetchData();
  }, [slug]);

  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl mb-4">Category: {categoryName}</h1>
          <Button onClick={() => router.back()}>Back</Button>
          <h2 className="text-xl mb-2">Items in this category:</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items found.</p>
          ) : (
            items.map((item,index) => (
              <Link key={index} href={`../../inventory/${item.id}`}>
                <Card key={item.id} className="mb-4 p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Supplier: {item.supplier}
                  </p>
                </Card>
              </Link>
              
            ))
          )}
        </div>
      </main>
    </div>
  );
}
