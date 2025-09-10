// src/context/ShoppingListContext.tsx
// React context for managing shopping lists

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { ShoppingList } from "@/types/shoppingList";
import { apiFetch } from "@/lib/api";

type ShoppingListContextType = {
  shoppingLists: ShoppingList[];
  loading: boolean;
  fetchShoppingLists: () => Promise<void>;
  createShoppingList: (list: Partial<ShoppingList>) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
};

export const ShoppingListContext = createContext<
  ShoppingListContextType | undefined
>(undefined);

type ProviderProps = { children: ReactNode };

export const ShoppingListProvider = ({ children }: ProviderProps) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  /** Fetch all shopping lists */
  const fetchShoppingLists = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ShoppingList[]>("/shopping-lists");
      setShoppingLists(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create a shopping list */
  const createShoppingList = async (list: Partial<ShoppingList>) => {
    await apiFetch("/shopping-lists", {
      method: "POST",
      body: JSON.stringify(list),
    });
    await fetchShoppingLists();
  };

  /** Delete a shopping list */
  const deleteShoppingList = async (id: string) => {
    await apiFetch(`/shopping-lists/${id}`, { method: "DELETE" });
    setShoppingLists(shoppingLists.filter((s) => s._id !== id));
  };

  const value: ShoppingListContextType = {
    shoppingLists,
    loading,
    fetchShoppingLists,
    createShoppingList,
    deleteShoppingList,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingLists = () => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error(
      "useShoppingLists must be used within a ShoppingListProvider"
    );
  return context;
};
