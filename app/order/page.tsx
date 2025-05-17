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
  markOrderCurrent,
  markOrdersCompleted,
} from "../../utils/suprabaseInventoryFunctions";
import { getColumnsOrder } from "./orderColumns";
import { InventoryItem } from "@/utils/datatypes";
import { AddNewInventoryCard } from "../orderHistory/popupOrderModal";
import { Button } from "@/components/ui/button";

export default function Order() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedOrders, setCompletedOrders] = useState<InventoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [total, setTotal] = useState(0.0);
  const [quantity, setQuantity] = useState(0);

  const fetchOrder = async () => {
    setLoading(true);

    const rawData = await getCurrentOrder();
    const currentItems: InventoryItem[] = [];
    const completedItems: InventoryItem[] = [];

    for (const item of rawData) {
      const fullItem = await getItemById(item.item_id, "inventory");
      const enrichedItem = {
        ...item,
        supplier: (fullItem as InventoryItem)?.supplier || "",
      };

      if (item.status === "completed") {
        completedItems.push(enrichedItem);
      } else {
        currentItems.push(enrichedItem);
      }
    }

    const totalCost = await getTotalInventory();
    const totalQuantity = await getTotalQuantity();
    setQuantity(totalQuantity);
    setCompletedOrders(completedItems);
    setTotal(totalCost);
    setItems(currentItems);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const error = await deleteItem(id, "cart");
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      const totalCost = await getTotalInventory();
      const totalQuantity = await getTotalQuantity();
      setQuantity(totalQuantity);
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

  const handleMove = async (id: string) => {
    const error = await markOrderCurrent(id);
    if (!error) {
      await fetchOrder();
    } else {
      console.error("Move to current failed:", error.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <section>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Current Order</h2>
              <div className="flex gap-2">
                <AddNewInventoryCard
                  itemToEdit={selectedItem}
                  open={openModal}
                  onOpenChange={(v) => {
                    setOpenModal(v);
                    if (!v) setSelectedItem(null);
                  }}
                  onAdd={fetchOrder}
                />
                <Button
                  className="cursor-pointer"
                  variant="secondary"
                  onClick={async () => {
                    console.log("Selected IDs:", selectedIds);
                    if (!selectedIds.length) return;
                    const error = await markOrdersCompleted(selectedIds);
                    if (!error) {
                      await fetchOrder();
                    } else {
                      console.error("Update failed:", error.message);
                    }
                  }}
                >
                  Mark as Completed
                </Button>
              </div>
            </div>
            {loading ? (
              <>loading...</>
            ) : (
              <div className="mt-5">
                <DataTable
                  columns={getColumnsOrder(
                    handleEdit,
                    handleDelete,
                    handleMove
                  )}
                  data={items}
                  onRowSelectionChange={(ids) => setSelectedIds(ids)}
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>
            {loading ? (
              <>Loading completed orders...</>
            ) : (
              <DataTable
                columns={getColumnsOrder(
                  () => {},
                  () => {},
                  handleMove // pass the actual function!
                )}
                data={completedOrders}
              />
            )}
          </section>
          <div className="flex flex-col justify-end mt-4">
            <h1 className="mt-5 font-bold text-right mr-10">
              Quantity: {quantity}
            </h1>
            <h1 className="mt-5 font-bold text-right mr-10">Total: {total}</h1>
            <Button className="mt-5">Submit</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
