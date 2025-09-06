// path: src/app/dashboard/recipes/page.tsx
/**
 * DashboardRecipesPage
 * -------------------
 * Shows all user and external recipes in the dashboard.
 * Features:
 *  - Search recipes (user + external)
 *  - Click to view/edit user recipes
 *  - Add external recipes to meal plans
 *  - Handles loading and error states
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RecipeCard, { Recipe } from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";

export default function DashboardRecipesPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Fetch user recipes
  const fetchUserRecipes = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch user recipes");
      // Map data to ensure TS-safe Recipe type
      const recipes: Recipe[] = (data.data || []).map((r: any) => ({
        _id: r._id ?? "",
        name: r.name ?? "",
        description: r.description ?? "",
        cuisine: r.cuisine ?? "",
        ingredients: (r.ingredients || []).map((ing: any) => ({
          ingredientId: ing.ingredientId ?? "",
          name: ing.name ?? "",
          quantity: ing.quantity ?? 1,
          unit: ing.unit ?? "",
        })),
        instructions: r.instructions ?? [""],
        source: "user",
      }));
      setUserRecipes(recipes);
    } catch (err: any) {
      setError(err.message || "Error fetching user recipes");
    }
  };

  // Fetch external recipes from Spoonacular API
  const fetchExternalRecipes = async (query: string) => {
    if (!query) return setExternalRecipes([]);
    try {
      const res = await fetch(
        `/api/external/recipes?search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const recipes: Recipe[] = (data.results || []).map((r: any) => ({
        name: r.title ?? "",
        description: r.summary ?? "",
        cuisine: r.cuisine ?? "",
        ingredients: (r.extendedIngredients || []).map((ing: any) => ({
          name: ing.name ?? "",
          quantity: ing.amount ?? 1,
          unit: ing.unit ?? "",
          ingredientId: "", // no ID for external
        })),
        instructions: (r.analyzedInstructions || [])
          .flatMap((instr: any) => instr.steps.map((s: any) => s.step))
          .filter(Boolean) || [""],
        source: "spoonacular",
        externalId: r.id?.toString() ?? "",
      }));
      setExternalRecipes(recipes);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserRecipes().finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchExternalRecipes(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleEdit = (recipe: Recipe) => setEditingRecipe(recipe);

  const handleDelete = async (_id?: string) => {
    if (!_id || !token) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Error deleting recipe: ${data.message || "Unknown error"}`);
      } else {
        setUserRecipes((prev) => prev.filter((r) => r._id !== _id));
        alert("Recipe deleted successfully");
      }
    } catch (err) {
      alert(`Network error: ${err}`);
    }
  };

  const handleSave = () => {
    setEditingRecipe(null);
    fetchUserRecipes();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Recipes</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            setEditingRecipe({
              _id: "",
              name: "",
              description: "",
              cuisine: "",
              instructions: [""],
              ingredients: [
                { name: "", quantity: 1, unit: "", ingredientId: "" },
              ],
              source: "user",
            })
          }
        >
          Create New Recipe
        </button>

        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      {editingRecipe && (
        <RecipeForm
          initialData={{
            _id: editingRecipe._id ?? "",
            name: editingRecipe.name ?? "",
            description: editingRecipe.description ?? "",
            cuisine: editingRecipe.cuisine ?? "",
            instructions: editingRecipe.instructions ?? [""],
            ingredients: editingRecipe.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId ?? "",
              name: ing.name ?? "",
              quantity: Number(ing.quantity) || 1,
              unit: ing.unit ?? "",
            })),
            source: editingRecipe.source ?? "user",
          }}
          onSave={handleSave}
        />
      )}

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>User Recipes</h2>
      {userRecipes.length === 0 ? (
        <p>No user recipes found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {userRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              showActions
              onEdit={() => handleEdit(recipe)}
              onDelete={() => handleDelete(recipe._id)}
            />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "30px" }}>External Recipes</h2>
      {externalRecipes.length === 0 && searchTerm ? (
        <p>No external recipes found for "{searchTerm}".</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {externalRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.externalId ?? recipe.name}
              recipe={recipe}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
