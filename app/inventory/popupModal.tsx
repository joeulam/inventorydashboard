"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { InventoryItem } from "@/utils/datatypes";
import { updateItem } from "@/utils/suprabaseInventoryFunctions";
import BarcodeScanner from "react-qr-barcode-scanner";
import barcodeAPI from "@/utils/barcode";

type AddNewInventoryCardProps = {
  onAdd?: () => void;
  itemToEdit?: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddNewInventoryCard({
  onAdd,
  itemToEdit,
}: AddNewInventoryCardProps) {
  const [open, setOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [data, setData] = useState("Not Found");

  const form = useForm<Partial<InventoryItem>>({
    defaultValues: {
      name: "",
      buyingCost: 0,
      sellingCost: 0,
      supplier: "",
      amount: 0,
      barcode: "",
    },
  });

  const supabase = createClient();

  useEffect(() => {
    if (itemToEdit) {
      form.reset({
        name: itemToEdit.name,
        buyingCost: itemToEdit.buyingCost,
        sellingCost: itemToEdit.sellingCost,
        supplier: itemToEdit.supplier,
        amount: itemToEdit.amount,
        barcode: itemToEdit.barcode
      });
      setOpen(true);
    } else {
      form.reset();
    }
  }, [itemToEdit, form]);

  const onSubmit = async (values: Partial<InventoryItem>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    let error;

    if (itemToEdit?.id) {
      error = await updateItem(itemToEdit.id, values);
    } else {
      const response = await supabase.from("inventory").insert([
        {
          ...values,
          user_id: user.id,
        },
      ]);
      error = response.error;
    }

    if (error) {
      console.error("Save error:", error.message);
      return;
    }

    form.reset();
    setOpen(false);
    onAdd?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          Add new item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{itemToEdit ? "Edit Item" : "New Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellingCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyingCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buying Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input type="string" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col space-y-2 items-start">
              {!showScanner ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowScanner(true)}
                >
                  Add via barcode
                </Button>
              ) : (
                <div className="w-full space-y-2">
                  <BarcodeScanner
                    width={300}
                    height={300}
                    
                    onUpdate={async (err, result) => {
                      if (result) {
                        const scannedCode = result.getText();
                        setData(scannedCode);
                        form.setValue("barcode", scannedCode);
                        setShowScanner(false);
                    
                        try {
                          const response = await barcodeAPI(scannedCode);                    
                          const item = response.items?.[0];
                          if (item) {
                            form.setValue("name", item.title || "");
                            form.setValue("supplier", item.brand || "");
                          }
                        } catch (error) {
                          console.error("Barcode lookup failed", error);
                        }
                      } else {
                        setData("Not Found");
                      }
                    }}
                    
                  />
                  <p className="font-bold text-sm">Scanned: {data}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScanner(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <Button type="submit">
                {itemToEdit ? "Update Item" : "Add to Inventory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
