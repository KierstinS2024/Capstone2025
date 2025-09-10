// src/types/shoppingList.d.ts
// Type definitions for ShoppingList model

import type { Types } from "mongoose";

export type ShoppingCategory = "produce" | "meat" | "dairy" | "frozen" | "other";

export interface ShoppingItem {
  ingredient: string;
  quantity: string;
  category: ShoppingCategory;
  checked: boolean;
}

export interface ShoppingList {
  _id: string;
  userId: string; // reference to User._id
  title: string;
  items: ShoppingItem[];
}

export interface CreateShoppingListPayload {
  title: string;
  items?: ShoppingItem[];
}
