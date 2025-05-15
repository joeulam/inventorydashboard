"use client";

import { createClient } from "@/utils/supabase/client";
import { InventoryItem } from "./datatypes";


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

export async function deleteItem(id: string, table: string) {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  return error;
}

export async function getItemById(id: string, table: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Fetch inventory error:", error.message);
    return null;
  }

  return data;
}

export async function updateItem(id: string, values: Partial<InventoryItem>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("inventory")
    .update(values)
    .eq("id", id);

  return error;
}

export async function addToCart(id: string, quantity:number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");

  const item = await getItemById(id, "inventory");
  if (!item) throw new Error("Item not found");

  const { error } = await supabase.from("cart").insert([
    {
      user_id: user.id,
      item_id: item.id,
      item_name: item.name,
      quantity: quantity,
      buyingCost: item.buyingCost,
    },
  ]);

  return error;
}

export async function getCurrentOrder() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .order("added_at", { ascending: false });
  console.log(data)
  if (error) {
    console.error("Fetch current order error:", error.message);
    return [];
  }

  return data || [];
}

export async function getOrderHistory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("order")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch current order error:", error.message);
    return [];
  }

  return data || [];
}

