"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "./getDataLogic";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function getColumns(
  onDelete: (id: string) => void
): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
    },
    {
      accessorKey: "cost",
      header: "Cost",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Edit", item.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item.id)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Add to order", item.id)}>
                Add to Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
