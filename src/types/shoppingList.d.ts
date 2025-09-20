// ===========================================
// PATH: src/types/shoppingList.d.ts
// ===========================================

/**
 * Represents a single shopping list item
 */
export interface ShoppingListItem {
  id: string; // normalized from MongoDB _id
  name: string;
  checked: boolean;
}

/**
 * Represents an entire shopping list
 */
export interface ShoppingList {
  id: string; // normalized from MongoDB _id
  items: ShoppingListItem[];
  user?: string; // optional owner ID
  createdAt?: string; // optional timestamps
  updatedAt?: string;
}
