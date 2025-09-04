// path: src/app/shopping-lists/page.tsx
/**
 * Shopping Lists List Page
 * ------------------------
 * Displays all shopping lists for the logged-in user.
 * Users can view, edit, or create new shopping lists.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLists(data.data || []);
        } else console.error("Failed to fetch shopping lists");
      } catch (err) {
        console.error(err);
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
        <h1>My Shopping Lists</h1>
        <Link href="/shopping-lists/new">+ Create New List</Link>
        {loading ? (
          <p>Loading shopping lists…</p>
        ) : lists.length === 0 ? (
          <p>No shopping lists yet. Create your first one!</p>
        ) : (
          <ul>
            {lists.map((list) => (
              <li key={list._id}>
                <Link href={`/shopping-lists/${list._id}`}>
                  {list.name || `List ${list._id}`}
                </Link>
                <p>{list.items?.length || 0} items</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
