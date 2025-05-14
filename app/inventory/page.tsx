"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { DataTable } from "./inventoryTable";
import { AddNewInventoryCard } from "./popupModal";
import { deleteItem, getInventory } from "./getDataLogic";
import { getColumns } from "./columns";

export type InventoryItem = {
  id: string;
  name: string;
  cost: number;
  supplier: string;
  amount: number;
  created_at: string;
  user_id: string;
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchInventory = async () => {
    setLoading(true);
    const data = await getInventory();
    setItems(data);
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    const error = await deleteItem(id);
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Delete failed:", error.message);
    }
  };
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Inventory</h1>
          <AddNewInventoryCard onAdd={fetchInventory} />
        </div>

        <div className="pt-10">
          {loading ? (
            <>loading...</>
          ) : (
            <DataTable columns={getColumns(handleDelete)} data={items} />
          )}
        </div>
      </main>
    </div>
  );
}
