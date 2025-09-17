// PATH: src/components/ShoppingListPage.tsx
"use client";

import React, { useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import styles from "../styles/shoppinglist-detail.module.css";

export default function ShoppingListPage() {
  const { list, loading, add, toggle, remove, clear } = useShoppingList();
  const [newItem, setNewItem] = useState("");

  if (loading) return <p>Loading shopping list...</p>;

  return (
    <div className={styles.page}>
      <h1>Shopping List</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (newItem.trim()) {
            await add(newItem);
            setNewItem("");
          }
        }}
        className={styles.addForm}
      >
        <input
          type="text"
          value={newItem}
          placeholder="Add item..."
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className={styles.list}>
        {list?.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggle(item.id)}
              />
              {item.name}
            </label>
            <button onClick={() => remove(item.id)}>x</button>
          </li>
        ))}
      </ul>

      {list?.items.length ? (
        <button onClick={clear} className={styles.clearAll}>
          Clear All
        </button>
      ) : null}
    </div>
  );
}
