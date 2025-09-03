// path: src/app/ingredients/[id]/page.tsx
/**
 * IngredientDetailPage
 * Shows details of a single ingredient
 * Allows editing or deleting if desired
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
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    if (id) fetchIngredient();
  }, [id]);

  const fetchIngredient = async () => {
    const res = await fetch(`/api/ingredients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setIngredient(data.data || null);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    const res = await fetch(`/api/ingredients/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) router.push("/ingredients");
  };

  if (!ingredient) return <p>Loading...</p>;

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
