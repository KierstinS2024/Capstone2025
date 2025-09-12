// Single item in a shopping list
export interface ShoppingItem {
  name: string;
  quantity: string; // string for simplicity; can be numeric + unit
  category?: string; // optional, e.g., produce, dairy
  mealTypes: string[]; // Breakfast, Lunch, Dinner
}

// Full shopping list for a given day
export interface ShoppingList {
  date: string; // ISO date string
  items: ShoppingItem[];
}
