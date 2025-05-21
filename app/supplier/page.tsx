"use client";

import { Sidebar } from "@/components/sidebar";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { getSuppliers } from "@/utils/suprabaseInventoryFunctions";
import { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

export default function Supplier() {
  const [supplierName, setSupplierName] = useState<string[]>([]);
  const router = useRouter()
  useEffect(() => {
    const handleSuppliers = async () => {
      const suppliers = await getSuppliers();
      setSupplierName(suppliers);
    };
    handleSuppliers();
  }, []);

  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-hidden p-6 bg-gray-50">
      <h1 className="text-3xl">Supplier</h1>
        <div className="flex justify-between items-center w-full">
          <Table>
            <TableCaption>A list of your suppliers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierName.map((item, index) => (
                <TableRow onClick={() => router.push(`/supplier/${encodeURIComponent(item)}`)} key={index} className="hover:bg-gray-100">
                  <TableCell className="font-medium">
                    
                      {item}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
