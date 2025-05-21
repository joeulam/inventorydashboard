import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getInventory, addToCart } from "@/utils/suprabaseInventoryFunctions";
import { InventoryItem } from "@/utils/datatypes";

type Props = {
  onAdd?: () => void;
};

export function InventorySearchComboBox({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      const inventory = await getInventory();
      setInventory(inventory);
    };
    fetchInventory();
  }, []);

  const handleSelect = async (item: InventoryItem) => {
    setLoading(true);
    await addToCart(item.id, 1);
    setValue(""); // clear button label
    setSearch(""); // clear command input
    setOpen(false);
    setLoading(false);
    onAdd?.();
  };

  return (
    <div className="w-full sm:max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={loading}
            className="w-full justify-between"
          >
            {loading
              ? "Adding..."
              : value || "Search and add to order..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] sm:w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search item..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {inventory.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    setValue(item.name);
                    handleSelect(item);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
