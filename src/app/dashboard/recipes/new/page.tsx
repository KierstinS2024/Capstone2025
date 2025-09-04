// path: src/app/dashboard/recipes/new/page.tsx
/**
 * Create Recipe Page
 * ------------------
 * Allows users to create a new recipe.
 * Users can:
 *  - Enter recipe name, description, and cuisine
 *  - Save recipe to backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const client = getApiClient(token || undefined);
      const res = await client.post("/recipes", { name, description, cuisine });
      if (res.status === 201) router.push("/dashboard/recipes");
      else console.error("Failed to create recipe");
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Create Recipe</h1>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Cuisine:
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </label>

        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
