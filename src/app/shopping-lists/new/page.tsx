//src/app/shopping-lists/new/page.tsx
"use client";
/**
 * NewShoppingListPage
 * -------------------
 * Allows user to manually add grocery items to a shopping list.
 * Each item = { name, quantity, unit, purchased }.
 * Sends to /api/shopping-lists.
 */

import { useState } from "react";

export default function NewShoppingListPage() {
  const [items, setItems] = useState([
    { name: "", quantity: "", unit: "", purchased: false },
  ]);

  // Update shopping list item
  const handleChange = (i: number, field: string, value: string | boolean) => {
    const updated = [...items];
    updated[i][field as keyof (typeof updated)[0]] = value as never;
    setItems(updated);
  };

  // Save list
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/shopping-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (res.ok) {
      alert("✅ Shopping list saved!");
    } else {
      alert("❌ Error saving shopping list");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a Shopping List</h1>

      {items.map((item, i) => (
        <div key={i}>
          <input
            placeholder="Item name (e.g., Apples)"
            value={item.name}
            onChange={(e) => handleChange(i, "name", e.target.value)}
          />
          <input
            placeholder="Quantity (e.g., 2)"
            value={item.quantity}
            onChange={(e) => handleChange(i, "quantity", e.target.value)}
          />
          <input
            placeholder="Unit (e.g., lbs, bags)"
            value={item.unit}
            onChange={(e) => handleChange(i, "unit", e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={(e) => handleChange(i, "purchased", e.target.checked)}
            />
            Purchased
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setItems([
            ...items,
            { name: "", quantity: "", unit: "", purchased: false },
          ])
        }
      >
        + Add Another Item
      </button>

      <button type="submit">Save Shopping List</button>
    </form>
  );
}
