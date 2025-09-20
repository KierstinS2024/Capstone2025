// ===========================================
// PATH: src/lib/shoppingListApi.ts
// Client-side API helpers for Shopping Lists
// Normalizes MongoDB `_id` → `id`
// ===========================================

import { apiFetch } from "./api";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";

// -----------------------------
// Normalizers
// -----------------------------

/**
 * Normalize a single shopping list item
 */
function normalizeItem(item: any): ShoppingListItem {
  return {
    id: item._id || item.id, // normalize Mongo _id
    name: item.name,
    checked: item.checked,
  };
}

/**
 * Normalize a full shopping list
 */
function normalizeShoppingList(list: any): ShoppingList {
  return {
    id: list._id || list.id,
    items: (list.items || []).map(normalizeItem),
    user: list.user,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}

// -----------------------------
// API Calls
// -----------------------------

/**
 * Get the current shopping list
 */
export async function getShoppingList(): Promise<ShoppingList> {
  const list = await apiFetch<any>("/api/shopping-lists");
  return normalizeShoppingList(list);
}

/**
 * Add a single item to the shopping list
 */
export async function addItem(name: string): Promise<ShoppingList> {
  const list = await apiFetch<any>("/api/shopping-lists/add", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return normalizeShoppingList(list);
}

/**
 * Toggle an item checked/unchecked
 */
export async function toggleItem(id: string): Promise<ShoppingList> {
  const list = await apiFetch<any>(`/api/shopping-lists/toggle/${id}`, {
    method: "PUT",
  });
  return normalizeShoppingList(list);
}

/**
 * Delete a single item
 */
export async function deleteItem(id: string): Promise<ShoppingList> {
  const list = await apiFetch<any>(`/api/shopping-lists/remove/${id}`, {
    method: "DELETE",
  });
  return normalizeShoppingList(list);
}

/**
 * Clear the entire shopping list
 */
export async function clearList(): Promise<ShoppingList> {
  const list = await apiFetch<any>("/api/shopping-lists/clear", {
    method: "DELETE",
  });
  return normalizeShoppingList(list);
}
