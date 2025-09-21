// ===========================================
// PATH: src/types/shoppingList.d.ts
// Client-side TypeScript interfaces for Shopping Lists
// Normalized to plain `id` instead of Mongo `_id`
// ===========================================

/**
 * Represents a single shopping list item
 */
export interface ShoppingListItem {
  id: string; // normalized from MongoDB _id
  name: string; // item name (e.g., "lemons")
  checked: boolean; // whether the item is marked complete
}

/**
 * Represents an entire shopping list
 */
export interface ShoppingList {
  id: string; // normalized from MongoDB _id
  user: string; // owner user ID (always present after normalization)
  items: ShoppingListItem[]; // list of items
  createdAt: string; // ISO string from timestamps
  updatedAt: string; // ISO string from timestamps
}
