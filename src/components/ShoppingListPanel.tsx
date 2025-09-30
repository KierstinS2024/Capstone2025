// ===========================================
// PATH: src/components/ShoppingListPanel.tsx
// ===========================================
// Shopping List Panel Component
// -----------------------------
// - Shows user's shopping list items
// - Can add, toggle, remove, or clear items
// - Works with ShoppingListContext
// ===========================================

"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import styles from "@/styles/shoppingListPanel.module.css";

interface Props {
  hasPlan: boolean; // Controls UI when no meal plan exists
}

export default function ShoppingListPanel({ hasPlan }: Props) {
  const { list, loading, add, toggle, remove, clear } = useShoppingList();
  const [newItem, setNewItem] = useState("");

  // -----------------------------
  // Handle form submit to add item
  // -----------------------------
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await add(newItem.trim());
    setNewItem(""); // Clear input
  };

  // -----------------------------
  // Show loading state
  // -----------------------------
  if (loading) return <p>Loading shopping list...</p>;

  // -----------------------------
  // If no meal plan
  // -----------------------------
  if (!hasPlan) {
    return (
      <div className={styles.emptyState}>
        <p>Create a meal plan to generate your shopping list.</p>
      </div>
    );
  }

  // -----------------------------
  // Empty list
  // -----------------------------
  const isEmpty = !list || list.items.length === 0;

  return (
    <div className={styles.panel}>
      <h3 className={styles.header}>Shopping List</h3>

      {isEmpty ? (
        <p className={styles.emptyState}>Your shopping list is empty.</p>
      ) : (
        <ul className={styles.list}>
          {list.items.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <label className={item.checked ? styles.checked : ""}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggle(item.id)}
                />
                {item.name}
              </label>
              <button
                className={styles.removeBtn}
                onClick={() => remove(item.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* -----------------------------
          Add new item form
      ----------------------------- */}
      <form onSubmit={handleAdd} className={styles.addForm}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className={styles.input}
        />
        <button type="submit" className={styles.addBtn} disabled={!hasPlan}>
          Add
        </button>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={clear}
          disabled={isEmpty || !hasPlan}
        >
          Clear All
        </button>
      </form>
    </div>
  );
}
