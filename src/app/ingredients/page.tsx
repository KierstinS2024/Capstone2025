// path: src/app/ingredients/page.tsx
/**
 * IngredientsListPage
 * Displays all ingredients for the logged-in user
 * Allows searching and navigating to ingredient details
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  defaultQuantity: number;
}

export default function IngredientsListPage() {
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    const res = await fetch(`/api/ingredients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setIngredients(data.data || []);
  };

  // Simple search filter
  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ingredients</h1>

      <input
        type="text"
        placeholder="Search ingredients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredIngredients.map((ing) => (
          <Link
            key={ing._id}
            href={`/ingredients/${ing._id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-bold">{ing.name}</h2>
            <p>
              Default: {ing.defaultQuantity} {ing.unit}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
