// Path: src/app/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListDetailPage
 * -----------------------
 * Displays a single shopping list in detail.
 * Features:
 * - Protected route
 * - Fetches shopping list from `/api/shopping-lists/[id]`
 * - Shows title, notes, and items
 * - Link to edit page
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ShoppingList } from "@/types/shoppingList";
import styles from "./ShoppingListDetailPage.module.css";

export default function ShoppingListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Fetch shopping list by ID
  // -----------------------------
  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/shopping-lists/${listId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch shopping list");
        const data = await res.json();
        setShoppingList(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load shopping list");
      } finally {
        setLoading(false);
      }
    }
    fetchShoppingList();
  }, [listId]);

  return (
    <ProtectedRoute>
      <main className={styles.container}>
        {loading && <p>Loading shopping list...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {shoppingList && (
          <>
            <h1 className={styles.title}>{shoppingList.title}</h1>
            {shoppingList.notes && <p>{shoppingList.notes}</p>}

            <section className={styles.section}>
              <h2>Items</h2>
              <ul>
                {shoppingList.items?.map((item) => (
                  <li key={item._id ?? item.name}>
                    {item.quantity} {item.unit ?? ""} {item.name}
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href={`/dashboard/shopping-lists/${shoppingList._id}/edit`}
              className={styles.editButton}
            >
              Edit Shopping List
            </Link>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
