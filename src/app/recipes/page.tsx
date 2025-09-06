// src/app/recipes/page.tsx
/**
 * Recipes List Page
 * -----------------
 * Displays all recipes for the logged-in user.
 * Features:
 *  - View existing recipes
 *  - Search for external recipes
 *  - Navigate to create a new recipe
 *  - Edit or delete recipes
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RecipeCard, { Recipe } from "@/components/RecipeCard";

export default function RecipesPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  // Fetch all user recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch recipes");
        setRecipes(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  // Navigate to edit page
  const handleEdit = (id: string) => {
    router.push(`/recipes/${id}/edit`);
  };

  // Delete a recipe
  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete recipe");
      }
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error deleting recipe");
    }
  };

  // Search external recipes
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `/api/external/recipes?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch external recipes");

      // Merge external recipes with user recipes
      const merged: Recipe[] = [
        ...recipes,
        ...(data.data || []).map((r: any) => ({ ...r, source: "external" })),
      ];
      setRecipes(merged);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error searching external recipes");
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipes...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Recipes</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => router.push("/recipes/new")}>
          Create New Recipe
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search external recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <button
          type="submit"
          disabled={searching}
          style={{ marginLeft: "5px" }}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {recipes.length === 0 ? (
        <p>You have no recipes yet. Add one to get started!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id || recipe.name}
              recipe={recipe}
              showActions={recipe.source === "user"}
              onEdit={() => handleEdit(recipe._id!)}
              onDelete={() => handleDelete(recipe._id!)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
