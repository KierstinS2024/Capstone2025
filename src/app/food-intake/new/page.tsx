// path: src/app/food-intake/new/page.tsx
/**
 * New Food Intake Page
 * -------------------
 * Lets the user log a new food intake entry:
 *  - Select a recipe or ingredient
 *  - Enter quantity
 *  - Select unit
 *  - Submit to save to backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFoodIntakePage() {
  const router = useRouter();

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [recipeId, setRecipeId] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("unit");
  const [saving, setSaving] = useState(false);

  // Submit new entry to backend
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date, recipeId, ingredientId, quantity, unit }),
      });

      if (res.ok) {
        router.push("/food-intake");
      } else {
        console.error("Failed to log food intake");
      }
    } catch (err) {
      console.error("Error saving food intake:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Log Food Intake</h1>

      {/* Date input */}
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {/* Recipe / Ingredient selection */}
      <div>
        <label>
          Recipe ID:
          <input
            type="text"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
            placeholder="Leave empty if using ingredient"
          />
        </label>
      </div>
      <div>
        <label>
          Ingredient ID:
          <input
            type="text"
            value={ingredientId}
            onChange={(e) => setIngredientId(e.target.value)}
            placeholder="Leave empty if using recipe"
          />
        </label>
      </div>

      {/* Quantity and unit */}
      <div>
        <label>
          Quantity:
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Unit:
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </label>
      </div>

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Food Intake"}
        </button>
      </div>
    </div>
  );
}
