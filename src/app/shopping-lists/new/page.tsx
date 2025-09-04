// path: src/app/shopping-lists/new/page.tsx
/**
 * New Shopping List Page
 * ---------------------
 * Form to create a new shopping list with items.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function NewShoppingListPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => setItems([...items, ""]);
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };
  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, items }),
      });
      if (res.ok) router.push("/shopping-lists");
      else console.error("Failed to create shopping list");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Create Shopping List</h1>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <h2>Items</h2>
        {items.map((item, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveItem(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          + Add Item
        </button>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save List"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
