// path: src/app/food-intake/page.tsx
/**
 * Food Intake List Page
 * --------------------
 * Displays all logged food entries for the user.
 * Users can view, edit, or add new entries.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function FoodIntakePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/food-intake", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data.data || []);
        } else console.error("Failed to fetch food intake entries");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Food Intake</h1>
        <Link href="/food-intake/new">+ Log New Food</Link>
        {loading ? (
          <p>Loading food entries…</p>
        ) : entries.length === 0 ? (
          <p>No food entries logged yet.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry._id}>
                <Link href={`/food-intake/${entry._id}`}>
                  {entry.name} — {entry.calories} kcal
                </Link>
                <p>{new Date(entry.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
