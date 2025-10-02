// ===========================================
// PATH: src/components/ShoppingListPanel.tsx
// Editable shopping list panel
// Accepts optional `list` prop or uses context
// Optimistic UI updates with error handling
// ===========================================

"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { ShoppingList } from "@/types";
import styles from "@/styles/shoppingListPanel.module.css";

// Props interface
interface ShoppingListPanelProps {
  list?: ShoppingList | null; // Optional list, defaults to context
}

/**
 * ShoppingListPanel
 * - Add, remove, toggle, or clear items
 * - Shows empty state and errors
 */
export default function ShoppingListPanel({ list: propList }: ShoppingListPanelProps) {
  const {
    list: contextList,
    loading,
    add,
    toggle,
    remove,
    clear,
  } = useShoppingList();
  const list = propList ?? contextList; // Prefer prop if provided

  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Add new item
  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    try {
      await add(trimmed);
      setNewItemName("");
      setError(null);
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError("Failed to add item. Please try again.");
    }
  };

  if (loading) return <p>Loading shopping list...</p>;

  const isEmpty = !list || list.items.length === 0;

  return (
    <div className={styles.panel}>
      <h2 className={styles.header}>Shopping List</h2>

      {error && <p className={styles.error}>{error}</p>}

      {isEmpty ? (
        <p className={styles.emptyState}>Your shopping list is empty.</p>
      ) : (
        <ul className={styles.list}>
          {list.items.map((item) => (
            <li
              key={item.id}
              className={`${styles.listItem} ${
                item.checked ? styles.checked : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={async () => {
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
                title="Remove item"
                onClick={async () => {
                  setError(null);
                  try {
                    await remove(item.id);
                  } catch (err: any) {
                    console.error("Failed to remove item:", err);
                    setError("Failed to remove item. Please try again.");
                  }
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form to add new item */}
      <form onSubmit={handleAddItem} className={styles.addForm}>
        <input
          type="text"
          placeholder="Add new item"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
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
