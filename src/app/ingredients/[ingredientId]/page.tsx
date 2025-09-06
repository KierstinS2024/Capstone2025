// path: src/app/ingredients/[ingredientId]/page.tsx
/**
 * EditIngredientPage.tsx
 * ----------------------
 * Allows editing an existing ingredient.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function EditIngredientPage() {
  const { ingredientId } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [caloriesPerUnit, setCaloriesPerUnit] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/ingredients/${ingredientId}`);
        const data = res.data;

        setName(data.name);
        setUnit(data.unit);
        setCaloriesPerUnit(data.caloriesPerUnit ?? "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredient();
  }, [ingredientId]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/ingredients/${ingredientId}`, {
        name,
        unit,
        caloriesPerUnit,
      });
      router.push("/ingredients");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading ingredient…</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Ingredient</h1>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Unit:
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </label>

        <label>
          Calories per Unit:
          <input
            type="number"
            value={caloriesPerUnit}
            onChange={(e) =>
              setCaloriesPerUnit(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
          />
        </label>

        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
