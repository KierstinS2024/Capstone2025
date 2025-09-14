"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { ShoppingListItem } from "@/types/shoppingList";
import {
  fetchShoppingList,
  addItemApi,
  removeItemApi,
  toggleItemApi,
} from "@/lib/shoppingListApi";
import { useAuth } from "./AuthContext";

interface ShoppingListContextValue {
  shoppingList: ShoppingListItem[];
  loading: boolean;
  addItem: (
    name: string,
    category: ShoppingListItem["category"]
  ) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  refreshList: () => Promise<void>;
  addMultipleItems: (names: string[]) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined
);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshList = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await fetchShoppingList();
      setShoppingList(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const addItem = useCallback(
    async (name: string, category: ShoppingListItem["category"]) => {
      const newItem = await addItemApi(name, category);
      setShoppingList((prev) => [...prev, newItem]);
    },
    []
  );

  const removeItem = useCallback(async (id: string) => {
    await removeItemApi(id);
    setShoppingList((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    const updated = await toggleItemApi(id);
    setShoppingList((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }, []);

  const addMultipleItems = useCallback(
    async (names: string[]) => {
      for (const name of names) {
        if (!name) continue;
        await addItem(name, "other");
      }
    },
    [addItem]
  );

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingList,
        loading,
        addItem,
        removeItem,
        toggleItem,
        refreshList,
        addMultipleItems,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx)
    throw new Error("useShoppingList must be used inside ShoppingListProvider");
  return ctx;
}
