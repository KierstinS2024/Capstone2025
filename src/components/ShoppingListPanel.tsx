// path: src/components/ShoppingListPanel.tsx
"use client";

import React from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import "@/styles/shoppingList.css";

export default function ShoppingListPanel() {
  const { shoppingList, toggleItem, removeItem, loading } = useShoppingList();

  if (loading) return <p className="loading">Loading shopping list...</p>;

  return (
    <div className="shopping-list-panel">
      <h3 className="panel-title">Shopping List</h3>

      {shoppingList.length === 0 ? (
        <p className="empty-state">Your shopping list is empty.</p>
      ) : (
        <ul className="shopping-items">
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
              <button
                className="remove-button"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
