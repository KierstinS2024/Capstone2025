// path: src/app/shopping-lists/new/page.tsx
/**
 * NewShoppingListPage.tsx
 * -----------------------
 * Allows users to create a new shopping list.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function NewShoppingListPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleAddItem = () => setItems([...items, ""]);
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/shopping-lists", { name, items });
      router.push("/shopping-lists");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Create Shopping List</h1>
        <label>
          List Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <h2>Items</h2>
        {items.map((item, idx) => (
          <input
            key={idx}
            type="text"
            value={item}
            onChange={(e) => handleItemChange(idx, e.target.value)}
          />
        ))}
        <button onClick={handleAddItem}>+ Add Item</button>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save List"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
