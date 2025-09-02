// src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListDetailPage
 *
 * Displays the details of a single shopping list.
 * - Fetches shopping list items from `/api/shopping-lists/:id`
 * - Allows marking items as purchased
 * - Shows loading and error states
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListDetailPage.module.css";

interface ShoppingListItem {
  _id: string;
  name: string;
  quantity: string;
  purchased: boolean;
}

interface ShoppingList {
  _id: string;
  name: string;
  createdAt: string;
  items: ShoppingListItem[];
}

export default function ShoppingListDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shopping list from backend
  useEffect(() => {
    async function fetchShoppingList() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const res = await fetch(`/api/shopping-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Shopping list not found.");

        setShoppingList(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch shopping list."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingList();
  }, [id]);

  // Toggle purchased state of an item
  async function togglePurchased(itemId: string) {
    if (!shoppingList) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      const res = await fetch(
        `/api/shopping-lists/${id}/items/${itemId}/toggle`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to update item.");

      // Optimistically update UI
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items.map((item) =>
          item._id === itemId ? { ...item, purchased: !item.purchased } : item
        ),
      });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error updating item.");
    }
  }

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!shoppingList)
    return <p className={styles.message}>Shopping list not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{shoppingList.name}</h1>
      <p className={styles.date}>
        Created at: {new Date(shoppingList.createdAt).toLocaleDateString()}
      </p>

      <ul className={styles.itemsList}>
        {shoppingList.items.map((item) => (
          <li key={item._id} className={styles.item}>
            <label>
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => togglePurchased(item._id)}
              />
              <span className={item.purchased ? styles.purchased : ""}>
                {item.name} ({item.quantity})
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </div>
  );
}
