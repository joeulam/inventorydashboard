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
  const router = useRouter();

  useEffect(() => {
    const handleSuppliers = async () => {
      const suppliers = await getSuppliers();
      setSupplierName(suppliers);
    };
    handleSuppliers();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Suppliers</h1>

          <Table>
            <TableCaption className="text-gray-500">
              A list of all suppliers you&apos;ve added
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-gray-600">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierName.length === 0 ? (
                <TableRow>
                  <TableCell className="text-gray-500 italic">No suppliers found.</TableCell>
                </TableRow>
              ) : (
                supplierName.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() =>
                      router.push(`/supplier/${encodeURIComponent(item)}`)
                    }
                    className="hover:bg-gray-100 transition cursor-pointer"
                  >
                    <TableCell className="font-medium text-gray-800">
                      {item}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
