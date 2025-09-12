// Path: src/app/shopping-list/page.tsx
"use client";

import React, { useEffect } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

const ShoppingListPage: React.FC = () => {
  const { meals } = useMealPlan();
  const { items, generateFromMeals, toggleItem, clearList } = useShoppingList();

  useEffect(() => {
    if (meals.length > 0) {
      generateFromMeals(meals);
    }
  }, [meals]);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
        Shopping List
      </h1>

      {items.length === 0 ? (
        <p>No items yet. Add meals to your plan to generate a list!</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  padding: "8px 12px",
                  marginBottom: 6,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  backgroundColor: item.checked ? "#e5e7eb" : "#fff",
                }}
              >
                <span>
                  {item.name}{" "}
                  {item.quantity && (
                    <span style={{ fontSize: 14, color: "#555" }}>
                      ({item.quantity} {item.unit})
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  style={{ pointerEvents: "none" }}
                />
              </li>
            ))}
          </ul>
          <button
            onClick={clearList}
            style={{
              marginTop: 16,
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
        </>
      )}
    </div>
  );
};

export default ShoppingListPage;
