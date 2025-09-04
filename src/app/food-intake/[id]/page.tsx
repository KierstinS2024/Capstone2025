// path: src/app/food-intake/[id]/page.tsx
/**
 * Edit Food Intake Entry Page
 * ---------------------------
 * Users can edit an existing food intake entry.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function EditFoodIntakePage() {
  const params = useParams();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [recipeId, setRecipeId] = useState("");
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/food-intake/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDate(data.data.date || "");
          setMealType(data.data.mealType || "Breakfast");
          setRecipeId(data.data.recipeId || "");
          setServings(data.data.servings || 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [params.id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/food-intake/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date, mealType, recipeId, servings }),
      });
      if (res.ok) router.push("/food-intake");
      else console.error("Failed to update food intake entry");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading food intake entry...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Food Intake Entry</h1>

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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
