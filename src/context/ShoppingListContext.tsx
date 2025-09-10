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
  lists: ShoppingList[];
  loading: boolean;
  fetchLists: () => Promise<void>;
  createList: (list: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
};

export const ShoppingListContext = createContext<
  ShoppingListContextType | undefined
>(undefined);

type ProviderProps = { children: ReactNode };

export const ShoppingListProvider = ({ children }: ProviderProps) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  /** Fetch all shopping lists */
  const fetchLists = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ShoppingList[]>("/shopping-lists");
      setLists(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create new shopping list */
  const createList = async (list: Partial<ShoppingList>) => {
    await apiFetch("/shopping-lists", {
      method: "POST",
      body: JSON.stringify(list),
    });
    await fetchLists();
  };

  /** Delete shopping list by ID */
  const deleteList = async (id: string) => {
    await apiFetch(`/shopping-lists/${id}`, { method: "DELETE" });
    setLists(lists.filter((l) => l._id !== id));
  };

  const value: ShoppingListContextType = {
    lists,
    loading,
    fetchLists,
    createList,
    deleteList,
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
