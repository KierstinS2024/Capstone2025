// src/components/ShoppingListCard.tsx
import React from "react";
import { useShoppingLists } from "@/context/ShoppingListContext";

export const ShoppingListCard: React.FC = () => {
  const { shoppingLists } = useShoppingLists();
  const activeList = shoppingLists[0];

  if (!activeList) return <div>No shopping list found.</div>;

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
