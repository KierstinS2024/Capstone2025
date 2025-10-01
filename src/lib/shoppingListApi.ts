// ===========================================
// PATH: src/lib/shoppingListApi.ts
// Shopping List API Client (RESTful)
// -------------------------------------------
// - Matches your Next.js API routes
// - One shopping list per user
// - Each mutation returns the updated list
// - Handles errors consistently
// ===========================================

import { ShoppingList } from "@/types/shoppingList";

// -----------------------------
// Helper: unified fetch wrapper
// -----------------------------
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  // Handle non-OK responses
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      if (data.error) message = data.error;
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

// -----------------------------
// Get the user's shopping list
// -----------------------------
export function getShoppingList(): Promise<ShoppingList> {
  return request<ShoppingList>("/api/shopping-lists");
}

// -----------------------------
// Add a single item
// -----------------------------
export function addItem(name: string): Promise<ShoppingList> {
  return request<ShoppingList>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// -----------------------------
// Add multiple items at once
// -----------------------------
export function addBulk(items: string[]): Promise<ShoppingList> {
  return request<ShoppingList>("/api/shopping-lists", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

// -----------------------------
// Toggle a single item
// -----------------------------
export function toggleItem(itemId: string): Promise<ShoppingList> {
  return request<ShoppingList>(`/api/shopping-lists/${itemId}`, {
    method: "PATCH",
  });
}

// -----------------------------
// Remove a single item
// -----------------------------
export function removeItem(itemId: string): Promise<ShoppingList> {
  return request<ShoppingList>(`/api/shopping-lists/${itemId}`, {
    method: "DELETE",
  });
}

// -----------------------------
// Clear the entire list
// -----------------------------
export function clearList(): Promise<ShoppingList> {
  return request<ShoppingList>("/api/shopping-lists", {
    method: "DELETE",
  });
}
