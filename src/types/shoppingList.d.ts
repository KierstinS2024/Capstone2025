// src/types/shoppingList.d.ts
export type IngredientCategory =
  | "produce"
  | "meat"
  | "dairy"
  | "frozen"
  | "other";

export interface ShoppingItem {
  ingredient: string;
  quantity: string;
  category: IngredientCategory;
  checked: boolean;
}

export interface ShoppingList {
  _id: string;
  userId: string;
  title: string;
  items: ShoppingItem[];
}
