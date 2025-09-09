// path: src/app/dashboard/shopping-lists/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./ShoppingListsShared.module.css";

interface ShoppingList {
  _id: string;
  name: string;
  createdAt: string;
  itemsCount: number;
}

function ShoppingListsPageContent() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch shopping lists.");

        setLists(data.lists || []);
      } catch (err) {
        console.error("Error fetching shopping lists:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load shopping lists."
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
          You haven't created any shopping lists yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {lists.map((list) => (
            <li key={list._id} className={styles.listItem}>
              <Link
                href={`/dashboard/shopping-lists/${list._id}`}
                className={styles.listLink}
              >
                {list.name} ({list.itemsCount} items) - created on{" "}
                {new Date(list.createdAt).toLocaleDateString()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ShoppingListsPage() {
  return (
    <ProtectedRoute>
      <ShoppingListsPageContent />
    </ProtectedRoute>
  );
}
