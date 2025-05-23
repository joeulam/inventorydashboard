export type InventoryItem = {
  id: string;
  name: string;
  sellingCost: number;
  buyingCost: number
  supplier: string;
  amount: number;
  created_at: string;
  user_id: string;
  barcode: string
  image: string
  category_id: string; 
}

export type CategoryDataType = {
  id: string;
  name: string;
};

export type OrderDataType = {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  amount: number;
  buyingCost: number;
  added_at: string;
  status: string
}

export type HistoricalData = {
  id: string,
  item_id: string,
  buyingCost: string,
  sellingCost: string,
  effective_from: string,
  created_at:string
}

export type UserProfile = {
  id: string
  user_id: string
  store_name: string
}