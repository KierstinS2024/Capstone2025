// path: src/app/shopping-lists/new/page.tsx
/**
 * Create Shopping List Page
 * -------------------------
 * Allows the user to build a new shopping list.
 * They can:
 *  - Add items (ingredient + quantity + unit)
 *  - Mark items as purchased (default false)
 *  - Submit list to backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewShoppingListPage() {
  const router = useRouter();

  // Local state
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a blank item row
  const handleAddItem = () => {
    setItems([
      ...items,
      { ingredientId: "", quantity: 1, unit: "pcs", purchased: false },
    ]);
  };

  // Update item field
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Submit new shopping list
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, items }),
      });

      if (res.ok) router.push("/shopping-lists");
      else console.error("Failed to create shopping list");
    } catch (err) {
      console.error("Error creating shopping list:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Shopping List</h1>

      <label>
        List Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <h2>Items</h2>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Ingredient ID"
            value={item.ingredientId}
            onChange={(e) =>
              handleItemChange(idx, "ingredientId", e.target.value)
            }
          />
          <input
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(idx, "quantity", parseInt(e.target.value))
            }
          />
          <input
            type="text"
            placeholder="Unit"
            value={item.unit}
            onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveItem(idx)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={handleAddItem}>+ Add Item</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Shopping List"}
        </button>
      </div>
    </div>
  );
}
