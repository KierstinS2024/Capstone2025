// path: src/components/ShoppingListCard.tsx
/**
 * ShoppingListCard
 *
 * Displays a single shopping list with all its items.
 * Features:
 * - Shows each item's name, quantity, unit, and purchased status
 * - Allows toggling purchased status via checkbox
 * - Clean layout for multiple shopping lists
 */

"use client";

import { useState } from "react";
import styles from "./ShoppingListCard.module.css";

// TypeScript interfaces for clarity
interface ShoppingListItem {
  ingredientName: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  _id: string; // Item ID for updating status
}

interface ShoppingList {
  _id: string;
  createdAt: string;
  items: ShoppingListItem[];
}

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
}

export default function ShoppingListCard({
  shoppingList,
}: ShoppingListCardProps) {
  const [items, setItems] = useState<ShoppingListItem[]>(shoppingList.items);
  const [updating, setUpdating] = useState(false);

  // Toggle purchased status of an item
  const togglePurchased = async (itemId: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const item = items.find((i) => i._id === itemId);
      if (!item) return;

      const res = await fetch(`/api/shopping-lists/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ purchased: !item.purchased }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i._id === itemId ? { ...i, purchased: !i.purchased } : i
          )
        );
      }
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        Shopping List ({new Date(shoppingList.createdAt).toLocaleDateString()})
      </h3>

      {items.length === 0 ? (
        <p className={styles.message}>No items in this list.</p>
      ) : (
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item._id} className={styles.item}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  checked={item.purchased}
                  disabled={updating}
                  onChange={() => togglePurchased(item._id)}
                  className={styles.checkbox}
                />
                <span
                  className={item.purchased ? styles.purchased : ""}
                >{`${item.ingredientName} - ${item.quantity} ${item.unit}`}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
