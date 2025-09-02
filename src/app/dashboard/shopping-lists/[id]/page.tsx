// src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListDetailPage
 *
 * Displays a single shopping list with all its items.
 * - Fetches `/api/shopping-lists/:id`
 * - Shows loading and error states
 * - Allows navigating back to all shopping lists
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListDetailPage.module.css";

interface ShoppingListItem {
  name: string;
  quantity: number;
  unit?: string;
}

interface ShoppingList {
  _id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
}

export default function ShoppingListDetailPage() {
  const { id } = useParams(); // shopping list ID from URL
  const router = useRouter();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const res = await fetch(`/api/shopping-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch list.");

        setList(data.list);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error.");
      } finally {
        setLoading(false);
      }
    }

    fetchList();
  }, [id]);

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!list) return <p className={styles.message}>Shopping list not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{list.name}</h1>
      <p className={styles.createdAt}>
        Created on: {new Date(list.createdAt).toLocaleDateString()}
      </p>

      {list.items.length === 0 ? (
        <p className={styles.emptyMessage}>No items in this list yet.</p>
      ) : (
        <ul className={styles.list}>
          {list.items.map((item, index) => (
            <li key={index} className={styles.listItem}>
              {item.quantity} {item.unit ? item.unit : ""} - {item.name}
            </li>
          ))}
        </ul>
      )}

      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back to all shopping lists
      </button>
    </div>
  );
}
