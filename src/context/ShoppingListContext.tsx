"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { ShoppingList } from "@/types/shoppingList";
import {
  fetchShoppingListsAPI,
  createShoppingListAPI,
  deleteShoppingListAPI,
} from "@/lib/shoppingListApi";

type ShoppingListContextType = {
  shoppingLists: ShoppingList[];
  loading: boolean;
  fetchShoppingLists: () => Promise<void>;
  createShoppingList: (list: ShoppingList) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShoppingLists = async () => {
    setLoading(true);
    const lists = await fetchShoppingListsAPI();
    setShoppingLists(lists);
    setLoading(false);
  };

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const createShoppingList = async (list: ShoppingList) => {
    await createShoppingListAPI(list);
    await fetchShoppingLists();
  };

  const deleteShoppingList = async (id: string) => {
    await deleteShoppingListAPI(id);
    await fetchShoppingLists();
  };

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingLists,
        loading,
        fetchShoppingLists,
        createShoppingList,
        deleteShoppingList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const ctx = useContext(ShoppingListContext);
  if (!ctx)
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  return ctx;
};
