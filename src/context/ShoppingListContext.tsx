// PATH: src/context/ShoppingListContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ShoppingList,
  ShoppingItem,
  getShoppingList,
  addItem,
  toggleItem,
  deleteItem,
  clearList,
} from "../lib/shoppingListApi";

interface ShoppingListContextType {
  list: ShoppingList | null;
  loading: boolean;
  fetchList: () => Promise<void>;
  add: (name: string) => Promise<void>;
  addBulk: (names: string[]) => Promise<void>; // <-- NEW
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
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const l = await getShoppingList();
      setList(l);
    } finally {
      setLoading(false);
    }
  }

  // Add single item
  async function addItemToList(name: string) {
    const updated = await addItem(name);
    setList(updated);
  }

  // Add multiple items at once
  async function addBulkItemsToList(names: string[]) {
    // Sequentially add each item (or implement bulk API if available)
    for (const name of names) {
      await addItem(name);
    }
    // Refresh the list after all items are added
    await fetchList();
  }

  async function toggleItemInList(id: string) {
    const updated = await toggleItem(id);
    setList(updated);
  }

  async function removeItemFromList(id: string) {
    const updated = await deleteItem(id);
    setList(updated);
  }

  async function clearShoppingList() {
    const updated = await clearList();
    setList(updated);
  }

  return (
    <ShoppingListContext.Provider
      value={{
        list,
        loading,
        fetchList,
        add: addItemToList,
        addBulk: addBulkItemsToList, // <-- expose addBulk
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
