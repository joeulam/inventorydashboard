"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../../globals.css";
import { InventoryItem, OrderDataType } from "@/utils/datatypes";
import { getImage, getItemById } from "@/utils/suprabaseInventoryFunctions";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HistoricalOrder() {
  const [items, setItems] = useState<(InventoryItem & { imageUrl?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const slug = useParams();
  const supabase = createClient();

  const fetchOrderItems = async () => {
    setLoading(true);
    if (slug.slug) {
      const { data, error } = await supabase.from("orders").select("*").eq("id", slug.slug).single();
      if (error) {
        console.error(error);
        return;
      }
      const enriched = await Promise.all(
        (data.items || []).map(async (item: OrderDataType) => {
          console.log(item)
          const itemInv = await getItemById(item.item_id, "inventory") as InventoryItem
          const imageUrl = itemInv.image ? await getImage(itemInv.image) : null;

          return { ...itemInv, imageUrl };
        })
      );
      setItems(enriched);
    }
    setLoading(false);
  };
  const router = useRouter()
  useEffect(() => {
    fetchOrderItems();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold mb-6">Historical Order Details</h1>
          <Button onClick={() => router.back()} className="cursor-pointer">Back</Button>
          </div>
          
          {loading ? (
            <p className="text-center text-muted-foreground">Loading order...</p>
          ) : (
            items.map((item, index) => (
              <Link key={index} href={`../../inventory/${item.id}`}>
              <Card key={index} className="rounded-2xl shadow p-6 mb-6">
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
                    <p><strong>Buying Price:</strong> ${item.buyingCost}</p>
                    <p><strong>Selling Price:</strong> ${item.sellingCost}</p>
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
