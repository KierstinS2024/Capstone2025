// path: src/app/food-intake/page.tsx
/**
 * FoodIntakeListPage.tsx
 * ----------------------
 * Displays all food intake entries for the logged-in user.
 * Users can view, edit, or add new entries.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface FoodEntry {
  _id: string;
  date: string;
  mealType: string;
  foodName: string;
  calories?: number;
}

export default function FoodIntakeListPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/food-intake");
        setEntries(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Error loading food intake entries");
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
        <header>
          <h1>Food Intake</h1>
          <Link href="/food-intake/new">
            <button>+ New Entry</button>
          </Link>
        </header>
        {loading && <p>Loading entries...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {entries.map((e) => (
              <li
                key={e._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>{e.foodName}</strong> ({e.mealType}) on{" "}
                {e.date.split("T")[0]}
                {e.calories && <p>Calories: {e.calories}</p>}
                <div>
                  <Link href={`/food-intake/${e._id}`}>View</Link>
                  {" | "}
                  <Link href={`/food-intake/${e._id}/edit`}>Edit</Link>
                </div>
              </li>
            ))}
            {entries.length === 0 && <li>No entries yet. Add one!</li>}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
