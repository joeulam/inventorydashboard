"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { DataTable } from "./currentCartTable";
import {
  deleteItem,
  getCurrentOrder,
  getItemById,
  getTotalInventory,
  getTotalQuantity,
} from "../../utils/suprabaseInventoryFunctions";
import { getColumnsOrder } from "./orderColumns";
import { InventoryItem, OrderDataType } from "@/utils/datatypes";
import { AddNewInventoryCard } from "../orderHistory/popupOrderModal";
import { Button } from "@/components/ui/button";

export default function Order() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [total, setTotal] = useState(0.0);
  const [quantity, setQuantity] = useState(0);

  const fetchOrder = async () => {
    setLoading(true);
    let data = await getCurrentOrder();
    data = await Promise.all(
      data.map(async (item: OrderDataType) => {
        const fullItem = await getItemById(item.item_id, "inventory");
        return {
          ...item,
          supplier: (fullItem as InventoryItem).supplier,
        };
      })
    );
    const totalCost = await getTotalInventory();
    const totalQuantity = await getTotalQuantity();
    setQuantity(totalQuantity)
    setTotal(totalCost);
    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const error = await deleteItem(id, "cart");
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      const totalCost = await getTotalInventory();
      const totalQuantity = await getTotalQuantity();
      setQuantity(totalQuantity)
      setTotal(totalCost);
    } else {
      console.error("Delete failed:", error.message);
    }
  };

  const handleEdit = async (id: string) => {
    const item = await getItemById(id, "cart");
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
          <h1 className="text-3xl">Current Order</h1>
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
            <>
              <DataTable
                columns={getColumnsOrder(handleEdit, handleDelete)}
                data={items}
              />

              <div className="flex flex-col justify-end mt-4">
                <h1 className="mt-5 font-bold text-right mr-10">Quantity: {quantity}</h1>
                <h1 className="mt-5 font-bold text-right mr-10">Total: {total}</h1>
                <Button className="mt-5">Submit</Button>
              </div>

            </>
          )}
        </div>
      </main>
    </div>
  );
}
