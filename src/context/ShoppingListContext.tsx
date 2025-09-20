// ===========================================
// PATH: src/context/ShoppingListContext.tsx
// React Context Provider for Shopping Lists
// Uses API helpers from lib/shoppingListApi.ts
// ===========================================

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ShoppingList,
  getShoppingList,
  addItem,
  toggleItem,
  deleteItem,
  clearList,
} from "@/lib/shoppingListApi";

// -----------------------------
// Context Type Definition
// -----------------------------
interface ShoppingListContextType {
  list: ShoppingList | null;
  loading: boolean;
  error: string | null;

  fetchList: () => Promise<void>;
  add: (name: string) => Promise<void>;
  addBulk: (names: string[]) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

// -----------------------------
// Create React Context
// -----------------------------
const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

// -----------------------------
// Provider Component
// -----------------------------
export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list when the provider mounts
  useEffect(() => {
    fetchList();
  }, []);

  // -----------------------------
  // Fetch shopping list from backend
  // -----------------------------
  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const l = await getShoppingList();
      setList(l ?? null); // already normalized by API
    } catch (err: any) {
      setError(err.message || "Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Add a single item
  // -----------------------------
  async function addItemToList(name: string) {
    setError(null);
    try {
      const updated = await addItem(name);
      setList(updated);
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    }
  }

  // -----------------------------
  // Add multiple items in bulk
  // -----------------------------
  async function addBulkItemsToList(names: string[]) {
    setError(null);
    try {
      for (const name of names) {
        await addItem(name);
      }
      await fetchList(); // refresh after bulk add
    } catch (err: any) {
      setError(err.message || "Failed to add items");
    }
  }

  // -----------------------------
  // Toggle an item's checked state
  // -----------------------------
  async function toggleItemInList(id: string) {
    setError(null);
    try {
      const updated = await toggleItem(id);
      setList(updated);
    } catch (err: any) {
      setError(err.message || "Failed to toggle item");
    }
  }

  // -----------------------------
  // Remove a single item
  // -----------------------------
  async function removeItemFromList(id: string) {
    setError(null);
    try {
      const updated = await deleteItem(id);
      setList(updated);
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
    }
  }

  // -----------------------------
  // Clear the entire shopping list
  // -----------------------------
  async function clearShoppingList() {
    setError(null);
    try {
      const updated = await clearList();
      setList(updated);
    } catch (err: any) {
      setError(err.message || "Failed to clear list");
    }
  }

  return (
    <ShoppingListContext.Provider
      value={{
        list,
        loading,
        error,
        fetchList,
        add: addItemToList,
        addBulk: addBulkItemsToList,
        toggle: toggleItemInList,
        remove: removeItemFromList,
        clear: clearShoppingList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

// -----------------------------
// Hook for consuming context
// -----------------------------
export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  }
  return ctx;
}
