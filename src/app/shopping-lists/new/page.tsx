// path: src/app/shopping-lists/new/page.tsx
/**
 * Create Shopping List Page
 * -------------------------
 * Lets the user create a new shopping list:
 *  - Enter a title
 *  - Add multiple items (ingredient, quantity, unit)
 *  - Submit to backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewShoppingListPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a blank item row
  const handleAddItem = () => {
    setItems([
      ...items,
      { ingredientId: "", quantity: 1, unit: "", purchased: false },
    ]);
  };

  // Update item field
  const handleItemChange = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Remove an item
  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Submit new list to backend
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

      {/* List title input */}
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      {/* Dynamic items list */}
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
            min="1"
            placeholder="Quantity"
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
          <label>
            Purchased:
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={(e) =>
                handleItemChange(idx, "purchased", e.target.checked)
              }
            />
          </label>
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

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Shopping List"}
        </button>
      </div>
    </div>
  );
}
