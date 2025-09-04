// path: src/app/dashboard/recipes/new/page.tsx
/**
 * NewRecipePage.tsx
 * -----------------
 * Form for creating a new recipe.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/recipes", { name, description, cuisine });
      router.push("/dashboard/recipes");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>New Recipe</h1>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Cuisine:</label>
          <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
