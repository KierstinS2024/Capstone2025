// src/lib/shoppingListApi.ts
import type { ShoppingList } from "../models/ShoppingList";

export async function fetchShoppingLists(): Promise<ShoppingList[]> {
  const res = await fetch("/api/shopping-lists");
  return res.json();
}
