// src/context/ShoppingListContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

interface ShoppingList {
  id: string;
  title: string;
  items: string[];
}

interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  addShoppingList: (list: ShoppingList) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  const addShoppingList = (list: ShoppingList) => {
    setShoppingLists((prev) => [...prev, list]);
  };

  return (
    <ShoppingListContext.Provider value={{ shoppingLists, addShoppingList }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingLists() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error("useShoppingLists must be used within a ShoppingListProvider");
  }
  return ctx;
}
