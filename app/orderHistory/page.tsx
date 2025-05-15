"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { AddNewInventoryCard } from "./popupOrderModal";
import { deleteItem, getItemById, getOrderHistory } from "../../utils/suprabaseInventoryFunctions";
import { getColumns } from "./columns";
import { InventoryItem } from "@/utils/datatypes";
import { DataTable } from "./orderHistoryTable";



export default function OrderHistory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    const data = await getOrderHistory();
    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const error = await deleteItem(id, "order");
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Delete failed:", error.message);
    }
  };

  const handleEdit = async (id: string) => {
    const item = await getItemById(id, "orders");
    if (item) {
      setSelectedItem(item);
      setOpenModal(true);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Order History</h1>
          <AddNewInventoryCard
            itemToEdit={selectedItem}
            open={openModal}
            onOpenChange={(v) => {
              setOpenModal(v);
              if (!v) setSelectedItem(null);
            }}
            onAdd={fetchOrder}
          />
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
