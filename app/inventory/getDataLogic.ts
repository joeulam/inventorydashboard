"use client";

import { createClient } from "@/utils/supabase/client";

export type InventoryItem = {
  id: string;
  name: string;
  cost: number;
  supplier: string;
  amount: number;
  created_at: string;
  user_id: string;
};

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch inventory error:", error.message);
    return [];
  }

  return data || [];
}

export async function deleteItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("inventory").delete().eq("id", id);
  return error;
}
