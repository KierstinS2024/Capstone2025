"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Recipe {
  _id?: string;
  name: string;
  description?: string;
  instructions: string[];
  cuisine?: string;
  source?: string; // "Local" or external API
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeInstructions, setNewRecipeInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/recipes", {
        params: query ? { search: query } : {},
      });

      const combined: Recipe[] = [
        ...(response.data.localRecipes || response.data.recipes || []),
        ...(response.data.externalRecipes || []),
      ];

      setRecipes(combined);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const response = await axios.post(
        "/api/recipes",
        {
          name: newRecipeName,
          instructions: newRecipeInstructions.split("\n"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecipes((prev) => [response.data.recipe, ...prev]);
      setNewRecipeName("");
      setNewRecipeInstructions("");
    } catch (err) {
      console.error(err);
      setError("Failed to add recipe");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={() => fetchRecipes(searchTerm)} className="p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>

      {/* Add Recipe Form */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Recipe</h2>
        <input
          type="text"
          placeholder="Recipe name"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Instructions (one per line)"
          value={newRecipeInstructions}
          onChange={(e) => setNewRecipeInstructions(e.target.value)}
          className="border p-2 mb-2 w-full"
          rows={4}
        />
        <button onClick={handleAddRecipe} className="p-2 bg-green-500 text-white rounded">
          Add Recipe
        </button>
      </div>

      {loading && <p>Loading recipes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Recipe List */}
      <ul>
        {recipes.map((r, i) => (
          <li key={i} className="mb-4">
            <strong>{r.name}</strong> {r.cuisine ? `(${r.cuisine})` : ""} {r.source ? `[${r.source}]` : "[Local]"}
            <ul className="ml-4 list-disc">
              {r.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
