"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import "../../globals.css";
import { InventoryItem } from "@/utils/datatypes";
import {
  deleteItem,
  getImage,
  getItemById,
  updateItem,
} from "@/utils/suprabaseInventoryFunctions";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import HistoricalPrice from "@/components/historicalPriceChart";

export default function Inventory() {
  const [item, setItem] = useState<InventoryItem>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [chartRefreshKey, setChartRefreshKey] = useState(0); // NEW
  const slug = useParams();
  const router = useRouter();

  const fetchItem = async () => {
    setLoading(true);
    if (slug.slug) {
      const data = await getItemById(slug.slug.toString(), "inventory");
      setItem(data);

      if (data?.image) {
        const imageData = await getImage(data.image);
        setImage(imageData as string);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id, "inventory");
    router.back();
  };

  const handleSave = async () => {
    if (!item || !item.id) return;
    const error = await updateItem(item.id, item);
    if (!error) {
      setIsEditing(false);
      setChartRefreshKey((prev) => prev + 1); // TRIGGER chart update
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    setItem((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 py-10 px-6">
        <div className="max-w-3xl mx-auto">
        <HistoricalPrice id={slug.slug!.toString()} refreshTrigger={chartRefreshKey} />

          <Card className="rounded-2xl shadow-xl p-6 space-y-6 mt-5">
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading item...
              </p>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {image ? (
                    <Image
                      src={image}
                      alt={item?.name || ""}
                      width={300}
                      height={300}
                      className="rounded-xl object-cover aspect-square border border-muted"
                    />
                  ) : (
                    <div className="w-[300px] h-[300px] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Item Name
                      </span>
                      {isEditing ? (
                        <Input
                          value={item?.name || ""}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      ) : (
                        <p className="text-lg font-medium">{item?.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">
                          Quantity
                        </span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item?.amount || 0}
                            onChange={(e) =>
                              handleChange("amount", parseInt(e.target.value))
                            }
                          />
                        ) : (
                          <p className="font-medium">{item?.amount}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Supplier
                        </span>
                        {isEditing ? (
                          <Input
                            value={item?.supplier || ""}
                            onChange={(e) =>
                              handleChange("supplier", e.target.value)
                            }
                          />
                        ) : (
                          <p className="font-medium">{item?.supplier}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Buying Price
                        </span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item?.buyingCost || 0}
                            onChange={(e) =>
                              handleChange(
                                "buyingCost",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        ) : (
                          <p className="font-medium">${item?.buyingCost}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Selling Price
                        </span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item?.sellingCost || 0}
                            onChange={(e) =>
                              handleChange(
                                "sellingCost",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        ) : (
                          <p className="font-medium">${item?.sellingCost}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block">
                          Barcode
                        </span>
                        {isEditing ? (
                          <Input
                            value={item?.barcode || ""}
                            onChange={(e) =>
                              handleChange("barcode", e.target.value)
                            }
                          />
                        ) : (
                          <p className="font-medium">{item?.barcode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  {isEditing ? (
                    <Button onClick={handleSave}>Save</Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => item?.id && handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Card>

          </div>
      </main>
    </div>
  );
}
