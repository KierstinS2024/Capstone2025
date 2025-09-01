// src/context/ShoppingListContext.tsx
"use client";

// Context for managing shopping lists globally
import React, { createContext, ReactNode, useState } from "react";

interface ShoppingListContextProps {
  lists: any[];
  setLists: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ShoppingListContext = createContext<ShoppingListContextProps>({
  lists: [],
  setLists: () => {},
});

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<any[]>([]);

  return (
    <ShoppingListContext.Provider value={{ lists, setLists }}>
      {children}
    </ShoppingListContext.Provider>
  );
};
