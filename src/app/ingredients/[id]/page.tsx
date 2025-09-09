// path: src/app/ingredients/[id]/page.tsx
/**
 * IngredientDetailPage.tsx
 * ------------------------
 * Shows details of a single ingredient.
 * Features:
 *  - Fetches ingredient by ID
 *  - Displays default quantity, unit, and optional nutrition info
 *  - Allows deleting the ingredient
 *  - Proper loading and error states
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  defaultQuantity: number;
  nutritionInfo?: Record<string, any>;
}

export default function IngredientDetailPage() {
  const { id } = useParams(); // <— back to id
  const router = useRouter();
  const { token } = useAuth();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch ingredient details
  useEffect(() => {
    if (!id || !token) return;

    const fetchIngredient = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/ingredients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch ingredient");
        const data = await res.json();
        setIngredient(data.data || null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching ingredient");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, token]);

  // Delete ingredient
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete ingredient");
      router.push("/ingredients");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error deleting ingredient");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading ingredient…</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  if (!ingredient)
    return <p style={{ padding: "20px" }}>Ingredient not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{ingredient.name}</h1>
      <p>
        Default Quantity: {ingredient.defaultQuantity} {ingredient.unit}
      </p>

      {ingredient.nutritionInfo && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Nutrition Info</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(ingredient.nutritionInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
