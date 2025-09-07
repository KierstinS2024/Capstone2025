// File: src/app/dashboard/food-intake/page.tsx
"use client";

/**
 * Food Intake Page
 * -----------------------
 * Tracks user food entries per day.
 * Features:
 * - Protected route (JWT + AuthContext)
 * - Fetch user-specific food entries from `/api/food-intake`
 * - Display by date
 * - Loading & error handling
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodIntake, FoodEntry } from "@/types/foodIntake";
import styles from "./FoodIntakePage.module.css";

// API response typing
interface FoodIntakeResponse {
  success: boolean;
  data: FoodIntake[];
  message?: string;
}

export default function FoodIntakePage() {
  return (
    <ProtectedRoute>
      <FoodIntakeContent />
    </ProtectedRoute>
  );
}

function FoodIntakeContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [foodIntake, setFoodIntake] = useState<FoodIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Fetch food intake
  // -----------------------------
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function fetchFoodIntake() {
      setLoading(true);
      try {
        const res = await fetch("/api/food-intake", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch food intake");

        const data: FoodIntakeResponse = await res.json();
        setFoodIntake(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchFoodIntake();
  }, [user, router]);

  // -----------------------------
  // Loading / Error States
  // -----------------------------
  if (loading) return <p className={styles.message}>Loading food intake...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Food Intake Tracker</h1>

      {foodIntake.length === 0 ? (
        <p className={styles.emptyMessage}>No food entries recorded yet.</p>
      ) : (
        <div className={styles.intakeList}>
          {foodIntake.map((day) => (
            <div key={day._id} className={styles.daySection}>
              <h2>{new Date(day.date).toLocaleDateString()}</h2>
              {day.entries.length === 0 ? (
                <p>No entries for this day.</p>
              ) : (
                <ul>
                  {day.entries.map((entry) => (
                    <li key={entry._id || entry.ingredientId}>
                      {entry.quantity} {entry.unit} of ingredient {entry.ingredientId} (
                      {entry.mealType})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/food-intake/new")}
      >
        + Add Food Entry
      </button>
    </main>
  );
}
