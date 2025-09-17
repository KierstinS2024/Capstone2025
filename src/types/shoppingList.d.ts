// ===========================================
// src/types/shoppingList.d.ts
// ===========================================
export interface ShoppingList {
  _id?: string;
  items: { name: string; checked: boolean }[];
}
