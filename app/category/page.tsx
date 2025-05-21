"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { CategoryDataType } from "@/utils/datatypes";
import { createClient } from "@/utils/supabase/client";

export default function Category() {
  const [categories, setCategories] = useState<CategoryDataType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDataType | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const form = useForm<{ category_id: string }>({
    defaultValues: {
      category_id: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("inventory_categories").select("*");
      if (data) setCategories(data);
      if (error) console.error("Fetch error:", error);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl mb-6">Categories</h1>

          <Form {...form}>
            <form>
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
                          {selectedCategory?.name || "Select or create a category"}
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
                              cat.name.toLowerCase().includes(search.toLowerCase())
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
                            (cat) => cat.name.toLowerCase() === search.toLowerCase()
                          ) &&
                            search.trim() && (
                              <li
                                onClick={async () => {
                                  const { data, error } = await supabase
                                    .from("inventory_categories")
                                    .insert({ name: search.trim() })
                                    .select()
                                    .single();

                                  if (data) {
                                    const newCat = { id: data.id, name: data.name };
                                    setCategories((prev) => [...prev, newCat]);
                                    field.onChange(newCat.id);
                                    setSelectedCategory(newCat);
                                    setPopoverOpen(false);
                                    setSearch("");
                                  } else {
                                    console.error("Insert category error:", error);
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
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
