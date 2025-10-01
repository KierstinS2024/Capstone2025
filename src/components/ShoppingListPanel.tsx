// ===========================================
// PATH: src/components/ShoppingListPanel.tsx
// ===========================================
// - Editable shopping list for the current user
// - Add, toggle, remove, or clear items
// - Uses ShoppingListContext
// - Optimistic UI updates for fast feedback
// - Displays error messages for failed operations
// ===========================================

"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import styles from "@/styles/shoppingListPanel.module.css"; // CSS module

export default function ShoppingListPanel() {
  const { list, loading, add, toggle, remove, clear } = useShoppingList();
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Handle form submit to add item
  // -----------------------------
  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = newItemName.trim();
    if (!trimmedName) return;

    try {
      await add(trimmedName);
      setNewItemName("");
      setError(null);
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError("Failed to add item. Please try again.");
    }
  };

  // -----------------------------
  // Loading fallback
  // -----------------------------
  if (loading) return <p>Loading shopping list...</p>;

  const isEmpty = !list || list.items.length === 0;

  return (
    <div className={styles.panel}>
      <h1 className={styles.header}>My Shopping List</h1>

      {error && <p className={styles.error}>{error}</p>}

      {isEmpty ? (
        <p className={styles.emptyState}>Your shopping list is empty.</p>
      ) : (
        <ul className={styles.list}>
          {list.items.map((item) => (
            <li
              key={item.id || Math.random().toString()}
              className={`${styles.listItem} ${
                item.checked ? styles.checked : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={async () => {
                    if (!item.id) return;
                    setError(null);
                    try {
                      await toggle(item.id);
                    } catch (err: any) {
                      console.error("Failed to toggle item:", err);
                      setError("Failed to toggle item. Please try again.");
                    }
                  }}
                />
                {item.name}
              </label>

              <button
                className={styles.removeBtn}
                onClick={async () => {
                  if (!item.id) return;
                  setError(null);
                  try {
                    await remove(item.id);
                  } catch (err: any) {
                    console.error("Failed to remove item:", err);
                    setError("Failed to remove item. Please try again.");
                  }
                }}
                title="Remove item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddItem} className={styles.addForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item"
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!newItemName.trim()}
        >
          Add
        </button>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={async () => {
            setError(null);
            try {
              await clear();
            } catch (err: any) {
              console.error("Failed to clear list:", err);
              setError("Failed to clear list. Please try again.");
            }
          }}
          disabled={isEmpty}
        >
          Clear All
        </button>
      </form>
    </div>
  );
}
