// ===========================================
// PATH: src/lib/shoppingListApi.ts
// Client-side API helpers for Shopping Lists
// - Calls unified /api/shopping-lists route
// - Normalizes MongoDB `_id` → `id`
// ===========================================

import { apiFetch } from "./api";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";

// -----------------------------
// Normalizers
// -----------------------------

/**
 * Normalize a single shopping list item
 * Converts raw MongoDB object into a clean ShoppingListItem
 */
function normalizeItem(raw: any): ShoppingListItem {
  return {
    id: raw._id?.toString() || raw.id, // always convert ObjectId to string
    name: raw.name,
    checked: raw.checked,
  };
}

/**
 * Normalize a full shopping list
 * Ensures consistent shape for frontend
 */
function normalizeShoppingList(raw: any): ShoppingList {
  return {
    id: raw._id?.toString() || raw.id || "",
    user: raw.user?.toString() || "", // always include user ID
    items: Array.isArray(raw.items) ? raw.items.map(normalizeItem) : [],
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : "",
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : "",
  };
}

// -----------------------------
// API Calls
// -----------------------------

/**
 * Get the current user's shopping list
 */
export async function getShoppingList(): Promise<ShoppingList> {
  const res = await apiFetch<any>("/api/shopping-lists", { method: "GET" });
  return normalizeShoppingList(res);
}

/**
 * Add a single item by name
 */
export async function addItem(name: string): Promise<ShoppingList> {
  const res = await apiFetch<any>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return normalizeShoppingList(res);
}

/**
 * Add all ingredients from a meal plan
 */
export async function addFromMealPlan(
  mealPlanId: string
): Promise<ShoppingList> {
  const res = await apiFetch<any>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ mealPlanId }),
  });
  return normalizeShoppingList(res);
}

/**
 * Toggle an item's checked state
 */
export async function toggleItem(itemId: string): Promise<ShoppingList> {
  const res = await apiFetch<any>(`/api/shopping-lists?id=${itemId}`, {
    method: "PATCH",
  });
  return normalizeShoppingList(res);
}

/**
 * Delete a single item
 */
export async function deleteItem(itemId: string): Promise<ShoppingList> {
  const res = await apiFetch<any>(`/api/shopping-lists?id=${itemId}`, {
    method: "DELETE",
  });
  return normalizeShoppingList(res);
}

/**
 * Clear the entire shopping list
 */
export async function clearList(): Promise<ShoppingList> {
  const res = await apiFetch<any>("/api/shopping-lists", {
    method: "DELETE",
  });
  return normalizeShoppingList(res);
}
