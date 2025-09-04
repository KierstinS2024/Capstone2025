// path: src/app/shopping-lists/[id]/page.tsx
/**
 * Edit Shopping List Page
 * ----------------------
 * Edit existing shopping list and its items.
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
  const [items, setItems] = useState<any[]>([]);
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
          setName(data.data.name || "");
          setItems(data.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [params.id]);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleAddItem = () => setItems([...items, { name: "", quantity: 1 }]);
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
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading shopping list...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Shopping List</h1>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(idx, "name", e.target.value)}
            />
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(idx, "quantity", parseInt(e.target.value))
              }
            />
            <button
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
