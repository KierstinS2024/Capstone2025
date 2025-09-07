// src/types/shoppingList.d.ts

/**
 * API Model: ShoppingListItem
 */
export interface ShoppingListItem {
  _id?: string; // optional if not yet saved
  ingredientId?: string; // optional link to ingredient record
  name: string; // ingredient or product name
  quantity: number;
  unit?: string; // optional (e.g., "kg", "pcs")
}

/**
 * API Model: ShoppingList
 */
export interface ShoppingList {
  _id: string;
  title: string;
  notes?: string;
  items?: ShoppingListItem[];
  userId: string;
}

/**
 * Form Model: ShoppingListItem (frontend)
 * - Ensures ingredientId is always a string for <select>
 */
export interface ShoppingListFormItem {
  _id?: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit?: string;
}

/**
 * Form Model: ShoppingList (frontend)
 */
export interface ShoppingListForm {
  title: string;
  notes?: string;
  items: ShoppingListFormItem[];
  userId: string;
}
