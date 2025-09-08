// Path: src/app/dashboard/shopping-lists/page.tsx
"use client";

/**
 * Shopping Lists Page
 * ------------------
 * Path: /dashboard/shopping-lists
 * Features:
 * - Protected route (requires login)
 * - Fetches all shopping lists for the current user
 * - Displays list with links to view/edit
 * - Loading & error handling
 */

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { ShoppingList } from "@/types/shoppingList";

// -----------------------------
// Main page wrapper with protection
// -----------------------------
export default function ShoppingListsPage() {
  return (
    <ProtectedRoute>
      <ShoppingLists />
    </ProtectedRoute>
  );
}

// -----------------------------
// Shopping lists component
// -----------------------------
function ShoppingLists() {
  const { user } = useAuth();

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shopping lists on mount once user is available
  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch lists from API, send credentials to include HttpOnly cookie
        const res = await fetch("/api/shopping-lists", {
          credentials: "include",
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
    };

    fetchLists();
  }, [user]);

  // Loading or error states
  if (loading) return <p>Loading shopping lists...</p>;
  if (error) return <p className="error">{error}</p>;

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <main>
      <h1>Shopping Lists</h1>

      {/* Button to create a new list */}
      <Link href="/dashboard/shopping-lists/new">+ New Shopping List</Link>

      {/* Empty state */}
      {lists.length === 0 ? (
        <p>No shopping lists found.</p>
      ) : (
        // Display lists
        <ul>
          {lists.map((list) => (
            <li key={list._id}>
              {/* Link to view/edit the list */}
              <Link href={`/dashboard/shopping-lists/${list._id}`}>
                {list.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
