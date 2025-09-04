// path: src/app/food-intake/[id]/page.tsx
/**
 * EditFoodIntakePage.tsx
 * ----------------------
 * Allows editing an existing food intake entry.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function EditFoodIntakePage() {
  const params = useParams();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/food-intake/${params.id}`);
        setDate(res.data.date.split("T")[0]);
        setMealType(res.data.mealType);
        setFoodName(res.data.foodName);
        setCalories(res.data.calories || "");
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
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/food-intake/${params.id}`, {
        date,
        mealType,
        foodName,
        calories,
      });
      router.push("/food-intake");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading entry…</p>;

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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
