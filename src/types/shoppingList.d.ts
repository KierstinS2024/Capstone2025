// path: src/types/shoppingList.d.ts
// Type definitions for Shopping List

/**
 * A single item in the shopping list.
 */
export interface ShoppingItem {
  id: string; // Unique identifier for item
  name: string; // Item name
  quantity?: string; // Optional quantity string
  purchased: boolean; // Checked off status
  mealTypes?: string[]; // Optional: Breakfast/Lunch/Dinner
}

/**
 * Shopping list for a given user and day.
 */
export interface ShoppingList {
  date: string; // ISO date string
  items: ShoppingItem[]; // List of items
}
