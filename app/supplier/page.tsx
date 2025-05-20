"use client";

import { Sidebar } from "@/components/sidebar";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table
} from "@/components/ui/table";
import { getSuppliers } from "@/utils/suprabaseInventoryFunctions";
import { useEffect, useState } from "react";
import "../globals.css"
export default function Supplier() {
  const [supplierName, setSupplierName] = useState<string[]>([])
  useEffect(() => {
    const handleSuppliers = async () => {
      const suppliers = await getSuppliers();
      setSupplierName(suppliers)
    };
    handleSuppliers();
  }, []);
  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-hidden p-6 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <Table>
            <TableCaption>A list of your suppliers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierName.map((item,index) => {
                return(
                <TableRow key={index}>
                <TableCell className="font-medium">{item}</TableCell>
              </TableRow>
                )
              })}
              
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
