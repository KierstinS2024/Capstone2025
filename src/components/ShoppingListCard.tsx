// src/components/ShoppingListCard.tsx
import React, { useContext } from "react";
import { ShoppingListContext } from "@/context/ShoppingListContext";
import type { ShoppingList } from "@/models/ShoppingList";

/**
 * ShoppingListCard Component
 * Displays the current user's shopping list with checkable items.
 */
export const ShoppingListCard: React.FC = () => {
  const { shoppingLists } = useContext(ShoppingListContext);

  // Pick the first active list (or placeholder)
  const activeList: ShoppingList | null = shoppingLists[0] || null;

  if (!activeList) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fefefe",
        }}
      >
        No shopping list found.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
        {activeList.title}
      </h2>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {activeList.items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "8px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input type="checkbox" checked={item.checked} readOnly />
              <span>
                {item.ingredient} - {item.quantity} ({item.category})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
