"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { DataTable } from "./inventoryTable";
import { AddNewInventoryCard } from "./popupModal";
import {
  deleteItem,
  getCategories,
  getImage,
  getInventory,
  getItemById,
} from "../../utils/suprabaseInventoryFunctions";
import { getColumns } from "./columns";
import { InventoryItem } from "@/utils/datatypes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { useDisplayMode } from "../../context/Display";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const { viewMode } = useDisplayMode();
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

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
    async function init() {
      const cats = await getCategories();
      setCategoryMap(Object.fromEntries(cats.map((c) => [c.id, c.name])));

      const data = await getInventory();
      setItems(data);

      const map: Record<string, string> = {};
      await Promise.all(
        data.map(async (item) => {
          const url = await getImage(item.image);
          map[item.id] = url!;
        })
      );
      setImageMap(map);

      setLoading(false);
    }

    init();
  }, []);

  const router = useRouter();

  const groupOptions = Array.from(
    new Set(items.map((item) => item.category_id).filter(Boolean))
  );

  const filteredItems = items
    .filter((item) =>
      `${item.name} ${item.supplier} ${item.barcode}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedGroup ? item.category_id === selectedGroup : true
    );

  return (
    <div className="flex h-screen sm:w-[100vw]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl">Inventory</h1>
          </div>
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
        <div className="mt-4 max-w-sm">
          <label className="block mb-1 text-sm font-medium">
            Filter by Category
          </label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">All Categories</option>
            {groupOptions.map((groupId) => (
              <option key={groupId} value={groupId}>
                {categoryMap[groupId]}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-10">
          {loading ? (
            <>loading...</>
          ) : viewMode === "table" ? (
            <DataTable
              columns={getColumns(
                handleEdit,
                handleDelete,
                router,
                categoryMap
              )}
              data={filteredItems}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-0 overflow-hidden shadow-md">
                  {imageMap[item.id] && (
                    <div className="relative w-full h-48">
                      <Image
                        src={imageMap[item.id]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <strong>Supplier:</strong> {item.supplier}
                    </p>
                    <p>
                      <strong>Barcode:</strong> {item.barcode}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {categoryMap[item.category_id] || "Uncategorized"}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Toaster />
      </main>
    </div>
  );
}
