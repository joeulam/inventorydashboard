"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MonthlyCard({
  title,
  dataNumber,
}: {
  title: string;
  dataNumber: number;
}) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl border border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm  font-medium">
          {title} 
          <span className="text-muted-foreground"> (Last 30 Days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-foreground tracking-tight">
          ${dataNumber.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  );
}
