// path: src/app/food-intake/new/page.tsx
/**
 * New Food Intake Page
 * -------------------
 * Form to log a new food entry for the user.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function NewFoodIntakePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, calories, date }),
      });
      if (res.ok) router.push("/food-intake");
      else console.error("Failed to create food intake entry");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Log Food Intake</h1>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Calories:</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(parseInt(e.target.value))}
        />
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
