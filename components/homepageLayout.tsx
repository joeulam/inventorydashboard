"use client";

import SalesChartCard from "./salesChartCard";
import MonthlyCard from "./monthlyCard";

export default function HomePageLayout() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
          <SalesChartCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyCard title="Revenue" dataNumber={24893.45} />
        <MonthlyCard title="New Customers" dataNumber={302} />
      </div>
    </div>
  );
}
