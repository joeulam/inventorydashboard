export type InventoryItem = {
  id: string;
  name: string;
  sellingCost: number;
  buyingCost: number
  supplier: string;
  amount: number;
  created_at: string;
  user_id: string;
};

export type OrderDataType = {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  buyingCost: number;
  added_at: string;
}