// Path: src/app/shopping-list/page.tsx
"use client";

import React, { useEffect } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";

/**
 * ShoppingListPage
 * Shows all shopping lists for the user with options to delete.
 */
const ShoppingListPage: React.FC = () => {
  const { shoppingLists, loading, fetchShoppingLists, deleteShoppingList } =
    useShoppingList(); // Shopping list context

  // Fetch shopping lists on mount
  useEffect(() => {
    fetchShoppingLists();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Shopping Lists</h1>

      {loading ? (
        <p>Loading shopping lists...</p>
      ) : shoppingLists.length === 0 ? (
        <p>No shopping lists yet. Generate one from your meal plan!</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {shoppingLists.map((list) => (
            <div
              key={list._id}
              style={{
                padding: 16,
                border: "1px solid #ccc",
                borderRadius: 8,
                backgroundColor: "#fafafa",
              }}
            >
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{list.title}</h2>
              <ul>
                {list.items.map((item, idx) => (
                  <li key={idx}>
                    {item.ingredient} - {item.quantity} {item.unit || ""}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => deleteShoppingList(list._id)}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
