// path: src/app/dashboard/recipes/page.tsx
/**      
 * Recipes List Page
 * -----------------
 * Shows all user recipes.
 * From here, the user can:
 *  - Create a new recipe
 *  - Import from Spoonacular
 *  - Click a recipe to view or edit
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
  importedFrom?: string; // optional field if imported from Spoonacular
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user recipes from backend
  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      const res = await client.get("/recipes");
      setRecipes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Recipes</h1>
          <div>
            <Link href="/dashboard/recipes/new">
              <button>Create New</button>
            </Link>
            {/* Spoonacular integration button */}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => alert("Spoonacular import modal coming soon")}
            >
              Import from Spoonacular
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found. Create one or import from Spoonacular.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {recipes.map((r) => (
              <li
                key={r._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link href={`/dashboard/recipes/${r._id}/view`}>
                  <strong>{r.name}</strong>
                </Link>
                <p>{r.description || "No description"}</p>
                {r.cuisine && <p>Cuisine: {r.cuisine}</p>}
                {r.importedFrom && <p>Imported from {r.importedFrom}</p>}
                <div style={{ marginTop: "5px" }}>
                  <Link href={`/dashboard/recipes/${r._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
