// path: src/app/food-intake/[id]/page.tsx
/**
 * Edit Food Intake Entry Page
 * ---------------------------
 * Loads an existing food intake entry from the backend by ID.
 * Lets the user:
 *  - Update date
 *  - Change recipe or ingredient
 *  - Update quantity and unit
 *  - Save changes back to the backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFoodIntakePage() {
  const params = useParams(); // Read dynamic [id] param
  const router = useRouter();

  // Local state for the food intake fields
  const [recipeId, setRecipeId] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("grams");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing entry when component mounts
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/food-intake/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setRecipeId(data.data.recipeId || "");
          setIngredientId(data.data.ingredientId || "");
          setQuantity(data.data.quantity);
          setUnit(data.data.unit);
          setDate(data.data.date.split("T")[0]); // trim time
        } else {
          console.error("Failed to load food intake entry");
        }
      } catch (err) {
        console.error("Error fetching food intake entry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params.id]);

  // Save updated entry to backend
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/food-intake/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ recipeId, ingredientId, quantity, unit, date }),
      });

      if (res.ok) {
        router.push("/food-intake"); // back to list
      } else {
        console.error("Failed to update food intake entry");
      }
    } catch (err) {
      console.error("Error updating food intake entry:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading food intake entry...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Food Intake Entry</h1>

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
            placeholder="Enter recipe ID (optional)"
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
            placeholder="Enter ingredient ID (optional)"
          />
        </label>
      </div>

      {/* Quantity and unit */}
      <div>
        <label>
          Quantity:
          <input
            type="number"
            min="0"
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
