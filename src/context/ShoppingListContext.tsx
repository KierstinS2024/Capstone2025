// ===========================================
// PATH: src/context/ShoppingListContext.tsx
// Shopping List Context (Single List per User)
// -------------------------------------------
// - Manages a user's shopping list
// - Provides CRUD functions: add, addBulk, toggle, remove, clear
// - Uses optimistic UI updates for instant feedback
// - Automatically fetches list when user logs in
// ===========================================

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext"; // your auth context
import * as shoppingListApi from "@/lib/shoppingListApi";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";

// -----------------------------
// Context Type
// -----------------------------
interface ShoppingListContextType {
  list: ShoppingList | null;
  loading: boolean;
  add: (itemName: string) => Promise<void>;
  addBulk: (itemNames: string[]) => Promise<void>;
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
  const { user, loading: authLoading } = useAuth(); // assume user has { email }
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // -----------------------------
  // Fetch the user's shopping list from API
  // -----------------------------
  const refreshList = async () => {
    if (!user) {
      setList(null);
      return;
    }

    try {
      const fetchedList = await shoppingListApi.getShoppingList();
      setList(fetchedList);
    } catch (err) {
      console.error("Failed to fetch shopping list:", err);
      setList(null);
    }
  };

  // -----------------------------
  // Auto-fetch on auth change
  // -----------------------------
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      refreshList().finally(() => setLoading(false));
    } else {
      setList(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  // -----------------------------
  // Add a single item
  // -----------------------------
  const add = async (itemName: string) => {
    if (!user || !itemName.trim()) return;

    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      checked: false,
    };

    // Optimistic UI: add locally first
    setList((prev) =>
      prev
        ? { ...prev, items: [...prev.items, newItem] }
        : { id: "", ownerEmail: user.email, items: [newItem] }
    );

    try {
      // API returns updated list
      const updatedList = await shoppingListApi.addItem(itemName);
      setList(updatedList);
    } catch (err) {
      console.error("Failed to add item:", err);
      // Rollback
      setList((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((i) => i.id !== newItem.id) }
          : prev
      );
    }
  };

  // -----------------------------
  // Add multiple items
  // -----------------------------
  const addBulk = async (itemNames: string[]) => {
    if (!user || itemNames.length === 0) return;

    const newItems: ShoppingListItem[] = itemNames.map((name) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
      checked: false,
    }));

    // Optimistic UI
    setList((prev) =>
      prev
        ? { ...prev, items: [...prev.items, ...newItems] }
        : { id: "", ownerEmail: user.email, items: [...newItems] }
    );

    try {
      const updatedList = await shoppingListApi.addBulk(itemNames);
      setList(updatedList);
    } catch (err) {
      console.error("Failed to add bulk items:", err);
      // Rollback
      setList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter(
                (i) => !newItems.some((ni) => ni.id === i.id)
              ),
            }
          : prev
      );
    }
  };

  // -----------------------------
  // Toggle item's checked status
  // -----------------------------
  const toggle = async (itemId: string) => {
    if (!user || !list) return;

    // Optimistic UI
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

    try {
      const updatedList = await shoppingListApi.toggleItem(itemId);
      setList(updatedList);
    } catch (err) {
      console.error("Failed to toggle item:", err);
      // Rollback
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
    }
  };

  // -----------------------------
  // Remove an item
  // -----------------------------
  const remove = async (itemId: string) => {
    if (!user || !list) return;

    const previousItems = list.items;

    // Optimistic UI
    setList((prev) =>
      prev
        ? { ...prev, items: prev.items.filter((item) => item.id !== itemId) }
        : prev
    );

    try {
      const updatedList = await shoppingListApi.removeItem(itemId);
      setList(updatedList);
    } catch (err) {
      console.error("Failed to remove item:", err);
      // Rollback
      setList((prev) => (prev ? { ...prev, items: previousItems } : prev));
    }
  };

  // -----------------------------
  // Clear all items
  // -----------------------------
  const clear = async () => {
    if (!user || !list || list.items.length === 0) return;

    const previousItems = list.items;

    // Optimistic UI
    setList((prev) => (prev ? { ...prev, items: [] } : prev));

    try {
      const updatedList = await shoppingListApi.clearList();
      setList(updatedList);
    } catch (err) {
      console.error("Failed to clear list:", err);
      // Rollback
      setList((prev) => (prev ? { ...prev, items: previousItems } : prev));
    }
  };

  // -----------------------------
  // Provide context
  // -----------------------------
  return (
    <ShoppingListContext.Provider
      value={{
        list,
        loading,
        add,
        addBulk,
        toggle,
        remove,
        clear,
        refreshList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

// -----------------------------
// Hook to use ShoppingListContext
// -----------------------------
export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  return context;
};
