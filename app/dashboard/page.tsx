"use client";

import { Sidebar } from "@/components/sidebar";
import "../globals.css";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { InventoryItem } from "@/utils/datatypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InventoryChart } from "@/components/salesChartCard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("inventory").select("*");

      if (error) {
        console.error("Error fetching inventory:", error.message);
        return;
      }

      setInventory(data || []);
      setLoading(false);
    };

    fetchInventory();
  }, []);

  const totalQuantity = inventory.reduce((acc, item) => acc + (item.amount || 0), 0);
  const totalValue = inventory.reduce(
    (acc, item) => acc + (item.amount || 0) * item.buyingCost,
    0
  );
  const lowStockCount = inventory.filter((item) => (item.amount || 0) < 5).length;

  const chartData = inventory.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount: item.amount,
    value: item.amount * item.buyingCost,
  }));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-600">Total Items in Stock</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-blue-600">
                  {totalQuantity}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-600">Total Inventory Value</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-green-600">
                  ${totalValue.toFixed(2)}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-600">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-red-500">
                  {lowStockCount}
                </CardContent>
              </Card>
            </div>

            <div className="mb-10">
              <InventoryChart data={chartData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
