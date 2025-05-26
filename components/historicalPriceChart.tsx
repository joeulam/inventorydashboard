"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getHistoricalPrice } from "@/utils/suprabaseInventoryFunctions";
import { HistoricalData } from "@/utils/datatypes";
type ChartPoint = {
  date: string;
  price: number;
};
type Props = {
  id: string;
  refreshTrigger?: number;
};

export default function HistoricalPrice({ id, refreshTrigger }: Props) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = (await getHistoricalPrice(id)) as HistoricalData[]
      
      const transformed = data.map((item) => {
        console.log("Raw buyingCost:", item);
        return {
          date: item.created_at,
          price: parseFloat(item.buyingCost),
        };
      });
      
      setData(transformed);
      setLoading(false);
    }

    fetchData();
  }, [id, refreshTrigger]);

  if (loading) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-6 ">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}