// path: src/app/shopping-lists/new/page.tsx
/**
 * Create Shopping List Page
 * -------------------------
 * Lets the user build a shopping list manually.
 * They can:
 *  - Add items with ingredient, quantity, and unit
 *  - Mark items as purchased (default false)
 *  - Submit the list to save in the backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function NewShoppingListPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Add a blank item row
  const handleAddItem = () => {
    setItems([
      ...items,
      { ingredientId: "", quantity: 1, unit: "", purchased: false },
    ]);
  };

  // Update an item by index
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Remove an item row
  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Save new shopping list
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, items }),
      });

      if (res.ok) {
        router.push("/shopping-lists");
      } else {
        console.error("Failed to create shopping list");
      }
    } catch (err) {
      console.error("Error creating shopping list:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Shopping List</h1>

      {/* Title input */}
      <label>
        List Title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      {/* Items list */}
      <h2>Items</h2>
      {items.map((item, idx) => (
        <div key={idx} className={styles.card}>
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
              handleItemChange(idx, "quantity", parseFloat(e.target.value))
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
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Shopping List"}
        </button>
      </div>
    </div>
  );
}
