// src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListDetailPage
 *
 * Shows a single shopping list including its items.
 * - Fetches /api/shopping-lists/[id]
 * - Displays list name, created date, and items
 * - Shows loading/error states
 * - Back button navigates to /dashboard/shopping-lists
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListDetailPage.module.css";

interface ShoppingListItem {
  _id: string;
  name: string;
  quantity?: number;
  purchased?: boolean;
}

interface ShoppingList {
  _id: string;
  name: string;
  createdAt: string;
  items: ShoppingListItem[];
}

export default function ShoppingListDetailPage() {
  const { id } = useParams(); // Extract shopping list ID from URL
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

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!shoppingList)
    return <p className={styles.message}>Shopping list not found.</p>;

  return (
    <div className={styles.container}>
      {/* Shopping list header */}
      <h1 className={styles.title}>{shoppingList.name}</h1>
      <p className={styles.created}>
        Created on {new Date(shoppingList.createdAt).toLocaleDateString()}
      </p>

      {/* Items section */}
      {shoppingList.items.length === 0 ? (
        <p className={styles.emptyMessage}>
          No items in this shopping list yet.
        </p>
      ) : (
        <ul className={styles.itemList}>
          {shoppingList.items.map((item) => (
            <li key={item._id} className={styles.item}>
              {item.name} {item.quantity ? `- ${item.quantity}` : ""}
              {item.purchased ? " ✅" : ""}
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
