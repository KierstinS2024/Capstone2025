// path: src/app/shopping-lists/[id]/page.tsx
/**
 * Edit Shopping List Page
 * ------------------------
 * Loads a shopping list by ID and allows:
 *  - Editing title
 *  - Adding/removing/updating items
 *  - Marking items as purchased
 *  - Saving updates to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditShoppingListPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load list from backend
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`/api/shopping-lists/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTitle(data.data.title || "");
          setItems(data.data.items || []);
        } else console.error("Failed to load shopping list");
      } catch (err) {
        console.error("Error fetching shopping list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [params.id]);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { ingredientId: "", quantity: 1, unit: "", purchased: false },
    ]);
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
        body: JSON.stringify({ title, items }),
      });

      if (res.ok) router.push("/shopping-lists");
      else console.error("Failed to update shopping list");
    } catch (err) {
      console.error("Error updating shopping list:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading shopping list...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Shopping List</h1>

      <label>
        Title:
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
