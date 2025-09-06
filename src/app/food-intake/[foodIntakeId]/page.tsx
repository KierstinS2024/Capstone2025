// path: src/app/food-intake/[foodIntakeId]/page.tsx
/**
 * EditFoodIntakePage.tsx
 * ----------------------
 * Allows editing an existing food intake entry.
 * Features:
 *  - Edit date, meal type, food name, and calories
 *  - Validation: food name required, calories >= 0
 *  - Saves changes to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function EditFoodIntakePage() {
  const { foodIntakeId } = useParams();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load entry
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/food-intake/${foodIntakeId}`);
        const data = res.data;
        setDate(data.date.split("T")[0]);
        setMealType(data.mealType);
        setFoodName(data.foodName);
        setCalories(data.calories ?? "");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching food intake entry");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [foodIntakeId]);

  // Validation
  const validate = (): string | null => {
    if (!foodName.trim()) return "Food name is required";
    if (calories !== "" && calories < 0) return "Calories must be >= 0";
    return null;
  };

  // Submit
  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/food-intake/${foodIntakeId}`, {
        date,
        mealType,
        foodName,
        calories,
      });
      router.push("/food-intake");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update entry");
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
        {error && <p style={{ color: "red" }}>{error}</p>}

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
              <option key={meal} value={meal}>
                {meal}
              </option>
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
            min={0}
            value={calories}
            onChange={(e) =>
              setCalories(e.target.value === "" ? "" : parseInt(e.target.value))
            }
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
