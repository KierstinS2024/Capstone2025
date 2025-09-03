// path: src/app/recipes/page.tsx
/**
 * RecipeListPage
 * Displays all recipes for the logged-in user
 * Supports search by name
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Recipe {
  _id: string;
  name: string;
  description: string;
  cuisine?: string;
}

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch recipes from API
  const fetchRecipes = async () => {
    const res = await fetch(
      `/api/recipes${search ? `?search=${search}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setRecipes(data.recipes || []);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Link
            key={recipe._id}
            href={`/recipes/${recipe._id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-bold">{recipe.name}</h2>
            <p>{recipe.description}</p>
            {recipe.cuisine && (
              <p className="italic text-sm">{recipe.cuisine}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
