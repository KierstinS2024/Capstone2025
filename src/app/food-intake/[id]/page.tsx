// path: src/app/food-intake/[id]/page.tsx
/**
 * Edit Food Intake Page
 * --------------------
 * Loads an existing food intake entry by ID.
 * Lets the user:
 *  - Update date
 *  - Change recipe or ingredient
 *  - Update quantity and unit
 *  - Save changes back to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFoodIntakePage() {
  const params = useParams();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("unit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing entry
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/food-intake/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          const entry = data.data;
          setDate(entry.date.split("T")[0]);
          setRecipeId(entry.recipeId || "");
          setIngredientId(entry.ingredientId || "");
          setQuantity(entry.quantity);
          setUnit(entry.unit);
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

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/food-intake/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date, recipeId, ingredientId, quantity, unit }),
      });

      if (res.ok) {
        router.push("/food-intake");
      } else {
        console.error("Failed to update food intake");
      }
    } catch (err) {
      console.error("Error updating food intake:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading entry...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Food Intake</h1>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

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

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
