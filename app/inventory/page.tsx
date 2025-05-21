"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { DataTable } from "./inventoryTable";
import { AddNewInventoryCard } from "./popupModal";
import {
  deleteItem,
  getInventory,
  getItemById,
} from "../../utils/suprabaseInventoryFunctions";
import { getColumns } from "./columns";
import { InventoryItem } from "@/utils/datatypes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; 

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
  }, []);

  const router = useRouter();

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.supplier}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen sm:w-[100vw]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Inventory</h1>
          <AddNewInventoryCard
            itemToEdit={selectedItem}
            open={openModal}
            onOpenChange={(v) => {
              setOpenModal(v);
              if (!v) setSelectedItem(null);
            }}
            onAdd={fetchInventory}
          />
        </div>

        <div className="mt-6 max-w-md">
          <Input
            type="text"
            placeholder="Search inventory by name or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="pt-10">
          {loading ? (
            <>loading...</>
          ) : (
            <DataTable
              columns={getColumns(handleEdit, handleDelete, router)}
              data={filteredItems}
            />
          )}
        </div>
      </main>
    </div>
  );
}
