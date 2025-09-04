// path: src/app/shopping-lists/page.tsx
/**
 * Shopping Lists List Page
 * ------------------------
 * Lists all shopping lists for the logged-in user.
 * Users can create a new list or edit existing ones.
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

  if (loading)
    return <p style={{ padding: "20px" }}>Loading shopping lists...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>My Shopping Lists</h1>
        <Link href="/shopping-lists/new">
          <button>Create New Shopping List</button>
        </Link>

        {lists.length === 0 ? (
          <p>No shopping lists yet. Create one!</p>
        ) : (
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
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
