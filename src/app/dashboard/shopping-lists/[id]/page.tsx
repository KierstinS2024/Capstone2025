// src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListDetailPage
 *
 * Displays a single shopping list with all its items.
 * - Fetches shopping list from `/api/shopping-lists/[id]`
 * - Handles loading and error states
 * - Provides a back button to return to the shopping lists overview
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListDetailPage.module.css";

interface ShoppingListItem {
  name: string;
  quantity: string;
  notes?: string;
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

        setShoppingList(data.list);
      } catch (err) {
        console.error("Error fetching shopping list:", err);
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
      <h1 className={styles.title}>{shoppingList.name}</h1>
      <p className={styles.created}>
        Created on: {new Date(shoppingList.createdAt).toLocaleDateString()}
      </p>

      {shoppingList.items.length === 0 ? (
        <p className={styles.emptyMessage}>This shopping list has no items.</p>
      ) : (
        <ul className={styles.itemsList}>
          {shoppingList.items.map((item, index) => (
            <li key={index} className={styles.item}>
              <strong>{item.name}</strong> - {item.quantity}
              {item.notes && (
                <span className={styles.notes}> ({item.notes})</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </div>
  );
}
