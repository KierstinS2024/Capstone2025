// ShoppingListContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ your existing auth
import {
  ShoppingList,
  getShoppingList,
  addItem,
  addFromMealPlan,
  toggleItem,
  deleteItem,
  clearList,
} from "@/lib/shoppingListApi";

interface ShoppingListContextType {
  list: ShoppingList | null;
  loading: boolean;
  error: string | null;
  fetchList: () => Promise<void>;
  add: (name: string) => Promise<void>;
  addBulk: (names: string[]) => Promise<void>;
  addFromMealPlan: (mealPlanId: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth(); // 👈 use your existing auth context
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔑 Watch user changes
  useEffect(() => {
    if (user) {
      fetchList(); // logged in → fetch their list
    } else {
      setList(null); // logged out → reset
      setLoading(false);
      setError(null);
    }
  }, [user]); // 👈 refetch whenever auth user changes

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const l = await getShoppingList();
      setList(l ?? null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load shopping list"
      );
    } finally {
      setLoading(false);
    }
  }

  async function addItemToList(name: string) {
    try {
      const updated = await addItem(name);
      setList(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    }
  }

  async function addBulkItemsToList(names: string[]) {
    try {
      for (const name of names) {
        await addItem(name);
      }
      await fetchList();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add items");
    }
  }

  async function addItemsFromMealPlan(mealPlanId: string) {
    try {
      const updated = await addFromMealPlan(mealPlanId);
      setList(updated);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to add from meal plan"
      );
    }
  }

  async function toggleItemInList(id: string) {
    try {
      const updated = await toggleItem(id);
      setList(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle item");
    }
  }

  async function removeItemFromList(id: string) {
    try {
      const updated = await deleteItem(id);
      setList(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    }
  }

  async function clearShoppingList() {
    try {
      const updated = await clearList();
      setList(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to clear list");
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
        addFromMealPlan: addItemsFromMealPlan,
        toggle: toggleItemInList,
        remove: removeItemFromList,
        clear: clearShoppingList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  }
  return ctx;
}
