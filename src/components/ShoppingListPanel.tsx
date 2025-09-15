// src/components/ShoppingListPanel.tsx
"use client";

import React from "react";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function ShoppingListPanel() {
  const { shoppingList, toggleItem, removeItem } = useShoppingList();

  if (!shoppingList.length) return <p>Your shopping list is empty.</p>;

  return (
    <ul className="shopping-list-panel">
      {shoppingList.map((item) => (
        <li key={item.id} className="shopping-item">
          <label>
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => toggleItem(item.id)}
            />
            <span className={item.purchased ? "purchased" : ""}>
              {item.name}
            </span>
          </label>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
