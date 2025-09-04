// path: src/app/food-intake/page.tsx
/**
 * Food Intake List Page
 * ---------------------
 * Lists all food intake entries for the logged-in user.
 * Users can create a new entry or edit existing ones.
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

  if (loading)
    return <p style={{ padding: "20px" }}>Loading food intake entries...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Food Intake</h1>
        <Link href="/food-intake/new">
          <button>+ New Entry</button>
        </Link>

        {entries.length === 0 ? (
          <p>No food intake entries yet. Add one!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {entries.map((entry) => (
              <li
                key={entry._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link href={`/food-intake/${entry._id}`}>
                  <strong>{entry.date}</strong>
                </Link>
                <p>Meal: {entry.mealType}</p>
                <p>Recipe: {entry.recipeName || "N/A"}</p>
                <p>Servings: {entry.servings}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
