"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../../globals.css"
import { InventoryItem } from "@/utils/datatypes";
import { getImage } from "@/utils/suprabaseInventoryFunctions";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupplierInventoryPage() {
  const [items, setItems] = useState<(InventoryItem & { imageUrl?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const slug = useParams();
  const supabase = createClient();
  const router = useRouter();

  const fetchSupplierItems = async () => {
    setLoading(true);
    const supplier = decodeURIComponent(slug.slug?.toString() || "");
    if (!supplier) return;

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("supplier", supplier);

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    const enriched = await Promise.all(
      (data || []).map(async (item: InventoryItem) => {
        const imageUrl = item.image ? await getImage(item.image) : null;
        return { ...item, imageUrl };
      })
    );

    setItems(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchSupplierItems();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-bold mb-6">Items from {decodeURIComponent(slug.slug?.toString() || "")}</h1>
            <Button onClick={() => router.back()}>Back</Button>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">No items found for this supplier.</p>
          ) : (
            items.map((item) => (
              <Link key={item.id} href={`/inventory/${item.id}`}>
                <Card className="rounded-2xl shadow p-6 mb-6 hover:bg-gray-100 transition">
                  <div className="flex gap-6">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={150}
                        height={150}
                        className="rounded"
                      />
                    ) : (
                      <div className="w-[150px] h-[150px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p><strong>Quantity:</strong> {item.amount}</p>
                      <p><strong>Supplier:</strong> {item.supplier}</p>
                      <p><strong>Buying Price:</strong> ${item.buyingCost.toFixed(2)}</p>
                      <p><strong>Selling Price:</strong> ${item.sellingCost.toFixed(2)}</p>
                      <p><strong>Barcode:</strong> {item.barcode}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
