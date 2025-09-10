// src/lib/shoppingListApi.ts
// Shopping List API helpers (type-safe)

import type { ShoppingList } from "@/types/shoppingList";
import { apiFetch } from "./api";

/** Fetch all shopping lists for current user */
export const fetchShoppingListsAPI = async (): Promise<ShoppingList[]> => {
  return apiFetch<ShoppingList[]>("/shopping-lists");
};

/** Create a new shopping list */
export const createShoppingListAPI = async (list: Partial<ShoppingList>): Promise<ShoppingList> => {
  return apiFetch<ShoppingList>("/shopping-lists", {
    method: "POST",
    body: JSON.stringify(list),
  });
};

/** Update shopping list by ID */
export const updateShoppingListAPI = async (id: string, updates: Partial<ShoppingList>): Promise<ShoppingList> => {
  return apiFetch<ShoppingList>(`/shopping-lists/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

/** Delete shopping list by ID */
export const deleteShoppingListAPI = async (id: string): Promise<void> => {
  return apiFetch<void>(`/shopping-lists/${id}`, { method: "DELETE" });
};

/** Generate shopping list from a meal plan */
export const generateShoppingListFromMealPlanAPI = async (mealPlanId: string): Promise<ShoppingList> => {
  return apiFetch<ShoppingList>("/shopping-lists/from-meal-plan", {
    method: "POST",
    body: JSON.stringify({ mealPlanId }),
  });
};
