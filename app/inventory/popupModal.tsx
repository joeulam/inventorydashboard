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
import { CategoryDataType, InventoryItem } from "@/utils/datatypes";
import { updateItem, uploadImage } from "@/utils/suprabaseInventoryFunctions";
import BarcodeScanner from "react-qr-barcode-scanner";
import barcodeAPI from "@/utils/barcode";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

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
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryDataType[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDataType | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const form = useForm<Partial<InventoryItem>>({
    defaultValues: {
      name: "",
      buyingCost: undefined,
      sellingCost: undefined,
      supplier: "",
      amount: undefined,
      barcode: "",
      image: "",
      category_id: undefined,
    },
  });

  const supabase = createClient();
  useEffect(() => {
    const fetchAndInitialize = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Fetch categories
      const { data: fetchedCategories, error: fetchError } = await supabase
        .from("inventory_categories")
        .select("*");

      if (fetchError) {
        console.error("Fetch categories error:", fetchError.message);
        return;
      }

      setCategories(fetchedCategories);

      // If editing, reset form with existing values and set selected category
      if (itemToEdit) {
        form.reset({
          name: itemToEdit.name,
          buyingCost: itemToEdit.buyingCost,
          sellingCost: itemToEdit.sellingCost,
          supplier: itemToEdit.supplier,
          amount: itemToEdit.amount,
          barcode: itemToEdit.barcode,
          category_id: itemToEdit.category_id,
        });

        const matchedCategory = fetchedCategories.find(
          (cat) => cat.id === itemToEdit.category_id
        );
        if (matchedCategory) setSelectedCategory(matchedCategory);

        setOpen(true);
      } else {
        form.reset();
      }
    };

    fetchAndInitialize();
  }, [itemToEdit, form]);

  const onSubmit = async (values: Partial<InventoryItem>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    let uploadedImagePath = null;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const imagePath = `items/${user.id}/${Date.now()}.${fileExt}`;

      uploadedImagePath = await uploadImage(file, imagePath);
      if (!uploadedImagePath) {
        console.error("Failed to upload image");
        return;
      }
    }

    let error;

    const itemPayload = {
      ...values,
      user_id: user.id,
      ...(uploadedImagePath && { image: uploadedImagePath }),
    };

    if (itemToEdit?.id) {
      error = await updateItem(itemToEdit.id, itemPayload);
    } else {
      const { error: insertError } = await supabase
        .from("inventory")
        .insert([itemPayload]);
      error = insertError;
    }

    if (error) {
      console.error("Save error:", error.message);
      return;
    }

    form.reset();
    setFile(null);
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
      <DialogContent className="sm:max-w-[425px] h-[80vh] overflow-scroll">
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
                    <Input type="number" placeholder="0.00" {...field} />
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedCategory?.name ||
                          "Select or create a category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[50] w-[300px] bg-white p-2 border border-gray-200 rounded shadow">
                      <Input
                        placeholder="Search or type new category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                      />
                      <ul className="max-h-40 overflow-y-auto space-y-1">
                        {categories
                          .filter((cat) =>
                            cat.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                          .map((cat) => (
                            <li
                              key={cat.id}
                              onClick={() => {
                                field.onChange(cat.id);
                                setSelectedCategory(cat);
                                setPopoverOpen(false);
                                setSearch("");
                              }}
                              className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
                            >
                              {cat.name}
                            </li>
                          ))}
                        {!categories.some(
                          (cat) =>
                            cat.name.toLowerCase() === search.toLowerCase()
                        ) &&
                          search.trim() && (
                            <li
                              onClick={async () => {
                                const {
                                  data: { user },
                                } = await supabase.auth.getUser();

                                if (!user) {
                                  console.error("User not authenticated");
                                  return;
                                }
                                console.log(search.trim(), user.id);

                                const { data, error } = await supabase
                                  .from("inventory_categories")
                                  .insert({
                                    name: search.trim(),
                                    user_id: user.id,
                                  })
                                  .select()
                                  .single();

                                if (data) {
                                  const newCat = {
                                    id: data.id,
                                    name: data.name,
                                  };
                                  setCategories((prev) => [...prev, newCat]);
                                  field.onChange(newCat.id);

                                  setSelectedCategory(newCat);
                                  setPopoverOpen(false);
                                  setSearch("");
                                } else {
                                  console.error(
                                    "Insert category error:",
                                    error
                                  );
                                }
                              }}
                              className="cursor-pointer px-2 py-1 text-blue-500 hover:bg-blue-50 rounded"
                            >
                              + Create &quot;{search}&quot;
                            </li>
                          )}
                      </ul>
                    </PopoverContent>
                  </Popover>
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
            <div>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

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
                  className="cursor-pointer"
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScanner(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <Button className="cursor-pointer" type="submit">
                {itemToEdit ? "Update Item" : "Add to Inventory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
