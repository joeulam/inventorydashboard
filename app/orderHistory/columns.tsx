"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { InventoryItem } from "@/utils/datatypes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  router: (AppRouterInstance)
): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "created_at",
      header: "Date",
    },
    {
      accessorKey: "total",
      header: "Cost",
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
              <DropdownMenuItem
                onClick={() => router.push(`/orderHistory/${item.id}`)}
              >
                View order
              </DropdownMenuItem>
              <DropdownMenuItem className={`text-red-400`} onClick={() => onDelete(item.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
