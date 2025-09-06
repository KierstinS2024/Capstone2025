// path: src/app/shopping-lists/[shoppingListId]/page.tsx
/**
 * EditShoppingListPage.tsx
 * ------------------------
 * Allows editing an existing shopping list and its items.
 * Features:
 *  - Edit name and list of items
 *  - Validation: name required, item names required, quantities >= 1
 *  - Save changes to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface ShoppingItem {
  name: string;
  quantity: number;
}

export default function EditShoppingListPage() {
  const { shoppingListId } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load shopping list
  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/shopping-lists/${shoppingListId}`);
        const data = res.data;
        setName(data.name || "");
        setItems(data.items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading shopping list");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [shoppingListId]);

  // Validation
  const validate = (): string | null => {
    if (!name.trim()) return "Shopping list name is required";
    for (const item of items) {
      if (!item.name.trim()) return "All item names are required";
      if (item.quantity < 1) return "Item quantities must be at least 1";
    }
    return null;
  };

  // Handlers
  const handleItemChange = (
    index: number,
    field: keyof ShoppingItem,
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
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/shopping-lists/${shoppingListId}`, { name, items });
      router.push("/shopping-lists");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save shopping list");
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
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>
          Name:
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
