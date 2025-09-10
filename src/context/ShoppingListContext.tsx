// src/context/ShoppingListContext.tsx
// React context for managing shopping lists
"use client";

import {
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

// --------------------
// Types
// --------------------
type ShoppingListContextType = {
  shoppingLists: ShoppingList[];
  loading: boolean;
  fetchShoppingLists: () => Promise<void>;
  createShoppingList: (list: Partial<ShoppingList>) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
  addShoppingList: (list: ShoppingList) => void; // <--- NEW
};

// --------------------
// Context creation
// --------------------
export const ShoppingListContext = createContext<
  ShoppingListContextType | undefined
>(undefined);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const ShoppingListProvider = ({ children }: ProviderProps) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch shopping lists on mount
  useEffect(() => {
    fetchShoppingLists();
  }, []);

  // --------------------
  // Context actions
  // --------------------

  /** Fetch all shopping lists */
  const fetchShoppingLists = async () => {
    setLoading(true);
    try {
      const data = await fetchShoppingListsAPI();
      setShoppingLists(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create a new shopping list and refresh state */
  const createShoppingList = async (list: Partial<ShoppingList>) => {
    const newList = await createShoppingListAPI(list);
    setShoppingLists((prev) => [...prev, newList]);
  };

  /** Delete a shopping list by ID */
  const deleteShoppingList = async (id: string) => {
    await deleteShoppingListAPI(id);
    setShoppingLists((prev) => prev.filter((l) => l._id !== id));
  };

  /** Add a shopping list directly to context (used for generated lists) */
  const addShoppingList = (list: ShoppingList) => {
    setShoppingLists((prev) => [...prev, list]);
  };

  // --------------------
  // Context value
  // --------------------
  const value: ShoppingListContextType = {
    shoppingLists,
    loading,
    fetchShoppingLists,
    createShoppingList,
    deleteShoppingList,
    addShoppingList, // <--- included
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};

// --------------------
// Hook for consuming ShoppingListContext safely
// --------------------
export const useShoppingLists = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error(
      "useShoppingLists must be used within a ShoppingListProvider"
    );
  return context;
};
