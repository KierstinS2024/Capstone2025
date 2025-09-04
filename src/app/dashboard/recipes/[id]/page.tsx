// path: src/app/dashboard/recipes/[id]/page.tsx
/**      
 * Edit Recipe Page
 * ----------------
 * Allows users to edit an existing recipe.
 * Users can:
 *  - Update name, description, cuisine
 *  - Save changes back to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const client = getApiClient(token || undefined);
        const res = await client.get(`/recipes/${params.id}`);
        setName(res.data.name || "");
        setDescription(res.data.description || "");
        setCuisine(res.data.cuisine || "");
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const client = getApiClient(token || undefined);
      const res = await client.put(`/recipes/${params.id}`, {
        name,
        description,
        cuisine,
      });
      if (res.status === 200) router.push("/dashboard/recipes");
      else console.error("Failed to update recipe");
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe…</p>;

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Edit Recipe</h1>

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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
