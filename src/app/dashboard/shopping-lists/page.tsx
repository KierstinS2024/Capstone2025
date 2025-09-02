// src/app/dashboard/shopping-lists/page.tsx
"use client";

/**
 * AllShoppingListsPage
 *
 * Displays a list of all shopping lists for the logged-in user.
 * - Fetches from /api/shopping-lists
 * - Requires authentication
 * - Shows loading, error, and empty states
 * - Links to individual shopping list pages
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AllShoppingListsPage.module.css";

interface ShoppingList {
  _id: string;
  name: string;
  createdAt: string;
}

export default function AllShoppingListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch shopping lists");

        setLists(data.lists || []);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch shopping lists"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, []);

  if (loading)
    return <p className={styles.message}>Loading shopping lists...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Shopping Lists</h1>

      {lists.length === 0 ? (
        <p className={styles.emptyMessage}>
          You don't have any shopping lists yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {lists.map((list) => (
            <li key={list._id} className={styles.listItem}>
              <Link
                href={`/dashboard/shopping-lists/${list._id}`}
                className={styles.listLink}
              >
                {list.name} - {new Date(list.createdAt).toLocaleDateString()}
              </Link>
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
