// path: src/app/food-intake/new/page.tsx
/**
 * NewFoodIntakePage.tsx
 * ---------------------
 * Allows users to add a new food intake entry.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function NewFoodIntakePage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/food-intake", { date, mealType, foodName, calories });
      router.push("/food-intake");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>New Food Intake Entry</h1>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Meal Type:
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
              <option key={meal}>{meal}</option>
            ))}
          </select>
        </label>
        <label>
          Food Name:
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </label>
        <label>
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value))}
          />
        </label>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
