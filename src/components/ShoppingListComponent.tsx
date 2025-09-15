// src/components/ShoppingListComponent.tsx
"use client";

import React from "react";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function ShoppingListComponent() {
  const { shoppingList, toggleItem, removeItem } = useShoppingList();

  return (
    <ul className="shopping-items">
      {shoppingList.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        shoppingList.map((item) => (
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
            <button
              className="remove-button"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))
      )}
    </ul>
  );
}
