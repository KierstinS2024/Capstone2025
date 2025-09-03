// path: src/app/shopping-lists/page.tsx
/**
 * Shopping Lists List Page
 * ------------------------
 * Displays all shopping lists for the logged-in user.
 * Lets the user:
 *  - View their saved lists
 *  - Navigate to create a new list
 *  - Click on a list to edit it
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // CSS Module for scoped styles

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all shopping lists for the user
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

  if (loading)
    return <p className={styles.container}>Loading shopping lists...</p>;

  return (
    <div className={styles.container}>
      <h1>My Shopping Lists</h1>

      {/* Button to create a new list */}
      <div className={styles.actions}>
        <Link href="/shopping-lists/new">
          <button>Create New Shopping List</button>
        </Link>
      </div>

      {/* No lists yet */}
      {lists.length === 0 ? (
        <p>You don’t have any shopping lists yet. Create one to get started!</p>
      ) : (
        <ul className={styles.list}>
          {lists.map((list) => (
            <li key={list._id} className={styles.card}>
              <Link href={`/shopping-lists/${list._id}`}>
                <strong>{list.title}</strong>
              </Link>
              <p>Items: {list.items?.length || 0}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
