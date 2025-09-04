// path: src/app/food-intake/page.tsx
/**
 * Food Intake List Page
 * ---------------------
 * Displays all food intake entries for the logged-in user.
 * From here, the user can:
 *  - View logged food
 *  - Navigate to add a new entry
 *  - Click on an entry to edit it
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FoodIntakePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all food intake entries for the user
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/food-intake", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data.data || []);
        } else {
          console.error("Failed to fetch food intake entries");
        }
      } catch (err) {
        console.error("Error loading food intake:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading food intake...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Food Intake Log</h1>

      {/* Button to add a new entry */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/food-intake/new">
          <button>Log New Food Intake</button>
        </Link>
      </div>

      {/* If no entries exist */}
      {entries.length === 0 ? (
        <p>No food intake logged yet. Add an entry to get started!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {entries.map((entry) => (
            <li
              key={entry._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              {/* Link to edit the entry */}
              <Link href={`/food-intake/${entry._id}`}>
                <strong>{entry.date.split("T")[0]}</strong>
              </Link>
              <p>
                {entry.recipeName || entry.ingredientName} — {entry.quantity}{" "}
                {entry.unit}
              </p>
              {entry.nutritionSnapshot && (
                <p>Calories: {entry.nutritionSnapshot.calories || "-"}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
