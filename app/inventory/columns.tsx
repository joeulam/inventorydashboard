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
import { addToCart } from "@/utils/suprabaseInventoryFunctions";
import { useRouter } from "next/navigation";
import { ImageCell } from "@/components/imageCell";
import { toast } from "sonner";

export function getColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  router: ReturnType<typeof useRouter>
): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <ImageCell imageKey={row.original.image} alt={row.original.name} />
      ),
    },

    {
      accessorKey: "supplier",
      header: "Supplier",
    },
    {
      accessorKey: "sellingCost",
      header: "Selling Cost",
      cell: ({ row }) => {
        const value = row.original.sellingCost;
        return typeof value === "number" ? `$${value.toFixed(2)}` : value;
      },
    },
    {
      accessorKey: "buyingCost",
      header: "Buying Cost",
      cell: ({ row }) => {
        const value = row.original.buyingCost;
        return typeof value === "number" ? `$${value.toFixed(2)}` : value;
      },
    },

    {
      accessorKey: "amount",
      header: "Quantity",
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
                onClick={() => router.push(`../inventory/${item.id}`)}
              >
                More Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                addToCart(item.id, 1)
                toast("Added to cart", {
                })
                }}>
                Add to Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item.id)}>
                Edit
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
