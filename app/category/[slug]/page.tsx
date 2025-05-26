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
  const router = useRouter();
  const supabase = createClient();

  const [categoryName, setCategoryName] = useState<string>("");
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: categories, error: catError } = await supabase
        .from("inventory_categories")
        .select("*");

      if (catError) {
        console.error("Category fetch error:", catError.message);
        return;
      }

      const matchedCategory = categories.find((cat) => cat.id === slug.slug);
      setCategoryName(matchedCategory ? matchedCategory.name : "Unknown Category");

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
  }, [slug, supabase]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Category: {categoryName}
            </h1>
            <Button variant="outline" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Items in this category:
          </h2>

          {items.length === 0 ? (
            <p className="text-gray-500">No items found.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Link key={item.id} href={`/inventory/${item.id}`}>
                  <Card className="p-4 hover:bg-gray-100 transition cursor-pointer">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
