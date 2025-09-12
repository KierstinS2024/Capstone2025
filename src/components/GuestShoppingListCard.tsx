"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";

const GuestShoppingListCard: React.FC = () => {
  const { guestShoppingList, clearGuestShoppingList } = useGuest();

  if (guestShoppingList.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          border: "1px solid #d8cfc4",
          borderRadius: 12,
          backgroundColor: "#f4f1ed",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
          Guest Shopping List
        </h2>
        <p style={{ fontStyle: "italic", color: "#8b7d70" }}>
          Add meals to see the shopping list.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        border: "1px solid #d8cfc4",
        borderRadius: 12,
        backgroundColor: "#f4f1ed",
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        Guest Shopping List 🛒
      </h2>
      <ul style={{ marginBottom: 16 }}>
        {guestShoppingList.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 6 }}>
            {item.quantity ? `${item.quantity} ` : ""}
            {item.name}
          </li>
        ))}
      </ul>
      <button
        onClick={clearGuestShoppingList}
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

export default GuestShoppingListCard;
