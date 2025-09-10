// src/context/ShoppingListContext.tsx
// Provides state management for shopping lists

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ShoppingList } from "@/models/ShoppingList";

// Define context shape
interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  addShoppingList: (list: ShoppingList) => void;
  removeShoppingList: (id: string) => void;
}

// Create context with undefined default for safety
const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

// Provider component
export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  // Add a new list
  const addShoppingList = (list: ShoppingList) => {
    setShoppingLists((prev) => [...prev, list]);
  };

  // Remove list by id
  const removeShoppingList = (id: string) => {
    setShoppingLists((prev) => prev.filter((list) => list.id !== id));
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingLists, addShoppingList, removeShoppingList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

// Hook for consuming the context
export function useShoppingListContext() {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error(
      "useShoppingListContext must be used within ShoppingListProvider"
    );
  return context;
}
