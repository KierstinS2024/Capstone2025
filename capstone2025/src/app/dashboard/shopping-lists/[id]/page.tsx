"use client";

/**
 * Individual Shopping List Page
 * -----------------------------
 * Shows the details of a single shopping list.
 * Features:
 * - ProtectedRoute (JWT + AuthContext)
 * - Display all items, their quantities, and purchased status
 * - Allow marking items as purchased
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import styles from "./ShoppingListPage.module.css";

export default function ShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingListContent />
    </ProtectedRoute>
  );
}

function ShoppingListContent() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const listId = params.id;

  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchList() {
      if (!user || !listId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/shopping-lists/${listId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch shopping list");

        const data = await res.json();
        setList(data.data || null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchList();
  }, [user, listId]);

  const togglePurchased = async (item: ShoppingListItem) => {
    if (!list) return;

    try {
      const updatedItems = list.items.map((i) =>
        i.ingredientId === item.ingredientId
          ? { ...i, purchased: !i.purchased }
          : i
      );

      const res = await fetch(`/api/shopping-lists/${list._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!res.ok) throw new Error("Failed to update shopping list");

      setList({ ...list, items: updatedItems });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!list) return <p className={styles.error}>Shopping list not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{list.title}</h1>
      <ul className={styles.itemList}>
        {list.items.map((item) => (
          <li key={item.ingredientId} className={styles.item}>
            <span>
              {item.quantity} {item.unit} - {item.name}
            </span>
            <button onClick={() => togglePurchased(item)}>
              {item.purchased ? "✔ Purchased" : "Mark as Purchased"}
            </button>
          </li>
        ))}
      </ul>

      <button
        className={styles.backButton}
        onClick={() => router.push("/dashboard/shopping-lists")}
      >
        ← Back to Shopping Lists
      </button>
    </main>
  );
}
