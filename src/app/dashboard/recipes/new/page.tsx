// path: src/app/dashboard/recipes/new/page.tsx
/**
 * New Recipe Page
 * ----------------
 * Form to create a new recipe
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
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const client = getApiClient(token || undefined);
      await client.post("/recipes", { name, description, cuisine });
      router.push("/dashboard/recipes");
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>New Recipe</h1>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Cuisine</label>
        <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Create Recipe"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
