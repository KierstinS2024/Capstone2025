// Path: src/context/ShoppingListContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { MealType } from "@/types/mealPlan";

/**
 * Represents a single ingredient in the shopping list
 */
export interface ShoppingListItem {
  name: string;
  quantity?: string;
  mealTypes?: MealType[]; // meals this ingredient is associated with
  isNew?: boolean; // flag to highlight recently added items
}

/**
 * Context type for managing shopping list globally
 */
interface ShoppingListContextType {
  shoppingList: ShoppingListItem[];
  addItem: (item: ShoppingListItem) => void;
  removeItem: (name: string) => void;
  clearShoppingList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

/**
 * Provider component to wrap the app and manage shopping list state
 */
export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  /**
   * Add a new item to the shopping list
   * If it exists, merge meal types
   */
  const addItem = (newItem: ShoppingListItem) => {
    setShoppingList((prevList) => {
      const existingIndex = prevList.findIndex(
        (item) => item.name === newItem.name
      );
      if (existingIndex > -1) {
        const updatedList = [...prevList];
        updatedList[existingIndex].mealTypes = Array.from(
          new Set([
            ...(updatedList[existingIndex].mealTypes || []),
            ...(newItem.mealTypes || []),
          ])
        );
        updatedList[existingIndex].isNew = true;
        return updatedList;
      } else {
        return [...prevList, { ...newItem, isNew: true }];
      }
    });
  };

  /**
   * Remove an item from the shopping list by name
   */
  const removeItem = (name: string) => {
    setShoppingList((prevList) =>
      prevList.filter((item) => item.name !== name)
    );
  };

  /**
   * Clear all items from the shopping list
   */
  const clearShoppingList = () => {
    setShoppingList([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, addItem, removeItem, clearShoppingList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

/**
 * Custom hook for easy access to shopping list context
 */
export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider"
    );
  return context;
};
