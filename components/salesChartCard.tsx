"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartData = {
  date: string;
  amount: number;
  value: number;
};

export function InventoryChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Amount" />
            <Line type="monotone" dataKey="value" stroke="#10b981" name="Value" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
