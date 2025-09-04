// path: src/app/food-intake/new/page.tsx
/**
 * Create Food Intake Entry Page
 * -----------------------------
 * Users can add a new food intake entry with recipe, meal type, servings, and date.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function NewFoodIntakePage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [recipeId, setRecipeId] = useState("");
  const [servings, setServings] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date, mealType, recipeId, servings }),
      });
      if (res.ok) router.push("/food-intake");
      else console.error("Failed to create food intake entry");
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
            {["Breakfast", "Lunch", "Dinner"].map((meal) => (
              <option key={meal}>{meal}</option>
            ))}
          </select>
        </label>

        <label>
          Recipe ID:
          <input
            type="text"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
          />
        </label>

        <label>
          Servings:
          <input
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value))}
          />
        </label>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
