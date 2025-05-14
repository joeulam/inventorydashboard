import { Sidebar } from "@/components/sidebar";
import "../globals.css";
import { DataTable } from "./inventoryTable";
import { columns, Payment } from "./columns";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">Inventory</h1>
          <Button className='cursor-pointer'>Add new item</Button>
        </div>

        <div className="pt-10">
        <DataTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}
