// path: src/app/recipes/favorites/page.tsx
/**
 * FavoritesPage.tsx
 * -----------------
 * Displays recipes the user has favorited.
 * Users can view, add to meal plan, or remove favorites.
 * External recipes cannot be edited.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

// Type-safe model for a favorite recipe
interface FavoriteRecipe {
  _id: string; // MongoDB _id for the favorite entry
  recipeId: string; // ID of the recipe (internal or external)
  name?: string;
  cuisine?: string;
  isExternal?: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingMealPlan, setSavingMealPlan] = useState<string | null>(null);

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/favorites");
        setFavorites(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Error loading favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Remove favorite
  const handleRemoveFavorite = async (recipeId: string) => {
    if (!confirm("Remove this recipe from your favorites?")) return;
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.delete(`/favorites/${recipeId}`);
      setFavorites(favorites.filter((f) => f.recipeId !== recipeId));
    } catch (err) {
      console.error(err);
      alert("Could not remove favorite");
    }
  };

  // Add recipe to meal plan
  const handleAddToMealPlan = async (recipeId: string) => {
    setSavingMealPlan(recipeId);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/meal-plan", { recipeId });
      alert("Recipe added to meal plan!");
    } catch (err) {
      console.error(err);
      alert("Could not add to meal plan");
    } finally {
      setSavingMealPlan(null);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading favorites...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Your Favorite Recipes</h1>
        {favorites.length === 0 && <p>No favorites yet. Start adding some!</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favorites.map((fav) => (
            <li
              key={fav.recipeId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>{fav.name || "Recipe"}</strong>{" "}
              {fav.cuisine && `(${fav.cuisine})`}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => router.push(`/recipes/${fav.recipeId}`)}
                  style={{ marginRight: "10px" }}
                >
                  View
                </button>
                <button
                  onClick={() => handleAddToMealPlan(fav.recipeId)}
                  disabled={savingMealPlan === fav.recipeId}
                  style={{ marginRight: "10px" }}
                >
                  {savingMealPlan === fav.recipeId
                    ? "Adding..."
                    : "Add to Meal Plan"}
                </button>
                <button
                  onClick={() => handleRemoveFavorite(fav.recipeId)}
                  style={{ color: "red" }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
