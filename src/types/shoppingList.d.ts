// ===========================================
// PATH: src/types/shoppingList.ts
// ===========================================

// Single shopping list item
export interface ShoppingListItem {
  id: string; // unique item ID
  name: string; // item name
  checked: boolean; // true if item is marked done
}

// User shopping list
export interface ShoppingList {
  id: string; // unique list ID
  ownerEmail: string; // user's email
  items: ShoppingListItem[]; // items in list
}
