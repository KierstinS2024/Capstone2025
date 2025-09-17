// PATH: src/lib/shoppingListApi.ts
// Client-side API helpers for the Shopping List.

import { apiFetch } from "./api";

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
}

export async function getShoppingList(): Promise<ShoppingList> {
  return apiFetch<ShoppingList>("/api/shopping-lists");
}

export async function addItem(name: string): Promise<ShoppingList> {
  return apiFetch<ShoppingList>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function toggleItem(id: string): Promise<ShoppingList> {
  return apiFetch<ShoppingList>(`/api/shopping-lists/${id}`, {
    method: "PUT",
  });
}

export async function deleteItem(id: string): Promise<ShoppingList> {
  return apiFetch<ShoppingList>(`/api/shopping-lists/${id}`, {
    method: "DELETE",
  });
}

export async function clearList(): Promise<ShoppingList> {
  return apiFetch<ShoppingList>("/api/shopping-lists", {
    method: "DELETE",
  });
}
