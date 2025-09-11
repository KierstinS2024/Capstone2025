import React, { useEffect, useState } from "react";
import { useShoppingLists } from "@/context/ShoppingListContext";

/**
 * ShoppingListCard
 * Displays the latest shopping list and highlights new lists temporarily
 */
export const ShoppingListCard: React.FC = () => {
  const { shoppingLists } = useShoppingLists();
  const activeList = shoppingLists[0]; // newest list
  const [highlight, setHighlight] = useState(false);

  // Trigger highlight whenever a new shopping list appears
  useEffect(() => {
    if (activeList) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1500); // fade after 1.5s
      return () => clearTimeout(timer);
    }
  }, [activeList]);

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
        backgroundColor: highlight ? "#fffae6" : "#fafafa", // highlight color
        transition: "background-color 1s ease",
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
