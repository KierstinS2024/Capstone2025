// src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListPage
 *
 * Fetches and displays a single shopping list.
 * - Fetches data from /api/shopping-lists/:id
 * - Requires authentication token
 * - Handles loading, error, and empty states
 * - Provides a back button to navigate to the previous page
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListPage.module.css";

interface ShoppingListItem {
  _id: string;
  name: string;
  quantity?: string;
  notes?: string;
}

interface ShoppingList {
  _id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
}

export default function ShoppingListPage() {
  const { id } = useParams(); // shopping list ID from URL
  const router = useRouter();

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShoppingList() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`/api/shopping-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Shopping list not found");

        setShoppingList(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch shopping list"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingList();
  }, [id]);

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!shoppingList)
    return <p className={styles.message}>Shopping list not found.</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <h1 className={styles.title}>{shoppingList.name}</h1>
      <p className={styles.date}>
        Created at: {new Date(shoppingList.createdAt).toLocaleDateString()}
      </p>

      {/* List items */}
      {shoppingList.items.length === 0 ? (
        <p className={styles.emptyMessage}>No items in this shopping list.</p>
      ) : (
        <ul className={styles.itemList}>
          {shoppingList.items.map((item) => (
            <li key={item._id} className={styles.item}>
              <span className={styles.itemName}>{item.name}</span>
              {item.quantity && (
                <span className={styles.itemQuantity}> - {item.quantity}</span>
              )}
              {item.notes && (
                <span className={styles.itemNotes}> ({item.notes})</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Back button */}
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </div>
  );
}
