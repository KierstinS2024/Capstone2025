// path: src/app/shopping-lists/page.tsx
/**
 * Shopping Lists List Page
 * ------------------------
 * Displays all shopping lists for the logged-in user.
 * From here, the user can:
 *  - View existing lists
 *  - Navigate to create a new list
 *  - Click on a list to edit it
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        } else {
          console.error("Failed to fetch shopping lists");
        }
      } catch (err) {
        console.error("Error loading shopping lists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading shopping lists...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Shopping Lists</h1>

      {/* Button to create a new shopping list */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/shopping-lists/new">
          <button>Create New Shopping List</button>
        </Link>
      </div>

      {lists.length === 0 ? (
        <p>You don’t have any shopping lists yet. Create one to get started!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lists.map((list) => (
            <li
              key={list._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <Link href={`/shopping-lists/${list._id}`}>
                <strong>{list.title}</strong>
              </Link>
              <p>Items: {list.items?.length || "No items added"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
