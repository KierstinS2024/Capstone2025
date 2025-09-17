// PATH: src/components/ShoppingListPanel.tsx
"use client";

import React, { useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import styles from "../styles/shoppingList.module.css";

export default function ShoppingListPanel() {
  const { list, loading, add, toggle, remove, clear } = useShoppingList();
  const [newItem, setNewItem] = useState("");

  if (loading) return <p>Loading shopping list...</p>;

  return (
    <div className={styles.panel}>
      <h2>Shopping List</h2>
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

      <ul className={styles.itemList}>
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
        <button className={styles.clearBtn} onClick={clear}>
          Clear All
        </button>
      ) : null}
    </div>
  );
}
