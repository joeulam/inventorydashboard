"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../../globals.css";
import { InventoryItem } from "@/utils/datatypes";
import { deleteItem, getInventory, getItemById } from "@/utils/suprabaseInventoryFunctions";
import { getColumns } from "../columns";
import { DataTable } from "../inventoryTable";

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);


  const fetchInventory = async () => {
    setLoading(true);
    const data = await getInventory();
    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const error = await deleteItem(id, "inventory");
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Delete failed:", error.message);
    }
  };

  const handleEdit = async (id: string) => {
    const item = await getItemById(id, "inventory");
    if (item) {
      setSelectedItem(item);
      setOpenModal(true);
    }
  };

  useEffect(() => {
    fetchInventory();
    console.log(openModal, selectedItem)
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Inventory</h1>
          
        </div>

        <div className="pt-10">
          {loading ? (
            <>loading...</>
          ) : (
            <DataTable columns={getColumns(handleEdit, handleDelete,)} data={items} />
          )}
        </div>
      </main>
    </div>
  );
}


