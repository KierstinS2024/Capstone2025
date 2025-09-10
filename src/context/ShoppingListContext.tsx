// src/context/ShoppingListContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import type { ShoppingList } from "../models/ShoppingList";
import { fetchShoppingLists } from "../lib/shoppingListApi";

type ShoppingListContextType = {
  lists: ShoppingList[];
  refresh: () => Promise<void>;
};

export const ShoppingListContext = createContext<
  ShoppingListContextType | undefined
>(undefined);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);

  const refresh = async () => {
    const data = await fetchShoppingLists();
    setLists(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ShoppingListContext.Provider value={{ lists, refresh }}>
      {children}
    </ShoppingListContext.Provider>
  );
};
