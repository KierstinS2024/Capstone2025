import { apiFetch } from "./api";
import { ShoppingListItem } from "@/types/shoppingList";

export async function fetchShoppingList(): Promise<ShoppingListItem[]> {
  return apiFetch<ShoppingListItem[]>("/api/shopping-lists");
}

export async function addItemApi(
  name: string,
  category: ShoppingListItem["category"]
): Promise<ShoppingListItem> {
  return apiFetch<ShoppingListItem>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ name, category }),
  });
}

export async function removeItemApi(id: string): Promise<void> {
  return apiFetch<void>(`/api/shopping-lists/${id}`, { method: "DELETE" });
}

export async function toggleItemApi(id: string): Promise<ShoppingListItem> {
  return apiFetch<ShoppingListItem>(`/api/shopping-lists/${id}`, {
    method: "PATCH",
  });
}
