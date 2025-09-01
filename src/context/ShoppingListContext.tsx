// src/context/ShoppingListContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ShoppingList {
  id: string;
  title: string;
  items: string[];
}

interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>;
  addShoppingList: (list: ShoppingList) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  const addShoppingList = (list: ShoppingList) => {
    setShoppingLists((prev) => [...prev, list]);
  };

  return (
    <ShoppingListContext.Provider value={{ shoppingLists, setShoppingLists, addShoppingList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingListContext = () => {
  const context = useContext(ShoppingListContext);
  if (!context) throw new Error("useShoppingListContext must be used within a ShoppingListProvider");
  return context;
};
