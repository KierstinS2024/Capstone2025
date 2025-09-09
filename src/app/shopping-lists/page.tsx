// src/app/shopping-lists/page.tsx
/**
 * ShoppingListsListPage.tsx
 * -------------------------
 * Displays all shopping lists for the logged-in user.
 * Users can view, edit, or create new lists.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface ShoppingList {
  _id: string;
  name: string;
  items?: any[];
}

export default function ShoppingListsListPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/shopping-lists");
        setLists(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Error loading shopping lists");
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <header>
          <h1>Shopping Lists</h1>
          <Link href="/shopping-lists/new">
            <button>+ New List</button>
          </Link>
        </header>
        {loading && <p>Loading shopping lists...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {lists.map((list) => (
              <li
                key={list._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link href={`/shopping-lists/${list._id}`}>
                  <strong>{list.name}</strong>
                </Link>
                <p>Items: {list.items?.length || "No items added"}</p>
              </li>
            ))}
            {lists.length === 0 && <li>No shopping lists yet. Create one!</li>}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
