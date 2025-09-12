// Path: src/components/ShoppingList.tsx
"use client";

import React from "react";
import {
  useShoppingList,
  ShoppingListItem,
} from "@/context/ShoppingListContext";

/**
 * Component to display the user's current shopping list
 */
const ShoppingList: React.FC = () => {
  const { shoppingList, clearShoppingList, removeItem } = useShoppingList();

  if (!shoppingList || shoppingList.length === 0) {
    return (
      <p style={{ padding: 24, fontStyle: "italic" }}>
        Your shopping list is empty. Add meals or ingredients to see items here!
      </p>
    );
  }

  /**
   * Render each shopping list item
   */
  const renderItem = (item: ShoppingListItem, index: number) => (
    <li
      key={item.name}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
        color: item.isNew ? "#22c55e" : "#3a2d25",
        fontWeight: item.isNew ? 600 : 400,
      }}
    >
      <span>
        {item.quantity ? `${item.quantity} ` : ""}
        {item.name}
        {item.mealTypes && item.mealTypes.length > 0
          ? ` (${item.mealTypes.join(", ")})`
          : ""}
      </span>
      <button
        onClick={() => removeItem(item.name)}
        style={{
          padding: "2px 6px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#ef4444",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </li>
  );

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#fffdfb",
        borderRadius: 12,
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Shopping List 🛒
      </h2>
      <ul style={{ marginBottom: 16, listStyle: "none", padding: 0 }}>
        {shoppingList.map(renderItem)}
      </ul>
      <button
        onClick={clearShoppingList}
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#ef4444",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Clear List
      </button>
    </div>
  );
};

export default ShoppingList;
