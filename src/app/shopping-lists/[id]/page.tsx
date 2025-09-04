// path: src/app/shopping-lists/[id]/page.tsx
/**
 * Edit Shopping List Page
 * ----------------------
 * Edit an existing shopping list and its items.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function EditShoppingListPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`/api/shopping-lists/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setItems(data.items || []);
        } else console.error("Failed to fetch shopping list");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [params.id]);

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
    setSaving(true);
    try {
      const res = await fetch(`/api/shopping-lists/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, items }),
      });
      if (res.ok) router.push("/shopping-lists");
      else console.error("Failed to update shopping list");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading list…</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Shopping List</h1>
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
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
