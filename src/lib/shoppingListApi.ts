// PATH: src/lib/shoppingListApi.ts
// -----------------------------
// Simplified version for App Router backend
// -----------------------------

import { ShoppingList } from "@/types/shoppingList";

// Get shopping list for user
export async function getShoppingList(
  userEmail: string
): Promise<ShoppingList | null> {
  const res = await fetch(
    `/api/shopping-lists?user=${encodeURIComponent(userEmail)}`
  );
  if (!res.ok) return null;
  return res.json();
}

// Add new item
export async function addItem(name: string, userEmail: string): Promise<void> {
  const res = await fetch(
    `/api/shopping-lists?user=${encodeURIComponent(userEmail)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }
  );
  if (!res.ok) throw new Error("Failed to add item");
}

// Toggle checked
export async function toggleItem(
  itemId: string,
  userEmail: string
): Promise<void> {
  const res = await fetch(
    `/api/shopping-lists?user=${encodeURIComponent(userEmail)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    }
  );
  if (!res.ok) throw new Error("Failed to toggle item");
}

// Remove item
export async function removeItem(
  itemId: string,
  userEmail: string
): Promise<void> {
  const res = await fetch(
    `/api/shopping-lists?user=${encodeURIComponent(userEmail)}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    }
  );
  if (!res.ok) throw new Error("Failed to remove item");
}

// Clear all items
export async function clearList(userEmail: string): Promise<void> {
  const res = await fetch(
    `/api/shopping-lists?user=${encodeURIComponent(userEmail)}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clearAll: true }),
    }
  );
  if (!res.ok) throw new Error("Failed to clear list");
}
