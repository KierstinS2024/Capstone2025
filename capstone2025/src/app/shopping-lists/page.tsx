// Path: src/app/shopping-lists/page.tsx
"use client";

/**
 * ShoppingListsPage
 * -----------------
 * Displays all shopping lists for the logged-in user.
 * Features:
 * - Protected route
 * - Fetches from `/api/shopping-lists`
 * - Links to detail and creation pages
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ShoppingList } from "@/types/shoppingList";

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch shopping lists");
        const data = await res.json();
        setLists(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load shopping lists");
      } finally {
        setLoading(false);
      }
    }
    fetchLists();
  }, []);

  return (
    <ProtectedRoute>
      <main>
        <h1>Shopping Lists</h1>
        <Link href="/dashboard/shopping-lists/new">+ New Shopping List</Link>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <ul>
          {lists.map((list) => (
            <li key={list._id}>
              <Link href={`/dashboard/shopping-lists/${list._id}`}>
                {list.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </ProtectedRoute>
  );
}
