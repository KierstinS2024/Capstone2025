// path: src/components/ShoppingListComponent.tsx
"use client";
import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function ShoppingListComponent() {
  const {
    items,
    loading,
    addItem,
    removeItem,
    toggleChecked,
    generateFromMeals,
  } = useShoppingList() as any;
  const [text, setText] = useState("");

  if (loading) return <p>Loading shopping list...</p>;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addItem(text.trim());
    setText("");
  };

  return (
    <div className="card">
      <h3>Shopping List</h3>
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, marginTop: 8 }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add item..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid var(--border)",
          }}
        />
        <button className="button" type="submit">
          Add
        </button>
      </form>

      <ul style={{ marginTop: 12 }}>
        {items.length === 0 && <p className="small muted">No items yet.</p>}
        {items.map((it: any) => (
          <li
            key={it.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderTop: "1px solid var(--border)",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={it.checked}
                onChange={() => toggleChecked(it.id)}
                style={{ marginRight: 8 }}
              />
              <span
                style={{ textDecoration: it.checked ? "line-through" : "none" }}
              >
                {it.name}
              </span>
            </label>
            <button className="button-muted" onClick={() => removeItem(it.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }} className="small muted">
        Items are persisted to your account.
      </div>
    </div>
  );
}
