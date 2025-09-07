"use client";

/**
 * Dashboard Shopping Lists Page
 * -----------------------------
 * Shows all shopping lists for the logged-in user.
 * Features:
 * - ProtectedRoute (JWT + AuthContext)
 * - Fetch shopping lists from /api/shopping-lists
 * - Show "Create New" button
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { ShoppingList } from "@/types/shoppingList";
import styles from "./ShoppingListsPage.module.css";

export default function ShoppingListsPage() {
  return (
    <ProtectedRoute>
      <ShoppingListsContent />
    </ProtectedRoute>
  );
}

function ShoppingListsContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch shopping lists");

        const data = await res.json();
        setLists(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, [user]);

  if (loading)
    return <p className={styles.message}>Loading shopping lists...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Shopping Lists</h1>

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/shopping-lists/new")}
      >
        + Create New Shopping List
      </button>

      {lists.length === 0 ? (
        <p className={styles.emptyMessage}>You have no shopping lists yet.</p>
      ) : (
        <div className={styles.cardsGrid}>
          {lists.map((list) => (
            <div
              key={list._id}
              className={styles.card}
              onClick={() =>
                router.push(`/dashboard/shopping-lists/${list._id}`)
              }
            >
              <h2>{list.title}</h2>
              <p>{list.items.length} items</p>
              <small>
                {list.createdAt
                  ? new Date(list.createdAt).toLocaleDateString()
                  : ""}
              </small>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
