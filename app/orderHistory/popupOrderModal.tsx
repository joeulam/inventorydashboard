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

  const form = useForm<Partial<InventoryItem>>({
    defaultValues: {
      name: "",
      buyingCost: 0,
      amount: 0,
    },
  });

  const supabase = createClient();

  useEffect(() => {
    if (itemToEdit) {
      form.reset({
        name: itemToEdit.name,
        buyingCost: itemToEdit.buyingCost,
        amount: itemToEdit.amount,
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
                    <Input disabled placeholder="Item name" {...field} />
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
            <DialogFooter>
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
