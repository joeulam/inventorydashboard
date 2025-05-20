"use client";

import { createClient } from "@/utils/supabase/client";
import { InventoryItem, OrderDataType } from "./datatypes";
import imageCompression from "browser-image-compression";

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

export async function updateItem(id: string, updates: Partial<InventoryItem>) {
  const supabase = createClient();

  const { data: currentItem, error: fetchError } = await supabase
    .from("inventory")
    .select("buyingCost, sellingCost")
    .eq("id", id)
    .single();

  if (fetchError) return fetchError;

  const priceChanged =
    (updates.buyingCost !== undefined &&
      updates.buyingCost !== currentItem.buyingCost) ||
    (updates.sellingCost !== undefined &&
      updates.sellingCost !== currentItem.sellingCost);

  const { error: updateError } = await supabase
    .from("inventory")
    .update(updates)
    .eq("id", id);

  if (updateError) return updateError;

  if (priceChanged) {
    const { error: historyError } = await supabase
      .from("item_price_history")
      .insert([
        {
          item_id: id,
          buyingCost: updates.buyingCost ?? currentItem.buyingCost,
          sellingCost: updates.sellingCost ?? currentItem.sellingCost,
        },
      ]);
    if (historyError)
      console.error("Price history insert failed:", historyError.message);
  }

  return null;
}

export async function addToCart(id: string, quantity: number) {
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
      amount: quantity,
      buyingCost: item.buyingCost,
      status: "pending",
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
  console.log(data);
  if (error) {
    console.error("Fetch current order error:", error.message);
    return [];
  }

  return data || [];
}

export async function getOrderHistory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch current order error:", error.message);
    return [];
  }

  return data || [];
}

export async function getTotalInventory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Fetch current order error:", error.message);
    return 0.0;
  }
  let totalCost = 0;
  data.map((item: OrderDataType) => {
    totalCost += item.amount * item.buyingCost;
  });
  return totalCost || 0.0;
}

export async function getTotalQuantity() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Fetch current order error:", error.message);
    return 0;
  }
  let totalQuantity = 0;
  data.map((item: OrderDataType) => {
    totalQuantity += item.amount;
  });
  return totalQuantity || 0;
}

export async function uploadImage(file: File, path: string) {
  const supabase = createClient();

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const { data, error } = await supabase.storage
      .from("imagebucket")
      .upload(path, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    return data.path;
  } catch (err) {
    console.error("Compression or upload failed:", err);
    return null;
  }
}

export async function getImage(path: string) {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("imagebucket")
    .createSignedUrl(path, 60 * 60);

  console.log(data);
  if (error) {
    console.error("Signed URL error:", error.message);
    return null;
  }

  return data.signedUrl;
}

export async function submitOrder() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const currentCart = await getCurrentOrder();
  if (!currentCart.length) {
    throw new Error("Cart is empty");
  }

  const itemsWithDetails = await Promise.all(
    currentCart.map(async (cartItem) => {
      const inventoryItem = await getItemById(cartItem.item_id, "inventory");
      return {
        ...inventoryItem,
        quantity: cartItem.quantity || 1,
        totalPrice: inventoryItem.sellingCost * (cartItem.quantity || 1),
      };
    })
  );

  const totalAmount = itemsWithDetails.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const itemsArray = itemsWithDetails.map(
    ({ id, name, quantity, sellingCost }) => ({
      id,
      name,
      quantity,
      price: sellingCost,
    })
  );

  const { data, error } = await supabase.from("order").insert([
    {
      user_id: user.id,
      items: itemsArray,
      total: totalAmount,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Failed to submit order:", error.message);
    throw error;
  }

  await supabase.from("cart").delete().eq("user_id", user.id);

  return data;
}
export async function getCompletedOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("completed_orders") // make sure this table exists
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching completed orders:", error.message);
    return [];
  }

  return data;
}

export async function markOrdersCompleted(selectedIds: string[]) {
  const supabase = createClient();

  const { error } = await supabase
    .from("cart")
    .update({ status: "completed" })
    .in("id", selectedIds);

  return error;
}

export async function markOrderCurrent(selectedIds: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("cart")
    .update({ status: "pending" })
    .eq("id", selectedIds);
  return error;
}

export async function submitCompletedOrder(items: InventoryItem[]) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const total = items.reduce(
    (acc, item) => acc + item.buyingCost * item.amount,
    0
  );

  const { error } = await supabase.from("orders").insert([
    {
      user_id: user.id,
      items,
      total,
    },
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    return error;
  }

  await Promise.all(items.map((item) => deleteItem(item.id, "cart")));

  return null;
}

export async function getHistoricalPrice(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("item_price_history")
    .select("*")
    .eq("item_id", id);
  if (error) {
    console.error("Fetch error:", error.message);
    return error;
  }
  console.log(data);
  return data;
}

export async function getSuppliers() {
  const supabase = createClient();
  const { data, error } = await supabase
  .from("inventory")
  .select("*")
  const suppliers = <string[]>[]

  data?.map((item:InventoryItem) => suppliers.includes(item.supplier) ? null : suppliers.push(item.supplier))
  if(error){
    console.error("Fetch error:", error.message);
    return [];
  }

  return suppliers
}
