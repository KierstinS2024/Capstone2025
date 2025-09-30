// ===========================================
// PATH: src/components/ShoppingListPage.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useAuth } from "@/context/AuthContext";
import ShoppingListComponent from "./ShoppingListComponent";
import styles from "@/styles/shoppinglist-detail.module.css";

export default function ShoppingListPage() {
  const { user } = useAuth();
  const { list, loading, add, toggle, remove, clear } = useShoppingList();
  const [newItem, setNewItem] = useState("");

  if (loading) return <p>Loading shopping list...</p>;
  if (list && list.ownerEmail !== user?.email)
    return <p>No shopping list found.</p>;

  return (
    <div className={styles.page}>
      <h1>Shopping List</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newItem.trim()) return;
          await add(newItem.trim());
          setNewItem("");
        }}
        className={styles.addForm}
      >
        <input
          type="text"
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {list ? (
        <ShoppingListComponent
          list={list}
          onToggle={toggle}
          onRemove={remove}
          onClear={clear}
        />
      ) : (
        <p>No items yet. Add something to your shopping list!</p>
      )}
    </div>
  );
}
