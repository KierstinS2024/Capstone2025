// ===========================================
// PATH: src/context/ShoppingListContext.tsx
// ===========================================
// Shopping List Context
// -----------------------------
// - Manages the shopping list state for the current user
// - Provides functions to add, toggle, remove, clear items
// - Automatically fetches user's list on login
// ===========================================

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import * as shoppingListApi from "@/lib/shoppingListApi";
import { ShoppingList } from "@/types/shoppingList";

// -----------------------------
// Context Type
// -----------------------------
interface ShoppingListContextType {
  list: ShoppingList | null;
  loading: boolean;
  add: (name: string) => Promise<void>;
  toggle: (itemId: string) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refreshList: () => Promise<void>;
}

// -----------------------------
// Create Context
// -----------------------------
const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

// -----------------------------
// Provider Component
// -----------------------------
export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // -----------------------------
  // Fetch shopping list from API
  // -----------------------------
  const refreshList = async () => {
    if (!user?.email) {
      setList(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const fetchedList = await shoppingListApi.getShoppingList(user.email);
      setList(fetchedList);
    } catch (err) {
      console.error("Failed to fetch shopping list:", err);
      setList(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Automatically fetch list when user logs in
  // -----------------------------
  useEffect(() => {
    if (!authLoading && user?.email) {
      refreshList();
    } else {
      setList(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  // -----------------------------
  // Add new item
  // -----------------------------
  const add = async (name: string) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await shoppingListApi.addItem(name, user.email);
      await refreshList(); // Refresh after adding
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Toggle item checked/unchecked
  // -----------------------------
  const toggle = async (itemId: string) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await shoppingListApi.toggleItem(itemId, user.email);
      // Optimistic UI update
      setList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : prev
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Remove an item
  // -----------------------------
  const remove = async (itemId: string) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await shoppingListApi.removeItem(itemId, user.email);
      setList((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((item) => item.id !== itemId) }
          : prev
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Clear entire list
  // -----------------------------
  const clear = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await shoppingListApi.clearList(user.email);
      setList((prev) => (prev ? { ...prev, items: [] } : prev));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Provide context
  // -----------------------------
  return (
    <ShoppingListContext.Provider
      value={{ list, loading, add, toggle, remove, clear, refreshList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

// -----------------------------
// Hook to use ShoppingListContext
// -----------------------------
export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  return context;
};
